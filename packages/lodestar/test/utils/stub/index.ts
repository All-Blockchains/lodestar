import {SinonStubbedInstance} from "sinon";

import {IForkChoice} from "@chainsafe/lodestar-fork-choice";
import {EpochContext} from "@chainsafe/lodestar-beacon-state-transition-fast";
import {IBeaconChain, ChainEventEmitter} from "../../../src/chain";

interface IStubbedChain extends IBeaconChain {
  forkChoice: SinonStubbedInstance<IForkChoice>;
  epochCtx: SinonStubbedInstance<EpochContext> & EpochContext;
  emitter: SinonStubbedInstance<ChainEventEmitter>;
}

export type StubbedChain = IStubbedChain & SinonStubbedInstance<IBeaconChain>;

export * from "./beaconDb";
