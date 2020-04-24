[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["api/impl/validator/validator"](../modules/_api_impl_validator_validator_.md) › [ValidatorApi](_api_impl_validator_validator_.validatorapi.md)

# Class: ValidatorApi

## Hierarchy

* **ValidatorApi**

## Implements

* [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)

## Index

### Constructors

* [constructor](_api_impl_validator_validator_.validatorapi.md#constructor)

### Properties

* [chain](_api_impl_validator_validator_.validatorapi.md#private-chain)
* [config](_api_impl_validator_validator_.validatorapi.md#private-config)
* [db](_api_impl_validator_validator_.validatorapi.md#private-db)
* [eth1](_api_impl_validator_validator_.validatorapi.md#private-eth1)
* [logger](_api_impl_validator_validator_.validatorapi.md#private-logger)
* [namespace](_api_impl_validator_validator_.validatorapi.md#namespace)
* [network](_api_impl_validator_validator_.validatorapi.md#private-network)
* [opPool](_api_impl_validator_validator_.validatorapi.md#private-oppool)
* [sync](_api_impl_validator_validator_.validatorapi.md#private-sync)

### Methods

* [getAttesterDuties](_api_impl_validator_validator_.validatorapi.md#getattesterduties)
* [getProposerDuties](_api_impl_validator_validator_.validatorapi.md#getproposerduties)
* [getWireAttestations](_api_impl_validator_validator_.validatorapi.md#getwireattestations)
* [produceAggregateAndProof](_api_impl_validator_validator_.validatorapi.md#produceaggregateandproof)
* [produceAttestation](_api_impl_validator_validator_.validatorapi.md#produceattestation)
* [produceBlock](_api_impl_validator_validator_.validatorapi.md#produceblock)
* [publishAggregateAndProof](_api_impl_validator_validator_.validatorapi.md#publishaggregateandproof)
* [publishAttestation](_api_impl_validator_validator_.validatorapi.md#publishattestation)
* [publishBlock](_api_impl_validator_validator_.validatorapi.md#publishblock)
* [subscribeCommitteeSubnet](_api_impl_validator_validator_.validatorapi.md#subscribecommitteesubnet)

## Constructors

###  constructor

\+ **new ValidatorApi**(`opts`: Partial‹[IApiOptions](../interfaces/_api_options_.iapioptions.md)›, `modules`: Pick‹[IApiModules](../interfaces/_api_interface_.iapimodules.md), "config" | "chain" | "db" | "opPool" | "eth1" | "sync" | "network" | "logger"›): *[ValidatorApi](_api_impl_validator_validator_.validatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:58](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | Partial‹[IApiOptions](../interfaces/_api_options_.iapioptions.md)› |
`modules` | Pick‹[IApiModules](../interfaces/_api_interface_.iapimodules.md), "config" &#124; "chain" &#124; "db" &#124; "opPool" &#124; "eth1" &#124; "sync" &#124; "network" &#124; "logger"› |

**Returns:** *[ValidatorApi](_api_impl_validator_validator_.validatorapi.md)*

## Properties

### `Private` chain

• **chain**: *[IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:52](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L52)*

___

### `Private` config

• **config**: *IBeaconConfig*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:51](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L51)*

___

### `Private` db

• **db**: *[IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:53](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L53)*

___

### `Private` eth1

• **eth1**: *[IEth1Notifier](../interfaces/_eth1_interface_.ieth1notifier.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:57](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L57)*

___

### `Private` logger

• **logger**: *ILogger*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:58](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L58)*

___

###  namespace

• **namespace**: *[ApiNamespace](../enums/_api_index_.apinamespace.md)*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md).[namespace](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md#namespace)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:49](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L49)*

___

### `Private` network

• **network**: *[INetwork](../interfaces/_network_interface_.inetwork.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:54](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L54)*

___

### `Private` opPool

• **opPool**: *[OpPool](_oppool_oppool_.oppool.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:56](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L56)*

___

### `Private` sync

• **sync**: *[IBeaconSync](../interfaces/_sync_interface_.ibeaconsync.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:55](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L55)*

## Methods

###  getAttesterDuties

▸ **getAttesterDuties**(`epoch`: number, `validatorPubKeys`: BLSPubkey[]): *Promise‹AttesterDuty[]›*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:137](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`epoch` | number |
`validatorPubKeys` | BLSPubkey[] |

**Returns:** *Promise‹AttesterDuty[]›*

___

###  getProposerDuties

▸ **getProposerDuties**(`epoch`: Epoch): *Promise‹ProposerDuty[]›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:121](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`epoch` | Epoch |

**Returns:** *Promise‹ProposerDuty[]›*

___

###  getWireAttestations

▸ **getWireAttestations**(`epoch`: number, `committeeIndex`: number): *Promise‹Attestation[]›*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:163](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L163)*

**Parameters:**

Name | Type |
------ | ------ |
`epoch` | number |
`committeeIndex` | number |

**Returns:** *Promise‹Attestation[]›*

___

###  produceAggregateAndProof

▸ **produceAggregateAndProof**(`attestationData`: AttestationData, `aggregator`: BLSPubkey): *Promise‹AggregateAndProof›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:168](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`attestationData` | AttestationData |
`aggregator` | BLSPubkey |

**Returns:** *Promise‹AggregateAndProof›*

___

###  produceAttestation

▸ **produceAttestation**(`validatorPubKey`: BLSPubkey, `index`: CommitteeIndex, `slot`: Slot): *Promise‹Attestation›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:82](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`validatorPubKey` | BLSPubkey |
`index` | CommitteeIndex |
`slot` | Slot |

**Returns:** *Promise‹Attestation›*

___

###  produceBlock

▸ **produceBlock**(`slot`: Slot, `validatorPubkey`: BLSPubkey, `randaoReveal`: Bytes96): *Promise‹BeaconBlock›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:75](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`slot` | Slot |
`validatorPubkey` | BLSPubkey |
`randaoReveal` | Bytes96 |

**Returns:** *Promise‹BeaconBlock›*

___

###  publishAggregateAndProof

▸ **publishAggregateAndProof**(`signedAggregateAndProof`: SignedAggregateAndProof): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:154](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L154)*

**Parameters:**

Name | Type |
------ | ------ |
`signedAggregateAndProof` | SignedAggregateAndProof |

**Returns:** *Promise‹void›*

___

###  publishAttestation

▸ **publishAttestation**(`attestation`: Attestation): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:114](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`attestation` | Attestation |

**Returns:** *Promise‹void›*

___

###  publishBlock

▸ **publishBlock**(`signedBlock`: SignedBeaconBlock): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:107](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`signedBlock` | SignedBeaconBlock |

**Returns:** *Promise‹void›*

___

###  subscribeCommitteeSubnet

▸ **subscribeCommitteeSubnet**(`slot`: Slot, `slotSignature`: BLSSignature, `committeeIndex`: CommitteeIndex, `aggregatorPubkey`: BLSPubkey): *Promise‹void›*

*Implementation of [IValidatorApi](../interfaces/_api_impl_validator_interface_.ivalidatorapi.md)*

*Defined in [packages/lodestar/src/api/impl/validator/validator.ts:203](https://github.com/ChainSafe/lodestar/blob/0e426d2/packages/lodestar/src/api/impl/validator/validator.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`slot` | Slot |
`slotSignature` | BLSSignature |
`committeeIndex` | CommitteeIndex |
`aggregatorPubkey` | BLSPubkey |

**Returns:** *Promise‹void›*
