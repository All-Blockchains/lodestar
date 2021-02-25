/**
 * @module network
 */

import {EventEmitter} from "events";
import LibP2p from "libp2p";
import PeerId, {createFromCID} from "peer-id";
import Multiaddr from "multiaddr";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ILogger} from "@chainsafe/lodestar-utils";
import {IBeaconMetrics} from "../metrics";
import {ReqResp, IReqRespOptions} from "./reqresp/reqResp";
import {INetworkOptions} from "./options";
import {INetwork, NetworkEvent, NetworkEventEmitter, PeerSearchOptions} from "./interface";
import {Gossip} from "./gossip/gossip";
import {IGossip, IGossipMessageValidator} from "./gossip/interface";
import {IBeaconChain} from "../chain";
import {MetadataController} from "./metadata";
import {Discv5, Discv5Discovery, ENR} from "@chainsafe/discv5";
import {DiversifyPeersBySubnetTask} from "./tasks/diversifyPeersBySubnetTask";
import {CheckPeerAliveTask} from "./tasks/checkPeerAliveTask";
import {IPeerMetadataStore} from "./peers";
import {Libp2pPeerMetadataStore} from "./peers/metastore";
import {getPeerCountBySubnet, getConnectedPeerIds} from "./peers/utils";
import {IPeerRpcScoreStore, PeerRpcScoreStore} from "./peers/score";

interface ILibp2pModules {
  config: IBeaconConfig;
  libp2p: LibP2p;
  logger: ILogger;
  metrics: IBeaconMetrics;
  validator: IGossipMessageValidator;
  chain: IBeaconChain;
}

export class Libp2pNetwork extends (EventEmitter as {new (): NetworkEventEmitter}) implements INetwork {
  public peerId: PeerId;
  public localMultiaddrs!: Multiaddr[];
  public reqResp: ReqResp;
  public gossip: IGossip;
  public metadata: MetadataController;
  public peerMetadata: IPeerMetadataStore;
  public peerRpcScores: IPeerRpcScoreStore;

  private opts: INetworkOptions;
  private config: IBeaconConfig;
  private chain: IBeaconChain;
  private libp2p: LibP2p;
  private logger: ILogger;
  private metrics: IBeaconMetrics;
  private diversifyPeersTask: DiversifyPeersBySubnetTask;
  private checkPeerAliveTask: CheckPeerAliveTask;

  public constructor(
    opts: INetworkOptions & IReqRespOptions,
    {config, libp2p, logger, metrics, validator, chain}: ILibp2pModules
  ) {
    super();
    this.opts = opts;
    this.config = config;
    this.chain = chain;
    this.logger = logger;
    this.metrics = metrics;
    this.peerId = libp2p.peerId;
    this.libp2p = libp2p;
    this.peerMetadata = new Libp2pPeerMetadataStore(this.config, this.libp2p.peerStore.metadataBook);
    this.peerRpcScores = new PeerRpcScoreStore(this.peerMetadata);
    this.reqResp = new ReqResp(
      {config, libp2p, peerMetadata: this.peerMetadata, peerRpcScores: this.peerRpcScores, logger},
      opts
    );
    this.metadata = new MetadataController({}, {config, chain, logger});
    this.gossip = (new Gossip(opts, {config, libp2p, logger, validator, chain}) as unknown) as IGossip;
    this.diversifyPeersTask = new DiversifyPeersBySubnetTask(this.config, {
      network: this,
      logger: this.logger,
    });
    this.checkPeerAliveTask = new CheckPeerAliveTask(this.config, {
      network: this,
      logger: this.logger,
    });
  }

  public async start(): Promise<void> {
    this.libp2p.connectionManager.on(NetworkEvent.peerConnect, this.emitPeerConnect);
    this.libp2p.connectionManager.on(NetworkEvent.peerDisconnect, this.emitPeerDisconnect);
    await this.libp2p.start();
    this.localMultiaddrs = this.libp2p.multiaddrs;
    this.reqResp.start();
    const enr = this.getEnr();
    this.metadata.start(enr!);
    await this.gossip.start();
    this.diversifyPeersTask.start();
    const multiaddresses = this.libp2p.multiaddrs.map((m) => m.toString()).join(",");
    this.logger.info(`PeerId ${this.libp2p.peerId.toB58String()}, Multiaddrs ${multiaddresses}`);
  }

  public async stop(): Promise<void> {
    this.libp2p.connectionManager.removeListener(NetworkEvent.peerConnect, this.emitPeerConnect);
    this.libp2p.connectionManager.removeListener(NetworkEvent.peerDisconnect, this.emitPeerDisconnect);
    await Promise.all([this.diversifyPeersTask.stop(), this.checkPeerAliveTask.stop()]);
    this.metadata.stop();
    await this.gossip.stop();
    this.reqResp.stop();
    await this.libp2p.stop();
  }

  public async handleSyncCompleted(): Promise<void> {
    await Promise.all([this.checkPeerAliveTask.start(), this.diversifyPeersTask.handleSyncCompleted()]);
  }

  public getEnr(): ENR | undefined {
    const discv5Discovery = this.libp2p._discovery.get("discv5") as Discv5Discovery;
    return discv5Discovery?.discv5?.enr ?? undefined;
  }

