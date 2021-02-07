import {ByteVector, toHexString, TreeBacked} from "@chainsafe/ssz";
import {sleep} from "@chainsafe/lodestar-utils";
import {BeaconState} from "@chainsafe/lodestar-types";
import {EpochContext} from "@chainsafe/lodestar-beacon-state-transition";
import {CachedValidatorsBeaconState} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/util";

// Lodestar specifc state context
export interface ITreeStateContext {
  state: CachedValidatorsBeaconState;
  epochCtx: EpochContext;
}

/**
 * In memory cache of BeaconState and connected EpochContext
 *
 * Similar API to Repository
 */
export class StateContextCache {
  private cache: Record<string, ITreeStateContext>;
  constructor() {
    this.cache = {};
  }

  public async get(root: ByteVector): Promise<ITreeStateContext | null> {
    const item = this.cache[toHexString(root)];
    if (!item) {
      return null;
    }
    await sleep(0);
    return this.clone(item);
  }

  public async add(item: ITreeStateContext): Promise<void> {
    await sleep(0);
    this.cache[toHexString((item.state.getOriginalState() as TreeBacked<BeaconState>).hashTreeRoot())] = this.clone(
      item
    );
  }

  public async delete(root: ByteVector): Promise<void> {
    delete this.cache[toHexString(root)];
    await sleep(0);
  }

  public async batchDelete(roots: ByteVector[]): Promise<void> {
    await Promise.all(roots.map((root) => this.delete(root)));
    await sleep(0);
  }

  public clear(): void {
    this.cache = {};
  }

  public get size(): number {
    return Object.keys(this.cache).length;
  }

  /**
   * TODO make this more robust.
   * Without more thought, this currently breaks our assumptions about recent state availablity
   */
  public prune(headStateRoot: ByteVector): void {
    const MAX_STATES = 96;
    const keys = Object.keys(this.cache);
    if (keys.length > MAX_STATES) {
      const headStateRootHex = toHexString(headStateRoot);
      // object keys are stored in insertion order, delete keys starting from the front
      for (const key of keys.slice(0, keys.length - MAX_STATES)) {
        if (key !== headStateRootHex) {
          delete this.cache[key];
        }
      }
    }
  }

  /**
   * Should only use this with care as this is expensive.
   * @param epoch
   */
  public async valuesUnsafe(): Promise<ITreeStateContext[]> {
    await sleep(0);
    return Object.values(this.cache).map((item) => this.clone(item));
  }

  private clone(item: ITreeStateContext): ITreeStateContext {
    return {
      state: item.state.clone(),
      epochCtx: item.epochCtx.copy(),
    };
  }
}
