[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["api/impl/beacon/beacon"](../modules/_api_impl_beacon_beacon_.md) › [BeaconApi](_api_impl_beacon_beacon_.beaconapi.md)

# Class: BeaconApi

## Hierarchy

* **BeaconApi**

## Implements

* [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)

## Index

### Constructors

* [constructor](_api_impl_beacon_beacon_.beaconapi.md#constructor)

### Properties

* [chain](_api_impl_beacon_beacon_.beaconapi.md#private-chain)
* [config](_api_impl_beacon_beacon_.beaconapi.md#private-config)
* [db](_api_impl_beacon_beacon_.beaconapi.md#private-db)
* [namespace](_api_impl_beacon_beacon_.beaconapi.md#namespace)

### Methods

* [getBlockStream](_api_impl_beacon_beacon_.beaconapi.md#getblockstream)
* [getClientVersion](_api_impl_beacon_beacon_.beaconapi.md#getclientversion)
* [getFork](_api_impl_beacon_beacon_.beaconapi.md#getfork)
* [getGenesisTime](_api_impl_beacon_beacon_.beaconapi.md#getgenesistime)
* [getSyncingStatus](_api_impl_beacon_beacon_.beaconapi.md#getsyncingstatus)
* [getValidator](_api_impl_beacon_beacon_.beaconapi.md#getvalidator)

## Constructors

###  constructor

\+ **new BeaconApi**(`opts`: Partial‹[IApiOptions](../interfaces/_api_options_.iapioptions.md)›, `modules`: [IApiModules](../interfaces/_api_interface_.iapimodules.md)): *[BeaconApi](_api_impl_beacon_beacon_.beaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:31](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | Partial‹[IApiOptions](../interfaces/_api_options_.iapioptions.md)› |
`modules` | [IApiModules](../interfaces/_api_interface_.iapimodules.md) |

**Returns:** *[BeaconApi](_api_impl_beacon_beacon_.beaconapi.md)*

## Properties

### `Private` chain

• **chain**: *[IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:30](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L30)*

___

### `Private` config

• **config**: *IBeaconConfig*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:29](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L29)*

___

### `Private` db

• **db**: *[IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:31](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L31)*

___

###  namespace

• **namespace**: *[ApiNamespace](../enums/_api_index_.apinamespace.md)*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md).[namespace](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md#namespace)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:27](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L27)*

## Methods

###  getBlockStream

▸ **getBlockStream**(): *AsyncIterable‹SignedBeaconBlock›*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:90](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L90)*

**Returns:** *AsyncIterable‹SignedBeaconBlock›*

___

###  getClientVersion

▸ **getClientVersion**(): *Promise‹Bytes32›*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:40](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L40)*

**Returns:** *Promise‹Bytes32›*

___

###  getFork

▸ **getFork**(): *Promise‹ForkResponse›*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:62](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L62)*

**Returns:** *Promise‹ForkResponse›*

___

###  getGenesisTime

▸ **getGenesisTime**(): *Promise‹Number64›*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:77](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L77)*

**Returns:** *Promise‹Number64›*

___

###  getSyncingStatus

▸ **getSyncingStatus**(): *Promise‹boolean | SyncingStatus›*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:85](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L85)*

**Returns:** *Promise‹boolean | SyncingStatus›*

___

###  getValidator

▸ **getValidator**(`pubkey`: BLSPubkey): *Promise‹ValidatorResponse | null›*

*Implementation of [IBeaconApi](../interfaces/_api_impl_beacon_interface_.ibeaconapi.md)*

*Defined in [packages/lodestar/src/api/impl/beacon/beacon.ts:45](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/api/impl/beacon/beacon.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`pubkey` | BLSPubkey |

**Returns:** *Promise‹ValidatorResponse | null›*
