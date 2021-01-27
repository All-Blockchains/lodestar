import {join} from "path";
import {expect} from "chai";

import {config} from "@chainsafe/lodestar-config/mainnet";
import {BeaconState} from "@chainsafe/lodestar-types";
import {processSlashings} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/epoch";
import {
  createCachedBeaconState,
  prepareEpochProcessState,
} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/util";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util/lib/single";
import {IStateTestCase} from "../../../utils/specTestTypes/stateTestCase";
import {SPEC_TEST_LOCATION} from "../../../utils/specTestCases";

describeDirectorySpecTest<IStateTestCase, BeaconState>(
  "epoch slashings mainnet",
  join(SPEC_TEST_LOCATION, "/tests/mainnet/phase0/epoch_processing/slashings/pyspec_tests"),
  (testcase) => {
    const state = testcase.pre;
    const wrappedState = createCachedBeaconState(config, state);
    const process = prepareEpochProcessState(wrappedState);
    processSlashings(wrappedState, process);
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
