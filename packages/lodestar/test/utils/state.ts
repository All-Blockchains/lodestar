import {BeaconState, PendingAttestation, Eth1Data, Validator, Gwei, Root} from "@chainsafe/lodestar-types";
import {GENESIS_EPOCH, GENESIS_SLOT, ZERO_HASH} from "../../src/constants";
import {generateEmptyBlock} from "./block";
import {config} from "@chainsafe/lodestar-config/minimal";
import {TreeBacked, List} from "@chainsafe/ssz";
import {
  CachedBeaconState,
  createCachedBeaconState,
  createIFlatValidator,
  IFlatValidator,
} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/util";
import {Vector} from "@chainsafe/persistent-ts";

/**
 * Copy of BeaconState, but all fields are marked optional to allow for swapping out variables as needed.
 */
type TestBeaconState = Partial<BeaconState>;

let treeBackedState: TreeBacked<BeaconState>;

/**
 * Generate beaconState, by default it will use the initial state defined when the `ChainStart` log is emitted.
 * NOTE: All fields can be overridden through `opts`.
 *  should allow 1st test calling generateState more time since TreeBacked<BeaconState>.createValue api is expensive.
 *
 * @param {TestBeaconState} opts
 * @param config
 * @returns {BeaconState}
 */
export function generateState(opts: TestBeaconState = {}): TreeBacked<BeaconState> {
  const defaultState: BeaconState = {
    genesisTime: Math.floor(Date.now() / 1000),
    genesisValidatorsRoot: ZERO_HASH,
    slot: GENESIS_SLOT,
    fork: {
      previousVersion: config.params.GENESIS_FORK_VERSION,
      currentVersion: config.params.GENESIS_FORK_VERSION,
      epoch: GENESIS_EPOCH,
    },
    latestBlockHeader: {
      slot: 0,
      proposerIndex: 0,
      parentRoot: Buffer.alloc(32),
      stateRoot: Buffer.alloc(32),
      bodyRoot: config.types.BeaconBlockBody.hashTreeRoot(generateEmptyBlock().body),
    },
    blockRoots: Array.from({length: config.params.SLOTS_PER_HISTORICAL_ROOT}, () => ZERO_HASH),
    stateRoots: Array.from({length: config.params.SLOTS_PER_HISTORICAL_ROOT}, () => ZERO_HASH),
    historicalRoots: ([] as Root[]) as List<Root>,
    eth1Data: {
      depositRoot: Buffer.alloc(32),
      blockHash: Buffer.alloc(32),
      depositCount: 0,
    },
    eth1DataVotes: ([] as Eth1Data[]) as List<Eth1Data>,
    eth1DepositIndex: 0,
    validators: ([] as Validator[]) as List<Validator>,
    balances: ([] as Gwei[]) as List<Gwei>,
    randaoMixes: Array.from({length: config.params.EPOCHS_PER_HISTORICAL_VECTOR}, () => ZERO_HASH),
    slashings: Array.from({length: config.params.EPOCHS_PER_SLASHINGS_VECTOR}, () => BigInt(0)),
    previousEpochAttestations: ([] as PendingAttestation[]) as List<PendingAttestation>,
    currentEpochAttestations: ([] as PendingAttestation[]) as List<PendingAttestation>,
    justificationBits: Array.from({length: 4}, () => false),
    previousJustifiedCheckpoint: {
      epoch: GENESIS_EPOCH,
      root: ZERO_HASH,
    },
    currentJustifiedCheckpoint: {
      epoch: GENESIS_EPOCH,
      root: ZERO_HASH,
    },
    finalizedCheckpoint: {
      epoch: GENESIS_EPOCH,
      root: ZERO_HASH,
    },
  };
  treeBackedState = treeBackedState || config.types.BeaconState.tree.createValue(defaultState);
  const resultState = treeBackedState.clone();
  for (const key in opts) {
    // @ts-ignore
    resultState[key] = opts[key];
  }
  return resultState;
}

interface IGenerateTestBeaconState extends TestBeaconState {
  loadState?: boolean;
}

export function generateCachedState(opts: IGenerateTestBeaconState = {loadState: false}): CachedBeaconState {
  if (opts.loadState) {
    delete opts.loadState;
    return createCachedBeaconState(config, generateState(opts));
  } else {
    delete opts.loadState;
    // same to createCachedBeaconState without loading state
    const state = generateState(opts);
    let flatValidators: IFlatValidator[] = [];
    if (opts.validators) {
      flatValidators = (opts.validators as Validator[]).map((validator) => createIFlatValidator(validator));
    }
    const cachedState = new CachedBeaconState(config, state, Vector.of(...flatValidators));
    return cachedState.createProxy();
  }
}
