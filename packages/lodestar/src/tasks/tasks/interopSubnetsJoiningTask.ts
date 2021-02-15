import {INetwork} from "../../network";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ATTESTATION_SUBNET_COUNT} from "../../constants";
import {randBetween, ILogger, intToBytes} from "@chainsafe/lodestar-utils";
import {ChainEvent, IBeaconChain} from "../../chain";
import {ForkDigest} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {computeStartSlotAtEpoch, computeForkDigest} from "@chainsafe/lodestar-beacon-state-transition";
import {IBeaconDb} from "../../db";

export interface IInteropSubnetsJoiningModules {
  network: INetwork;
  chain: IBeaconChain;
  db: IBeaconDb;
  logger: ILogger;
}

export class InteropSubnetsJoiningTask {
  private readonly config: IBeaconConfig;
  private readonly network: INetwork;
  private readonly chain: IBeaconChain;
  private readonly db: IBeaconDb;
  private readonly logger: ILogger;
  private currentSubnets: Set<number>;
  private nextForkSubnets: Set<number>;
  private currentForkDigest!: ForkDigest;

  private currentTimers: NodeJS.Timeout[] = [];
  private nextForkTimers: NodeJS.Timeout[] = [];
  private nextForkSubsTimer?: NodeJS.Timeout;

  public constructor(config: IBeaconConfig, modules: IInteropSubnetsJoiningModules) {
    this.config = config;
    this.network = modules.network;
    this.chain = modules.chain;
    this.db = modules.db;
    this.logger = modules.logger;
    this.currentSubnets = new Set();
    this.nextForkSubnets = new Set();
  }

  public async start(): Promise<void> {
    this.currentForkDigest = this.chain.getForkDigest();
    this.chain.emitter.on(ChainEvent.forkVersion, this.handleForkVersion);
    this.chain.emitter.on(ChainEvent.clockEpoch, this.onNewEpoch);
    await this.scheduleNextForkSubscription();
  }

  public async stop(): Promise<void> {
    this.chain.emitter.off(ChainEvent.forkVersion, this.handleForkVersion);
    this.chain.emitter.off(ChainEvent.clockEpoch, this.onNewEpoch);
    if (this.nextForkSubsTimer) {
      clearTimeout(this.nextForkSubsTimer);
    }

    for (const timer of this.nextForkTimers) {
      clearTimeout(timer);
    }

    return this.cleanUpCurrentSubscriptions();
  }

  /**
   * We may have new active validators so have to check per epoch.
   */
  private onNewEpoch = async (): Promise<void> => {
    await this.run(this.currentForkDigest);
  };

  private run = async (forkDigest: ForkDigest): Promise<void> => {
    const validators = await this.db.activeValidatorCache.values();
    const numSubscriptions = this.config.params.RANDOM_SUBNETS_PER_VALIDATOR * validators.length;
    const isCurrentForkDigest = this.config.types.ForkDigest.equals(forkDigest, this.currentForkDigest);
    const subnets = isCurrentForkDigest ? this.currentSubnets : this.nextForkSubnets;
    for (let i = subnets.size; i < numSubscriptions; i++) {
      this.subscribeToRandomSubnet(forkDigest);
    }
  };

