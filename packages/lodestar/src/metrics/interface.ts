/**
 * @module metrics
 */
import {Registry, Gauge, Counter} from "prom-client";

export interface IMetrics {
  registry: Registry;
}

/**
 * Metrics from:
 * https://github.com/ethereum/eth2.0-metrics/ and
 * https://hackmd.io/D5FmoeFZScim_squBFl8oA
 */
export interface IBeaconMetrics extends IMetrics {
  /**
   * Tracks the number of libp2p peers
   */
  peers: Gauge;
  /**
   * Latest slot of the beacon chain state
   */
  slot: Gauge;
  /**
   * Slot of the head block of the beacon chain
   */
  headSlot: Gauge;
  /**
   * Root of the head block of the beacon chain
   */
  headRoot: Gauge;
  /**
   * Current finalized epoch
   */
  finalizedEpoch: Gauge;
  /**
   * Current finalized root
   */
  finalizedRoot: Gauge;
  /**
   * Current justified epoch
   */
  currentJustifiedEpoch: Gauge;
  /**
   * Current justified root
   */
  currentJustifiedRoot: Gauge;
  /**
   * Current previously justified epoch
   */
  previousJustifiedEpoch: Gauge;
  /**
   * Current previously justified root
   */
  previousJustifiedRoot: Gauge;
  /**
   * Number of `status="pending|active|exited|withdrawable" validators in current epoch
   */
  currentValidators: Gauge;
  /**
   * Number of `status="pending|active|exited|withdrawable" validators in current epoch
   */
  previousValidators: Gauge;
  /**
   * Number of active validators that successfully included attestation on chain for current epoch
   */
  currentLiveValidators: Gauge;
  /**
   * Number of active validators that successfully included attestation on chain for previous epoch
   */
  previousLiveValidators: Gauge;
  /**
   * Number of pending deposits (`state.eth1Data.depositCount - state.eth1DepositIndex`)
   */
  pendingDeposits: Gauge;
  /**
   * Number of total deposits included on chain
   */
  processedDepositsTotal: Gauge;
  /**
   * Number of pending voluntary exits in local operation pool
   */
  pendingExits: Gauge;
  /**
   * Number of blocks orphaned in the previous epoch
   */
  previousEpochOrphanedBlocks: Gauge;
  /**
   * Total occurances of reorganizations of the chain
   */
  reorgEventsTotal: Counter;
  /**
   * Track current epoch active balances
   */
  currentEpochActiveGwei: Gauge;
  /**
   * Track current epoch active balances
   */
  currentEpochSourceGwei: Gauge;
  /**
   * Track current epoch active balances
   */
  currentEpochTargetGwei: Gauge;
  /**
   * Track previous epoch active balances
   */
  previousEpochActiveGwei: Gauge;
  /**
   * Track previous epoch active balances
   */
  previousEpochSourceGwei: Gauge;
  /**
   * Track previous epoch active balances
   */
  previousEpochTargetGwei: Gauge;
  /**
   * Track number of attesters for which we have seen an attestation.
   * That attestation is not necessarily included on chain.
   */
  observedEpochAttesters: Gauge;
  /**
   * Track number of aggregators for which we have seen an attestation.
   * That attestation is not necessarily included on chain.
   */
  observedEpochAggregators: Gauge;
  /**
   * Track number of peers on each SyncChain
   */
  peersPerSyncChain: Gauge;
  /** Peers labeled by direction */
  peersByDirection: Gauge;
  /** Total async time spent in the sycn processChainSegment */
  processChainSegmentTime: Gauge;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMetricsServer {}
