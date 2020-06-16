[@chainsafe/lodestar-validator](../README.md) › [Globals](../globals.md) › ["api/impl/rest/validator/validator"](../modules/_api_impl_rest_validator_validator_.md) › [RestValidatorApi](_api_impl_rest_validator_validator_.restvalidatorapi.md)

# Class: RestValidatorApi

## Hierarchy

* **RestValidatorApi**

## Implements

* [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)

## Index

### Constructors

* [constructor](_api_impl_rest_validator_validator_.restvalidatorapi.md#constructor)

### Properties

* [client](_api_impl_rest_validator_validator_.restvalidatorapi.md#private-client)
* [config](_api_impl_rest_validator_validator_.restvalidatorapi.md#private-config)

### Methods

* [getAttesterDuties](_api_impl_rest_validator_validator_.restvalidatorapi.md#getattesterduties)
* [getProposerDuties](_api_impl_rest_validator_validator_.restvalidatorapi.md#getproposerduties)
* [getWireAttestations](_api_impl_rest_validator_validator_.restvalidatorapi.md#getwireattestations)
* [produceAggregateAndProof](_api_impl_rest_validator_validator_.restvalidatorapi.md#produceaggregateandproof)
* [produceAttestation](_api_impl_rest_validator_validator_.restvalidatorapi.md#produceattestation)
* [produceBlock](_api_impl_rest_validator_validator_.restvalidatorapi.md#produceblock)
* [publishAggregateAndProof](_api_impl_rest_validator_validator_.restvalidatorapi.md#publishaggregateandproof)
* [publishAttestation](_api_impl_rest_validator_validator_.restvalidatorapi.md#publishattestation)
* [publishBlock](_api_impl_rest_validator_validator_.restvalidatorapi.md#publishblock)
* [subscribeCommitteeSubnet](_api_impl_rest_validator_validator_.restvalidatorapi.md#subscribecommitteesubnet)

## Constructors

###  constructor

\+ **new RestValidatorApi**(`config`: IBeaconConfig, `restUrl`: string, `logger`: ILogger): *[RestValidatorApi](_api_impl_rest_validator_validator_.restvalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:27](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`restUrl` | string |
`logger` | ILogger |

**Returns:** *[RestValidatorApi](_api_impl_rest_validator_validator_.restvalidatorapi.md)*

## Properties

### `Private` client

• **client**: *[HttpClient](_util_httpclient_.httpclient.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:25](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L25)*

___

### `Private` config

• **config**: *IBeaconConfig*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:27](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L27)*

## Methods

###  getAttesterDuties

▸ **getAttesterDuties**(`epoch`: Epoch, `validatorPubKeys`: BLSPubkey[]): *Promise‹AttesterDuty[]›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:40](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`epoch` | Epoch |
`validatorPubKeys` | BLSPubkey[] |

**Returns:** *Promise‹AttesterDuty[]›*

___

###  getProposerDuties

▸ **getProposerDuties**(`epoch`: Epoch): *Promise‹ProposerDuty[]›*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:34](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`epoch` | Epoch |

**Returns:** *Promise‹ProposerDuty[]›*

___

###  getWireAttestations

▸ **getWireAttestations**(`epoch`: Epoch, `committeeIndex`: CommitteeIndex): *Promise‹Attestation[]›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:55](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`epoch` | Epoch |
`committeeIndex` | CommitteeIndex |

**Returns:** *Promise‹Attestation[]›*

___

###  produceAggregateAndProof

▸ **produceAggregateAndProof**(`attestationData`: AttestationData, `aggregator`: BLSPubkey): *Promise‹AggregateAndProof›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:77](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`attestationData` | AttestationData |
`aggregator` | BLSPubkey |

**Returns:** *Promise‹AggregateAndProof›*

___

###  produceAttestation

▸ **produceAttestation**(`validatorPubKey`: BLSPubkey, `committeeIndex`: CommitteeIndex, `slot`: Slot): *Promise‹Attestation›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:67](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`validatorPubKey` | BLSPubkey |
`committeeIndex` | CommitteeIndex |
`slot` | Slot |

**Returns:** *Promise‹Attestation›*

___

###  produceBlock

▸ **produceBlock**(`slot`: Slot, `proposerPubkey`: BLSPubkey, `randaoReveal`: Bytes96): *Promise‹BeaconBlock›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:61](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`slot` | Slot |
`proposerPubkey` | BLSPubkey |
`randaoReveal` | Bytes96 |

**Returns:** *Promise‹BeaconBlock›*

___

###  publishAggregateAndProof

▸ **publishAggregateAndProof**(`signedAggregateAndProof`: SignedAggregateAndProof): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:48](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`signedAggregateAndProof` | SignedAggregateAndProof |

**Returns:** *Promise‹void›*

___

###  publishAttestation

▸ **publishAttestation**(`attestation`: Attestation): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:89](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`attestation` | Attestation |

**Returns:** *Promise‹void›*

___

###  publishBlock

▸ **publishBlock**(`signedBlock`: SignedBeaconBlock): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:85](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`signedBlock` | SignedBeaconBlock |

**Returns:** *Promise‹void›*

___

###  subscribeCommitteeSubnet

▸ **subscribeCommitteeSubnet**(`slot`: Slot, `slotSignature`: BLSSignature, `attestationCommitteeIndex`: CommitteeIndex, `aggregatorPubkey`: BLSPubkey): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_interface_validators_.ivalidatorapi.md)*

*Defined in [packages/lodestar-validator/src/api/impl/rest/validator/validator.ts:93](https://github.com/ChainSafe/lodestar/blob/d092a7def/packages/lodestar-validator/src/api/impl/rest/validator/validator.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`slot` | Slot |
`slotSignature` | BLSSignature |
`attestationCommitteeIndex` | CommitteeIndex |
`aggregatorPubkey` | BLSPubkey |

**Returns:** *Promise‹void›*
