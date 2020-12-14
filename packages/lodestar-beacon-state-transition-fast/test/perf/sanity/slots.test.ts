import {config} from "@chainsafe/lodestar-config/mainnet";
import {BeaconState} from "@chainsafe/lodestar-types";
import {WinstonLogger} from "@chainsafe/lodestar-utils";
import {expect} from "chai";
import {EpochContext} from "../../../src";
import {processSlots} from "../../../src/slot";
import {StateTransitionEpochContext} from "../../../src/util/epochContext";
import {generatePerformanceState, initBLS} from "../util";

describe("Process Slots Performance Test", function () {
  this.timeout(0);
  const logger = new WinstonLogger();
  let state: BeaconState;
  let epochCtx: StateTransitionEpochContext;

  before(async () => {
    await initBLS();
    state = await generatePerformanceState();
    epochCtx = new EpochContext(config);
    epochCtx.loadState(state);
  });

  it("process 1 empty epoch", async () => {
    const numSlot = 32;
    logger.profile(`Process ${numSlot} slots`);
    const start = Date.now();
    processSlots(epochCtx, state, state.slot + numSlot);
    logger.profile(`Process ${numSlot} slots`);
    expect(Date.now() - start).lt(2800);
  });

  it("process double empty epochs", async () => {
    const numSlot = 64;
    logger.profile(`Process ${numSlot} slots`);
    const start = Date.now();
    processSlots(epochCtx, state, state.slot + numSlot);
    logger.profile(`Process ${numSlot} slots`);
    expect(Date.now() - start).lt(5300);
  });

  it("process 4 empty epochs", async () => {
    const numSlot = 128;
    logger.profile(`Process ${numSlot} slots`);
    const start = Date.now();
    processSlots(epochCtx, state, state.slot + numSlot);
    logger.profile(`Process ${numSlot} slots`);
    expect(Date.now() - start).lt(11000);
  });
});
