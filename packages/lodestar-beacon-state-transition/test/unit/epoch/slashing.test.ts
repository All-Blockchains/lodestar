import sinon from "sinon";
import {expect} from "chai";

import {List} from "@chainsafe/ssz";
import {Validator} from "@chainsafe/lodestar-types";
import {config} from "@chainsafe/lodestar-config/mainnet";
import {intDiv} from "@chainsafe/lodestar-utils";
import * as utils from "../../../src/util";
import {FAR_FUTURE_EPOCH} from "../../../src/constants";
import {processSlashings} from "../../../src/epoch/slashings";

import {generateState} from "../../utils/state";
import {generateValidator} from "../../utils/validator";

describe("process epoch - slashings", function () {
  const sandbox = sinon.createSandbox();

  let getCurrentEpochStub: any, getTotalBalanceStub: any, decreaseBalanceStub: any;

  beforeEach(() => {
    getCurrentEpochStub = sandbox.stub(utils, "getCurrentEpoch");
    getTotalBalanceStub = sandbox.stub(utils, "getTotalBalance");
    decreaseBalanceStub = sandbox.stub(utils, "decreaseBalance");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should decrease validator balances with penalty", function () {
    getCurrentEpochStub.returns(1);
    getTotalBalanceStub.returns(BigInt(2));
    const validator1 = generateValidator({activation: 0, exit: FAR_FUTURE_EPOCH, slashed: false});
    const validator2 = generateValidator({activation: 0, exit: FAR_FUTURE_EPOCH, slashed: true});
    validator2.withdrawableEpoch = config.params.EPOCHS_PER_SLASHINGS_VECTOR;
    const validator3 = generateValidator({activation: 0, exit: FAR_FUTURE_EPOCH, slashed: true});
    validator3.withdrawableEpoch = intDiv(config.params.EPOCHS_PER_SLASHINGS_VECTOR, 2) + 1;
    const state = generateState({
      validators: [validator1, validator2, validator3] as List<Validator>,
    });

    processSlashings(config, state);
    expect(decreaseBalanceStub.withArgs(sinon.match.any, 2, sinon.match.any).calledOnce).to.be.true;
  });
});
