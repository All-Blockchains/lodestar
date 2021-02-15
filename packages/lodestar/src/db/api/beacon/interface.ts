/**
 * @module db/api/beacon
 */

import {SignedBeaconBlock} from "@chainsafe/lodestar-types";

import {
  AggregateAndProofRepository,
  AttestationRepository,
  AttesterSlashingRepository,
  BadBlockRepository,
  BlockArchiveRepository,
  BlockRepository,
  DepositEventRepository,
  DepositDataRootRepository,
  Eth1DataRepository,
  ProposerSlashingRepository,
  StateArchiveRepository,
  VoluntaryExitRepository,
} from "./repositories";
import {SeenAttestationCache} from "./seenAttestationCache";
import {PendingBlockRepository} from "./repositories/pendingBlock";
import {ActiveValidatorCache} from "./activeValidatorCache";

/**
 * The DB service manages the data layer of the beacon chain
 * The exposed methods do not refer to the underlying data engine,
 * but instead expose relevent beacon chain objects
 */
export interface IBeaconDb {
  // bad blocks
  badBlock: BadBlockRepository;

  // unfinalized blocks
  block: BlockRepository;

  // pending block
  pendingBlock: PendingBlockRepository;

  // cache for attestations that have already been seen via gossip or other sources
  seenAttestationCache: SeenAttestationCache;

  // active validators connected to this node
  activeValidatorCache: ActiveValidatorCache;

  // finalized blocks
  blockArchive: BlockArchiveRepository;

  // finalized states
  stateArchive: StateArchiveRepository;

  // op pool
  attestation: AttestationRepository;
  aggregateAndProof: AggregateAndProofRepository;
  voluntaryExit: VoluntaryExitRepository;
  proposerSlashing: ProposerSlashingRepository;
  attesterSlashing: AttesterSlashingRepository;
  depositEvent: DepositEventRepository;

  // eth1 processing

  // all deposit data roots and merkle tree
  depositDataRoot: DepositDataRootRepository;
  eth1Data: Eth1DataRepository;

  processBlockOperations(signedBlock: SignedBeaconBlock): Promise<void>;

  /**
   * Start the connection to the db instance and open the db store.
   */
  start(): Promise<void>;

  /**
   *  Stop the connection to the db instance and close the db store.
   */
  stop(): Promise<void>;
}
