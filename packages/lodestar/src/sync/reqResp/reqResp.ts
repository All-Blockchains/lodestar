/**
 * @module sync
 */

import {computeStartSlotAtEpoch, GENESIS_SLOT, getBlockRootAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {
  BeaconBlocksByRangeRequest,
  BeaconBlocksByRootRequest,
  Goodbye,
  MAX_REQUEST_BLOCKS,
  Ping,
  RequestBody,
  SignedBeaconBlock,
  Status,
} from "@chainsafe/lodestar-types";
import {ILogger} from "@chainsafe/lodestar-utils";
import {toHexString} from "@chainsafe/ssz";
import PeerId from "peer-id";
import {IBeaconChain} from "../../chain";
import {GENESIS_EPOCH, Method, RpcResponseStatus, ZERO_HASH} from "../../constants";
import {IBeaconDb} from "../../db";
import {IBlockFilterOptions} from "../../db/api/beacon/repositories";
import {createRpcProtocol, INetwork} from "../../network";
import {RpcError} from "../../network/error";
import {handlePeerMetadataSequence} from "../../network/peers/utils";
import {ReqRespRequest} from "../../network/reqresp";
import {sendResponse, sendResponseStream} from "../../network/reqresp/respUtils";
import {createStatus, syncPeersStatus} from "../utils/sync";
import {IReqRespHandler} from "./interface";

export interface IReqRespHandlerModules {
  config: IBeaconConfig;
  db: IBeaconDb;
  chain: IBeaconChain;
  network: INetwork;
  logger: ILogger;
}

enum GoodByeReasonCode {
  CLIENT_SHUTDOWN = 1,
  IRRELEVANT_NETWORK = 2,
  ERROR = 3,
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const GoodbyeReasonCodeDescriptions: Record<string, string> = {
  // spec-defined codes
  1: "Client shutdown",
  2: "Irrelevant network",
  3: "Internal fault/error",

  // Teku-defined codes
  128: "Unable to verify network",

  // Lighthouse-defined codes
  129: "Client has too many peers",
  250: "Peer score too low",
  251: "Peer banned this node",
};

/**
 * The BeaconReqRespHandler module handles app-level requests / responses from other peers,
 * fetching state from the chain and database as needed.
 */
export class BeaconReqRespHandler implements IReqRespHandler {
  private config: IBeaconConfig;
  private db: IBeaconDb;
  private chain: IBeaconChain;
  private network: INetwork;
  private logger: ILogger;

  public constructor({config, db, chain, network, logger}: IReqRespHandlerModules) {
    this.config = config;
    this.db = db;
    this.chain = chain;
    this.network = network;
    this.logger = logger;
  }

  public async start(): Promise<void> {
    this.network.reqResp.on("request", this.onRequest);
    this.network.on("peer:connect", this.handshake);
    const myStatus = await createStatus(this.chain);
    await syncPeersStatus(this.network, myStatus);
  }

  public async stop(): Promise<void> {
    this.network.removeListener("peer:connect", this.handshake);
    await Promise.all(
      this.network
        .getPeers({connected: true, supportsProtocols: [createRpcProtocol(Method.Goodbye, "ssz_snappy")]})
        .map(async (peer) => {
          try {
            await this.network.reqResp.goodbye(peer.id, BigInt(GoodByeReasonCode.CLIENT_SHUTDOWN));
          } catch (e) {
            this.logger.verbose("Failed to send goodbye", {reason: e.message});
          }
        })
    );
    this.network.reqResp.removeListener("request", this.onRequest);
  }

  public onRequest = async (
    request: ReqRespRequest<RequestBody | null>,
    peerId: PeerId,
    sink: Sink<unknown, unknown>
  ): Promise<void> => {
    switch (request.method) {
      case Method.Status:
        return await this.onStatus(request as ReqRespRequest<Status>, peerId, sink);
      case Method.Goodbye:
        return await this.onGoodbye(request as ReqRespRequest<Goodbye>, peerId, sink);
      case Method.Ping:
        return await this.onPing(request as ReqRespRequest<Ping>, peerId, sink);
      case Method.Metadata:
        return await this.onMetadata(request as ReqRespRequest<null>, peerId, sink);
      case Method.BeaconBlocksByRange:
        return await this.onBeaconBlocksByRange(request as ReqRespRequest<BeaconBlocksByRangeRequest>, peerId, sink);
      case Method.BeaconBlocksByRoot:
        return await this.onBeaconBlocksByRoot(request as ReqRespRequest<BeaconBlocksByRootRequest>, peerId, sink);
      default:
        this.logger.error("Invalid request - unsupported method", {
          id: request.id,
          method: request.method,
          peer: peerId.toB58String(),
        });
    }
  };

  public async onStatus(request: ReqRespRequest<Status>, peerId: PeerId, sink: Sink<unknown, unknown>): Promise<void> {
    if (await this.shouldDisconnectOnStatus(request.body)) {
      try {
        await this.network.reqResp.goodbye(peerId, BigInt(GoodByeReasonCode.IRRELEVANT_NETWORK));
      } catch {
        // ignore error
        return;
      }
    }
    // set status on peer
    this.network.peerMetadata.setStatus(peerId, request.body);
    // send status response
    try {
      const status = await createStatus(this.chain);
      await sendResponse(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        null,
        status
      );
    } catch (e) {
      this.logger.error("Failed to create response status", e.message);
      await sendResponse(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        e
      );
    }
  }

  public async shouldDisconnectOnStatus(request: Status): Promise<boolean> {
    const currentForkDigest = await this.chain.getForkDigest();
    if (!this.config.types.ForkDigest.equals(currentForkDigest, request.forkDigest)) {
      this.logger.verbose(
        "Fork digest mismatch " +
          `expected=${toHexString(currentForkDigest)} received=${toHexString(request.forkDigest)}`
      );
      return true;
    }
    if (request.finalizedEpoch === GENESIS_EPOCH) {
      if (!this.config.types.Root.equals(request.finalizedRoot, ZERO_HASH)) {
        this.logger.verbose(
          "Genesis finalized root must be zeroed " +
            `expected=${toHexString(ZERO_HASH)} received=${toHexString(request.finalizedRoot)}`
        );
        return true;
      }
    } else {
      // we're on a further (or equal) finalized epoch
      // but the peer's block root at that epoch may not match match ours
      const headSummary = this.chain.forkChoice.getHead();
      const finalizedCheckpoint = this.chain.forkChoice.getFinalizedCheckpoint();
      const requestFinalizedSlot = computeStartSlotAtEpoch(this.config, request.finalizedEpoch);

      if (request.finalizedEpoch === finalizedCheckpoint.epoch) {
        if (!this.config.types.Root.equals(request.finalizedRoot, finalizedCheckpoint.root)) {
          this.logger.verbose(
            "Status with same finalized epoch has different root " +
              `expected=${toHexString(finalizedCheckpoint.root)} received=${toHexString(request.finalizedRoot)}`
          );
          return true;
        }
      } else if (request.finalizedEpoch < finalizedCheckpoint.epoch) {
        // If it is within recent history, we can directly check against the block roots in the state
        if (headSummary.slot - requestFinalizedSlot < this.config.params.SLOTS_PER_HISTORICAL_ROOT) {
          const headState = await this.chain.getHeadState();
          // This will get the latest known block at the start of the epoch.
          const expected = getBlockRootAtSlot(this.config, headState, requestFinalizedSlot);
          if (!this.config.types.Root.equals(request.finalizedRoot, expected)) {
            this.logger.verbose("Status with different finalized root", {
              received: toHexString(request.finalizedRoot),
              epected: toHexString(expected),
              epoch: request.finalizedEpoch,
            });
            return true;
          }
        } else {
          // finalized checkpoint of status is from an old long-ago epoch.
          // We need to ask the chain for most recent canonical block at the finalized checkpoint start slot.
          // The problem is that the slot may be a skip slot.
          // And the block root may be from multiple epochs back even.
          // The epoch in the checkpoint is there to checkpoint the tail end of skip slots, even if there is no block.
          // TODO: accepted for now. Need to maintain either a list of finalized block roots,
          // or inefficiently loop from finalized slot backwards, until we find the block we need to check against.
          return false;
        }
      } else {
        // request status finalized checkpoint is in the future, we do not know if it is a true finalized root
        this.logger.verbose(
          "Status with future finalized epoch " + `${request.finalizedEpoch}: ${toHexString(request.finalizedRoot)}`
        );
      }
    }
    return false;
  }

  public async onGoodbye(
    request: ReqRespRequest<Goodbye>,
    peerId: PeerId,
    sink: Sink<unknown, unknown>
  ): Promise<void> {
    this.logger.info("Received goodbye request", {
      peer: peerId.toB58String(),
      reason: request.body,
      description: GoodbyeReasonCodeDescriptions[request.body.toString()],
    });
    await sendResponse(
      {config: this.config, logger: this.logger},
      request.id,
      request.method,
      request.encoding,
      sink,
      null,
      BigInt(GoodByeReasonCode.CLIENT_SHUTDOWN)
    );
    await this.network.disconnect(peerId);
  }

  public async onPing(request: ReqRespRequest<Ping>, peerId: PeerId, sink: Sink<unknown, unknown>): Promise<void> {
    await sendResponse(
      {config: this.config, logger: this.logger},
      request.id,
      request.method,
      request.encoding,
      sink,
      null,
      this.network.metadata.seqNumber
    );
    // no need to wait
    handlePeerMetadataSequence(this.network, this.logger, peerId, request.body).catch(() => {
      this.logger.warn(`Failed to handle peer ${peerId.toB58String()} metadata sequence ${request}`);
    });
  }

  public async onMetadata(request: ReqRespRequest<null>, peerId: PeerId, sink: Sink<unknown, unknown>): Promise<void> {
    await sendResponse(
      {config: this.config, logger: this.logger},
      request.id,
      request.method,
      request.encoding,
      sink,
      null,
      this.network.metadata.metadata
    );
  }

  public async onBeaconBlocksByRange(
    request: ReqRespRequest<BeaconBlocksByRangeRequest>,
    peerId: PeerId,
    sink: Sink<unknown, unknown>
  ): Promise<void> {
    if (request.body.step < 1 || request.body.startSlot < GENESIS_SLOT || request.body.count < 1) {
      this.logger.error("Invalid request", {
        id: request.id,
        method: request.method,
        ...request.body,
      });
      await sendResponse(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        new RpcError(RpcResponseStatus.ERR_INVALID_REQ, "Invalid request")
      );
      return;
    }
    try {
      if (request.body.count > MAX_REQUEST_BLOCKS) {
        this.logger.warn(
          `Request id ${request.id} asked for ${request.body.count} blocks, ` +
            `just return ${MAX_REQUEST_BLOCKS} maximum`
        );
        request.body.count = MAX_REQUEST_BLOCKS;
      }
      const archiveBlocksStream = this.db.blockArchive.valuesStream({
        gte: request.body.startSlot,
        lt: request.body.startSlot + request.body.count * request.body.step,
        step: request.body.step,
      } as IBlockFilterOptions);
      const responseStream = this.injectRecentBlocks(archiveBlocksStream, this.chain, request.body);
      await sendResponseStream(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        null,
        responseStream
      );
    } catch (e) {
      this.logger.error(`Error processing request id ${request.id}: ${e.message}`);
      await sendResponse(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        new RpcError(RpcResponseStatus.SERVER_ERROR, e.message)
      );
    }
  }

  public async onBeaconBlocksByRoot(
    request: ReqRespRequest<BeaconBlocksByRootRequest>,
    peerId: PeerId,
    sink: Sink<unknown, unknown>
  ): Promise<void> {
    try {
      const getBlock = this.db.block.get.bind(this.db.block);
      const getFinalizedBlock = this.db.blockArchive.getByRoot.bind(this.db.blockArchive);
      const blockGenerator = (async function* () {
        for (const blockRoot of request.body) {
          const root = blockRoot.valueOf() as Uint8Array;
          const block = (await getBlock(root)) || (await getFinalizedBlock(root));
          if (block) {
            yield block;
          }
        }
      })();
      await sendResponseStream(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        null,
        blockGenerator
      );
    } catch (e) {
      await sendResponse(
        {config: this.config, logger: this.logger},
        request.id,
        request.method,
        request.encoding,
        sink,
        e
      );
    }
  }

  private handshake = async (peerId: PeerId, direction: "inbound" | "outbound"): Promise<void> => {
    if (direction === "outbound") {
      const request = await createStatus(this.chain);
      try {
        this.network.peerMetadata.setStatus(peerId, await this.network.reqResp.status(peerId, request));
      } catch (e) {
        this.logger.verbose(`Failed to get peer ${peerId.toB58String()} latest status and metadata`, {
          reason: e.message,
        });
        await this.network.disconnect(peerId);
      }
    }
  };

  private injectRecentBlocks = async function* (
    archiveStream: AsyncIterable<SignedBeaconBlock>,
    chain: IBeaconChain,
    request: BeaconBlocksByRangeRequest
  ): AsyncGenerator<SignedBeaconBlock> {
    let slot = -1;
    for await (const archiveBlock of archiveStream) {
      yield archiveBlock;
      slot = archiveBlock.message.slot;
    }
    slot = slot === -1 ? request.startSlot : slot + request.step;
    const upperSlot = request.startSlot + request.count * request.step;
    const slots = [] as number[];
    while (slot < upperSlot) {
      slots.push(slot);
      slot += request.step;
    }

    const blocks = (await chain.getUnfinalizedBlocksAtSlots(slots)) || [];
    for (const block of blocks) {
      if (block) {
        yield block;
      }
    }
  };
}
