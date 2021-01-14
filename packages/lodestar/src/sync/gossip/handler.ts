import {GossipStatus, IGossipHandler} from "./interface";
import {GossipEvent} from "../../network/gossip/constants";
import {INetwork} from "../../network";
import {
  AttesterSlashing,
  ProposerSlashing,
  SignedAggregateAndProof,
  SignedBeaconBlock,
  SignedVoluntaryExit,
  ForkDigest,
} from "@chainsafe/lodestar-types";
import {ChainEvent, IBeaconChain} from "../../chain";
import {IBeaconDb} from "../../db";
import {toHexString} from "@chainsafe/ssz";
import {ILogger} from "@chainsafe/lodestar-utils";

export class BeaconGossipHandler implements IGossipHandler {
  status = GossipStatus.STOPPED;
  private readonly chain: IBeaconChain;
  private readonly network: INetwork;
  private readonly db: IBeaconDb;
  private readonly logger: ILogger;
  private currentForkDigest!: ForkDigest;

  constructor(chain: IBeaconChain, network: INetwork, db: IBeaconDb, logger: ILogger) {
    this.chain = chain;
    this.network = network;
    this.db = db;
    this.logger = logger;
  }

  public async start(): Promise<void> {
    this.status = GossipStatus.STARTED;
    this.currentForkDigest = await this.chain.getForkDigest();
    this.subscribeBlockAndAttestation(this.currentForkDigest);
    this.chain.emitter.on(ChainEvent.forkVersion, this.handleForkVersion);
  }

  public stop(): void {
    this.status = GossipStatus.STOPPED;
    this.unsubscribe(this.currentForkDigest);
    this.chain.emitter.removeListener(ChainEvent.forkVersion, this.handleForkVersion);
  }

  public handleSyncCompleted(): void {
    this.subscribeValidatorTopics(this.currentForkDigest);
  }

  private handleForkVersion = async (): Promise<void> => {
    const forkDigest = await this.chain.getForkDigest();
    this.logger.important(`Gossip handler: received new fork digest ${toHexString(forkDigest)}`);
    this.unsubscribe(this.currentForkDigest);
    this.currentForkDigest = forkDigest;
    this.subscribe(forkDigest);
  };

  private subscribe = (forkDigest: ForkDigest): void => {
    this.subscribeBlockAndAttestation(forkDigest);
    this.subscribeValidatorTopics(forkDigest);
  };

  private subscribeBlockAndAttestation = (forkDigest: ForkDigest): void => {
    this.network.gossip.subscribeToBlock(forkDigest, this.onBlock);
    this.network.gossip.subscribeToAggregateAndProof(forkDigest, this.onAggregatedAttestation);
  };

  private subscribeValidatorTopics = (forkDigest: ForkDigest): void => {
    this.network.gossip.subscribeToAttesterSlashing(forkDigest, this.onAttesterSlashing);
    this.network.gossip.subscribeToProposerSlashing(forkDigest, this.onProposerSlashing);
    this.network.gossip.subscribeToVoluntaryExit(forkDigest, this.onVoluntaryExit);
  };

  private unsubscribe = (forkDigest: ForkDigest): void => {
    this.network.gossip.unsubscribe(forkDigest, GossipEvent.BLOCK, this.onBlock);
    this.network.gossip.unsubscribe(forkDigest, GossipEvent.AGGREGATE_AND_PROOF, this.onAggregatedAttestation);
    this.network.gossip.unsubscribe(forkDigest, GossipEvent.ATTESTER_SLASHING, this.onAttesterSlashing);
    this.network.gossip.unsubscribe(forkDigest, GossipEvent.PROPOSER_SLASHING, this.onProposerSlashing);
    this.network.gossip.unsubscribe(forkDigest, GossipEvent.VOLUNTARY_EXIT, this.onVoluntaryExit);
  };

  private onBlock = async (block: SignedBeaconBlock): Promise<void> => {
    await this.chain.receiveBlock(block);
  };

  private onAggregatedAttestation = async (aggregate: SignedAggregateAndProof): Promise<void> => {
    await this.db.aggregateAndProof.add(aggregate.message);
  };

  private onAttesterSlashing = async (attesterSlashing: AttesterSlashing): Promise<void> => {
    await this.db.attesterSlashing.add(attesterSlashing);
  };

  private onProposerSlashing = async (proposerSlashing: ProposerSlashing): Promise<void> => {
    await this.db.proposerSlashing.add(proposerSlashing);
  };

  private onVoluntaryExit = async (exit: SignedVoluntaryExit): Promise<void> => {
    await this.db.voluntaryExit.add(exit);
  };
}
