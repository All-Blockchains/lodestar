[@chainsafe/lodestar-validator](../README.md) › [Globals](../globals.md) › ["api/interface/beacon"](../modules/_api_interface_beacon_.md) › [IBeaconApi](_api_interface_beacon_.ibeaconapi.md)

# Interface: IBeaconApi

## Hierarchy

* **IBeaconApi**

## Implemented by

* [RestBeaconApi](../classes/_api_impl_rest_beacon_beacon_.restbeaconapi.md)

## Index

### Methods

* [getClientVersion](_api_interface_beacon_.ibeaconapi.md#getclientversion)
* [getFork](_api_interface_beacon_.ibeaconapi.md#getfork)
* [getGenesisTime](_api_interface_beacon_.ibeaconapi.md#getgenesistime)
* [getSyncingStatus](_api_interface_beacon_.ibeaconapi.md#getsyncingstatus)
* [getValidator](_api_interface_beacon_.ibeaconapi.md#getvalidator)

## Methods

###  getClientVersion

▸ **getClientVersion**(): *Promise‹Bytes32›*

*Defined in [packages/lodestar-validator/src/api/interface/beacon.ts:12](https://github.com/ChainSafe/lodestar/blob/9ad0d0ff3/packages/lodestar-validator/src/api/interface/beacon.ts#L12)*

Requests that the BeaconNode identify information about its
implementation in a format similar to a HTTP User-Agent field.

**Returns:** *Promise‹Bytes32›*

An ASCII-encoded hex string which
uniquely defines the implementation of the BeaconNode and its current software version.

___

###  getFork

▸ **getFork**(): *Promise‹object›*

*Defined in [packages/lodestar-validator/src/api/interface/beacon.ts:17](https://github.com/ChainSafe/lodestar/blob/9ad0d0ff3/packages/lodestar-validator/src/api/interface/beacon.ts#L17)*

Requests the BeaconNode to provide which fork version it is currently on.

**Returns:** *Promise‹object›*

___

###  getGenesisTime

▸ **getGenesisTime**(): *Promise‹Number64›*

*Defined in [packages/lodestar-validator/src/api/interface/beacon.ts:30](https://github.com/ChainSafe/lodestar/blob/9ad0d0ff3/packages/lodestar-validator/src/api/interface/beacon.ts#L30)*

Requests the genesis_time parameter from the BeaconNode,
which should be consistent across all BeaconNodes that follow the same beacon chain.

**Returns:** *Promise‹Number64›*

The genesis_time,
which is a fairly static configuration option for the BeaconNode.

___

###  getSyncingStatus

▸ **getSyncingStatus**(): *Promise‹boolean | SyncingStatus›*

*Defined in [packages/lodestar-validator/src/api/interface/beacon.ts:39](https://github.com/ChainSafe/lodestar/blob/9ad0d0ff3/packages/lodestar-validator/src/api/interface/beacon.ts#L39)*

Requests the BeaconNode to describe if it's currently syncing or not,
and if it is, what block it is up to.
This is modelled after the Eth1.0 JSON-RPC eth_syncing call.

**Returns:** *Promise‹boolean | SyncingStatus›*

Either false if the node is not syncing,
or a SyncingStatus object if it is.

___

###  getValidator

▸ **getValidator**(`pubkey`: BLSPubkey): *Promise‹ValidatorResponse | null›*

*Defined in [packages/lodestar-validator/src/api/interface/beacon.ts:22](https://github.com/ChainSafe/lodestar/blob/9ad0d0ff3/packages/lodestar-validator/src/api/interface/beacon.ts#L22)*

Requests the BeaconNode to provide validator details for given public key.

**Parameters:**

Name | Type |
------ | ------ |
`pubkey` | BLSPubkey |

**Returns:** *Promise‹ValidatorResponse | null›*
