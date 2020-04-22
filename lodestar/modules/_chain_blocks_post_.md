[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["chain/blocks/post"](_chain_blocks_post_.md)

# External module: "chain/blocks/post"

## Index

### Functions

* [postProcess](_chain_blocks_post_.md#postprocess)
* [setFinalized](_chain_blocks_post_.md#setfinalized)
* [setJustified](_chain_blocks_post_.md#setjustified)

## Functions

###  postProcess

▸ **postProcess**(`config`: IBeaconConfig, `db`: [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md), `logger`: ILogger, `metrics`: [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md), `eventBus`: [ChainEventEmitter](_chain_interface_.md#chaineventemitter), `opPool`: [OpPool](../classes/_oppool_oppool_.oppool.md), `attestationProcessor`: [IAttestationProcessor](../interfaces/_chain_interface_.iattestationprocessor.md)): *function*

*Defined in [packages/lodestar/src/chain/blocks/post.ts:11](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/blocks/post.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`db` | [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md) |
`logger` | ILogger |
`metrics` | [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md) |
`eventBus` | [ChainEventEmitter](_chain_interface_.md#chaineventemitter) |
`opPool` | [OpPool](../classes/_oppool_oppool_.oppool.md) |
`attestationProcessor` | [IAttestationProcessor](../interfaces/_chain_interface_.iattestationprocessor.md) |

**Returns:** *function*

▸ (`source`: AsyncIterable‹object›): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`source` | AsyncIterable‹object› |

___

###  setFinalized

▸ **setFinalized**(`config`: IBeaconConfig, `db`: [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md), `eventBus`: [ChainEventEmitter](_chain_interface_.md#chaineventemitter), `logger`: ILogger, `metrics`: [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md), `postState`: BeaconState, `preFinalizedEpoch`: Epoch): *Promise‹void›*

*Defined in [packages/lodestar/src/chain/blocks/post.ts:62](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/blocks/post.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`db` | [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md) |
`eventBus` | [ChainEventEmitter](_chain_interface_.md#chaineventemitter) |
`logger` | ILogger |
`metrics` | [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md) |
`postState` | BeaconState |
`preFinalizedEpoch` | Epoch |

**Returns:** *Promise‹void›*

___

###  setJustified

▸ **setJustified**(`config`: IBeaconConfig, `db`: [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md), `eventBus`: [ChainEventEmitter](_chain_interface_.md#chaineventemitter), `logger`: ILogger, `metrics`: [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md), `postState`: BeaconState, `preJustifiedEpoch`: Epoch): *Promise‹void›*

*Defined in [packages/lodestar/src/chain/blocks/post.ts:43](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/blocks/post.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`db` | [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md) |
`eventBus` | [ChainEventEmitter](_chain_interface_.md#chaineventemitter) |
`logger` | ILogger |
`metrics` | [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md) |
`postState` | BeaconState |
`preJustifiedEpoch` | Epoch |

**Returns:** *Promise‹void›*
