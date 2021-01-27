import {join} from "path";
import {expect} from "chai";

import {config} from "@chainsafe/lodestar-config/minimal";
import {processRewardsAndPenalties} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/epoch";
import {
  createCachedBeaconState,
  prepareEpochProcessState,
} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/util";
import {BeaconState} from "@chainsafe/lodestar-types";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util/lib/single";
import {IStateTestCase} from "../../../utils/specTestTypes/stateTestCase";
import {SPEC_TEST_LOCATION} from "../../../utils/specTestCases";

describeDirectorySpecTest<IStateTestCase, BeaconState>(
  "rewards and penalties minimal",
  join(SPEC_TEST_LOCATION, "tests/minimal/phase0/epoch_processing/rewards_and_penalties/pyspec_tests"),
  (testcase) => {
    const state = testcase.pre;
    const cachedState = createCachedBeaconState(config, state);
    const process = prepareEpochProcessState(cachedState);
    processRewardsAndPenalties(cachedState, process);
    return state;
  },
  {
    inputTypes: {
      pre: InputType.SSZ,
      post: InputType.SSZ,
    },
    sszTypes: {
      pre: config.types.BeaconState,
      post: config.types.BeaconState,
    },
    getExpected: (testCase) => testCase.post,
    expectFunc: (testCase, expected, actual) => {
      expect(config.types.BeaconState.equals(actual, expected)).to.be.true;
    },
  }
);