  /**
   * Get connected peers.
   * @param opts PeerSearchOptions
   */
  public getPeers(opts: Partial<PeerSearchOptions> = {}): LibP2p.Peer[] {
    const peerIdStrs = Array.from(this.libp2p.connectionManager.connections.keys());
    const peerIds = peerIdStrs
      .map((peerIdStr) => createFromCID(peerIdStr))
      .filter((peerId) => this.getPeerConnection(peerId));
    const peers = peerIds
      .map((peerId) => this.libp2p.peerStore.get(peerId))
      .filter((peer) => {
        if (!peer) return false;
        if (opts?.supportsProtocols) {
          const supportsProtocols = opts.supportsProtocols;
          this.logger.debug("Peer supported protocols", {
            id: peer.id.toB58String(),
            protocols: peer.protocols,
          });
          for (const protocol of supportsProtocols) {
            if (!peer.protocols.includes(protocol)) {
              return false;
            }
          }
          return true;
        }
        return true;
      }) as LibP2p.Peer[];

    return peers.slice(0, opts?.count ?? peers.length) || [];
  }

  /**
   * Get all peers including disconnected ones.
   * There are probably more than 10k peers, only the api uses this.
   */
  public getAllPeers(): LibP2p.Peer[] {
    return Array.from(this.libp2p.peerStore.peers.values());
  }

  public getMaxPeer(): number {
    return this.opts.maxPeers;
  }

  public hasPeer(peerId: PeerId, connected = false): boolean {
    const peer = this.libp2p.peerStore.get(peerId);
    if (!peer) {
      return false;
    }

    if (connected) {
      const conn = this.getPeerConnection(peerId);
      if (!conn || conn.stat.status !== "open") {
        return false;
      }
    }

    return true;
  }

  public getPeerConnection(peerId: PeerId): LibP2pConnection | null {
    return this.libp2p.connectionManager.get(peerId);
  }

  public async connect(peerId: PeerId, localMultiaddrs?: Multiaddr[]): Promise<void> {
    if (localMultiaddrs) {
      this.libp2p.peerStore.addressBook.add(peerId, localMultiaddrs);
    }

    await this.libp2p.dial(peerId);
  }

  public async disconnect(peerId: PeerId): Promise<void> {
    try {
      await this.libp2p.hangUp(peerId);
    } catch (e) {
      this.logger.warn("Unclean disconnect", {reason: e.message});
    }
  }

  public async searchSubnetPeers(subnets: string[]): Promise<void> {
    const connectedPeerIds = this.getPeers().map((peer) => peer.id);

    const peerCountBySubnet = getPeerCountBySubnet(connectedPeerIds, this.peerMetadata, subnets);
    for (const [subnetStr, count] of peerCountBySubnet) {
      if (count === 0) {
        // the validator must discover new peers on this topic
        this.logger.verbose("Finding new peers", {subnet: subnetStr});
        const found = await this.connectToNewPeersBySubnet(parseInt(subnetStr));
        if (found) {
          this.logger.verbose("Found new peer", {subnet: subnetStr});
        } else {
          this.logger.verbose("Not found any peers", {subnet: subnetStr});
        }
      }
    }
  }

  public async reStatusPeers(peers: PeerId[]): Promise<void> {
    const localStatus = this.chain.getStatus();
    await Promise.all(
      peers.map(async (peer) => {
        try {
          this.peerMetadata.status.set(peer, await this.reqResp.status(peer, localStatus));
          // eslint-disable-next-line no-empty
        } catch {}
      })
    );
  }

  public getConnectedPeers(): PeerId[] {
    return getConnectedPeerIds(this.libp2p);
  }

  /**
   * Connect to 1 new peer given a subnet.
   * @param subnet the subnet calculated from committee index
   */
  private async connectToNewPeersBySubnet(subnet: number): Promise<boolean> {
    const discv5Peers = (await this.searchDiscv5Peers(subnet)) || [];
    // we don't want to connect to known peers
    const candidatePeers = discv5Peers.filter(
      (peer) => !this.libp2p.peerStore.addressBook.getMultiaddrsForPeer(peer.peerId)
    );

    let found = false;
    for (const peer of candidatePeers) {
      // will automatically get metadata once we connect
      try {
        await this.connect(peer.peerId, [peer.multiaddr]);
        found = true;
        break;
      } catch (e) {
        // this runs too frequently so make it verbose
        this.logger.verbose("Cannot connect to peer", {peerId: peer.peerId.toB58String(), subnet, error: e.message});
      }
    }

    return found;
  }

  private searchDiscv5Peers = async (subnet: number): Promise<{peerId: PeerId; multiaddr: Multiaddr}[]> => {
    const discovery: Discv5Discovery = this.libp2p._discovery.get("discv5") as Discv5Discovery;
    const discv5: Discv5 = discovery.discv5;

    return await Promise.all(
      discv5
        .kadValues()
        .filter((enr: ENR) => enr.get("attnets"))
        .filter((enr: ENR) => {
          try {
            return this.config.types.phase0.AttestationSubnets.deserialize(enr.get("attnets")!)[subnet];
          } catch (err) {
            return false;
          }
        })
        .map((enr: ENR) =>
          enr.peerId().then((peerId) => {
            return {peerId, multiaddr: enr.getLocationMultiaddr("tcp")!};
          })
        )
    );
  };

  private emitPeerConnect = (conn: LibP2pConnection): void => {
    this.metrics.peers.inc();
    this.logger.verbose("peer connected", {peerId: conn.remotePeer.toB58String(), direction: conn.stat.direction});

    // tmp fix, we will just do double status exchange but nothing major
    // TODO: fix it?
    this.emit(NetworkEvent.peerConnect, conn.remotePeer, conn.stat.direction);
  };

  private emitPeerDisconnect = (conn: LibP2pConnection): void => {
    this.logger.verbose("peer disconnected", {peerId: conn.remotePeer.toB58String()});
    this.metrics.peers.dec();
    this.emit(NetworkEvent.peerDisconnect, conn.remotePeer);
  };
}
