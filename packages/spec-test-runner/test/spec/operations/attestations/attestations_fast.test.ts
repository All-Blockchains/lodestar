import {join} from "path";
import {expect} from "chai";
import {BeaconState} from "@chainsafe/lodestar-types";
import {config} from "@chainsafe/lodestar-config/mainnet";
import {processAttestation} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/block";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util/lib/single";
import {IProcessAttestationTestCase} from "./type";
import {SPEC_TEST_LOCATION} from "../../../utils/specTestCases";
import {createCachedBeaconState} from "@chainsafe/lodestar-beacon-state-transition/lib/fast/util";

describeDirectorySpecTest<IProcessAttestationTestCase, BeaconState>(
  "process attestation mainnet",
  join(SPEC_TEST_LOCATION, "/tests/mainnet/phase0/operations/attestation/pyspec_tests"),
  (testcase) => {
    const state = testcase.pre;
    const cachedState = createCachedBeaconState(config, state);
    processAttestation(cachedState, testcase.attestation);
    return cachedState.getOriginalState();
  },
  {
    inputTypes: {
      meta: InputType.YAML,
    },
    sszTypes: {
      pre: config.types.BeaconState,
      post: config.types.BeaconState,
      attestation: config.types.Attestation,
    },

    timeout: 100000000,
    shouldError: (testCase) => !testCase.post,
    getExpected: (testCase) => testCase.post,
    expectFunc: (testCase, expected, actual) => {
      expect(config.types.BeaconState.equals(actual, expected)).to.be.true;
    },
  }
);
