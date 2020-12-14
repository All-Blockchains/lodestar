import {EpochContext} from "@chainsafe/lodestar-beacon-state-transition";
import {prepareEpochProcessState} from "@chainsafe/lodestar-beacon-state-transition-fast";
import {getAttestationDeltas} from "@chainsafe/lodestar-beacon-state-transition-fast";
import {config} from "@chainsafe/lodestar-config/mainnet";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util";
import {join} from "path";
import {SPEC_TEST_LOCATION} from "../../utils/specTestCases";
import {generateSZZTypeMapping, IDeltas, DeltasType, IRewardsTestCase} from "./types";
import {expect} from "chai";

["basic", "leak", "random"].forEach((testSuite) => {
  describeDirectorySpecTest<IRewardsTestCase, IDeltas>(
    "process attestation mainnet",
    join(SPEC_TEST_LOCATION, `/tests/mainnet/phase0/rewards/${testSuite}/pyspec_tests`),
    (testcase) => {
      const state = testcase.pre;
      const epochCtx = new EpochContext(config);
      epochCtx.loadState(state);
      const process = prepareEpochProcessState(epochCtx, state);
      const [rewards, penalties] = getAttestationDeltas(epochCtx, process, state);
      return {
        rewards,
        penalties,
      };
    },
    {
      inputTypes: {
        meta: InputType.YAML,
      },
      sszTypes: {
        pre: config.types.BeaconState,
        ...generateSZZTypeMapping(),
      },
      timeout: 100000000,
      shouldError: (testCase) => !testCase.post,
      getExpected: (testCase) => {
        const sourceDeltas = testCase["source_deltas"] as IDeltas;
        const targetDeltas = testCase["target_deltas"] as IDeltas;
        const headDeltas = testCase["head_deltas"] as IDeltas;
        const inclusionDelayDeltas = testCase["inclusion_delay_deltas"] as IDeltas;
        const inactivityPenaltyDeltas = testCase["inactivity_penalty_deltas"] as IDeltas;
        const rewards = [
          sourceDeltas.rewards,
          targetDeltas.rewards,
          headDeltas.rewards,
          inclusionDelayDeltas.rewards,
          inactivityPenaltyDeltas.rewards,
        ].reduce((previousValue, currentValue) => {
          previousValue.forEach((_, index) => (previousValue[index] += currentValue[index]));
          return previousValue;
        });
        const penalties = [
          sourceDeltas.penalties,
          targetDeltas.penalties,
          headDeltas.penalties,
          inclusionDelayDeltas.penalties,
          inactivityPenaltyDeltas.penalties,
        ].reduce((previousValue, currentValue) => {
          previousValue.forEach((_, index) => (previousValue[index] += currentValue[index]));
          return previousValue;
        });
        return {
          rewards,
          penalties,
        };
      },
      expectFunc: (testCase, expected, actual) => {
        expect(DeltasType.equals(actual, expected)).to.be.true;
      },
    }
  );
});