  /**
   * Prepare for EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION epochs in advance of the fork
   */
  private scheduleNextForkSubscription = async (): Promise<void> => {
    const state = this.chain.getHeadState();
    const currentForkVersion = state.fork.currentVersion;
    const nextFork =
      this.config.params.ALL_FORKS &&
      this.config.params.ALL_FORKS.find((fork) =>
        this.config.types.Version.equals(currentForkVersion, intToBytes(fork.previousVersion, 4))
      );
    if (nextFork) {
      const preparedEpoch = nextFork.epoch - this.config.params.EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION;
      const timeToPreparedEpoch =
        (computeStartSlotAtEpoch(this.config, preparedEpoch) - this.chain.clock.currentSlot) *
        this.config.params.SECONDS_PER_SLOT *
        1000;
      if (timeToPreparedEpoch > 0) {
        const nextForkDigest = computeForkDigest(
          this.config,
          intToBytes(nextFork.currentVersion, 4),
          state.genesisValidatorsRoot
        );
        this.nextForkSubsTimer = setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.run(nextForkDigest).catch();
        }, timeToPreparedEpoch);
      }
    }
  };

  /**
   * Transition from current fork to next fork.
   */
  private handleForkVersion = async (): Promise<void> => {
    const forkDigest = this.chain.getForkDigest();
    this.logger.important(`InteropSubnetsJoiningTask: received new fork digest ${toHexString(forkDigest)}`);
    // at this time current fork digest and next fork digest subnets are subscribed in parallel
    // this cleans up current fork digest subnets subscription and keep subscribed to next fork digest subnets
    await this.cleanUpCurrentSubscriptions();
    this.currentForkDigest = forkDigest;
    this.currentSubnets = this.nextForkSubnets;
    const attnets = this.network.metadata.attnets;
    for (const subnet of this.currentSubnets) {
      attnets[subnet] = true;
    }
    this.network.metadata.attnets = attnets;
    this.nextForkSubnets = new Set();
    this.currentTimers = this.nextForkTimers;
    this.nextForkTimers = [];
    await this.scheduleNextForkSubscription();
  };

  /**
   * Clean up subscription and timers of current fork.
   */
  private cleanUpCurrentSubscriptions = async (): Promise<void> => {
    for (const timer of this.currentTimers) {
      clearTimeout(timer);
    }

    const attnets = this.network.metadata.attnets;

    for (const subnet of this.currentSubnets) {
      this.network.gossip.unsubscribeFromAttestationSubnet(this.currentForkDigest, subnet, this.handleWireAttestation);
      attnets[subnet] = false;
    }

    this.network.metadata.attnets = attnets;
    this.currentSubnets.clear();
  };

  /**
   * Subscribe to a random subnet for a fork digest.
   * This can be either for the current fork or next fork.
   * @return choosen subnet
   */
  private subscribeToRandomSubnet(forkDigest: ForkDigest): void {
    const isCurrentForkDigest = this.config.types.ForkDigest.equals(forkDigest, this.currentForkDigest);
    const subnets = isCurrentForkDigest ? this.currentSubnets : this.nextForkSubnets;
    const subnet = randBetween(0, ATTESTATION_SUBNET_COUNT);
    if (Array.from(subnets).includes(subnet)) return;
    subnets.add(subnet);
    this.network.gossip.subscribeToAttestationSubnet(forkDigest, subnet, this.handleWireAttestation);
    const attnets = this.network.metadata.attnets;
    // if next fork digest, do not update network metadata since it's just a preparation
    if (isCurrentForkDigest && !attnets[subnet]) {
      attnets[subnet] = true;
      this.network.metadata.attnets = attnets;
    }
    const subscriptionLifetime = randBetween(
      this.config.params.EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION,
      2 * this.config.params.EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION
    );
    const timers = isCurrentForkDigest ? this.currentTimers : this.nextForkTimers;
    timers.push(
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.handleChangeSubnets(forkDigest, subnet);
      }, subscriptionLifetime * this.config.params.SLOTS_PER_EPOCH * this.config.params.SECONDS_PER_SLOT * 1000)
    );
    while (timers.length > subnets.size) timers.shift();
  }

  private handleChangeSubnets = async (forkDigest: ForkDigest, subnet: number): Promise<void> => {
    this.network.gossip.unsubscribeFromAttestationSubnet(forkDigest, subnet, this.handleWireAttestation);
    const attnets = this.network.metadata.attnets;
    if (attnets[subnet]) {
      attnets[subnet] = false;
      this.network.metadata.attnets = attnets;
    }
    const subnets = this.config.types.ForkDigest.equals(forkDigest, this.currentForkDigest)
      ? this.currentSubnets
      : this.nextForkSubnets;
    subnets.delete(subnet);
    const validators = await this.db.activeValidatorCache.values();
    const numSubscriptions = this.config.params.RANDOM_SUBNETS_PER_VALIDATOR * validators.length;
    // some validators may become inactive at some time
    if (subnets.size < numSubscriptions) {
      this.subscribeToRandomSubnet(forkDigest);
    }
  };

  private handleWireAttestation = (): void => {
    // ignore random committee attestations
  };
}
