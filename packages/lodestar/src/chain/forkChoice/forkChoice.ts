/**
 * @module chain/forkChoice
 */

import {toHexString} from "@chainsafe/ssz";
import {allForks, phase0, Slot} from "@chainsafe/lodestar-types";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {ForkChoice, ProtoArray} from "@chainsafe/lodestar-fork-choice";

import {computeAnchorCheckpoint} from "../initState";
import {ChainEventEmitter} from "../emitter";
import {ForkChoiceStore} from "./store";

/**
 * Fork Choice extended with a ChainEventEmitter
 */
export class LodestarForkChoice extends ForkChoice {
  constructor({
    config,
    emitter,
    currentSlot,
    anchorState,
  }: {
    config: IBeaconConfig;
    emitter: ChainEventEmitter;
    currentSlot: Slot;
    anchorState: allForks.BeaconState;
  }) {
    const {blockHeader, checkpoint} = computeAnchorCheckpoint(config, anchorState);
    const finalizedCheckpoint = {...checkpoint};
    const justifiedCheckpoint = {
      ...checkpoint,
      // If not genesis epoch, justified checkpoint epoch must be set to finalized checkpoint epoch + 1
      // So that we don't allow the chain to initially justify with a block that isn't also finalizing the anchor state.
      // If that happens, we will create an invalid head state,
      // with the head not matching the fork choice justified and finalized epochs.
      epoch: checkpoint.epoch === 0 ? checkpoint.epoch : checkpoint.epoch + 1,
    };
    super({
      config,

      fcStore: new ForkChoiceStore({
        emitter,
        currentSlot,
        justifiedCheckpoint,
        finalizedCheckpoint,
      }),

      protoArray: ProtoArray.initialize({
        slot: blockHeader.slot,
        parentRoot: toHexString(blockHeader.parentRoot),
        stateRoot: toHexString(blockHeader.stateRoot),
        blockRoot: toHexString(checkpoint.root),
        justifiedEpoch: justifiedCheckpoint.epoch,
        finalizedEpoch: finalizedCheckpoint.epoch,
      }),

      queuedAttestations: new Set(),
    });
  }
}
