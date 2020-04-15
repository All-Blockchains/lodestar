[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["tasks/index"](../modules/_tasks_index_.md) › [TasksService](_tasks_index_.tasksservice.md)

# Class: TasksService

Used for running tasks that depends on some events or are executed
periodically.

## Hierarchy

* **TasksService**

## Implements

* [IService](../interfaces/_node_nodejs_.iservice.md)

## Index

### Constructors

* [constructor](_tasks_index_.tasksservice.md#constructor)

### Properties

* [chain](_tasks_index_.tasksservice.md#private-chain)
* [config](_tasks_index_.tasksservice.md#private-config)
* [db](_tasks_index_.tasksservice.md#private-db)
* [logger](_tasks_index_.tasksservice.md#private-logger)
* [network](_tasks_index_.tasksservice.md#private-network)
* [sync](_tasks_index_.tasksservice.md#private-sync)

### Methods

* [handleFinalizedCheckpointChores](_tasks_index_.tasksservice.md#private-handlefinalizedcheckpointchores)
* [handleRegularSyncStartedTasks](_tasks_index_.tasksservice.md#private-handleregularsyncstartedtasks)
* [start](_tasks_index_.tasksservice.md#start)
* [stop](_tasks_index_.tasksservice.md#stop)

## Constructors

###  constructor

\+ **new TasksService**(`config`: IBeaconConfig, `modules`: [ITasksModules](../interfaces/_tasks_index_.itasksmodules.md)): *[TasksService](_tasks_index_.tasksservice.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:35](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`modules` | [ITasksModules](../interfaces/_tasks_index_.itasksmodules.md) |

**Returns:** *[TasksService](_tasks_index_.tasksservice.md)*

## Properties

### `Private` chain

• **chain**: *[IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:32](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L32)*

___

### `Private` config

• **config**: *IBeaconConfig*

*Defined in [packages/lodestar/src/tasks/index.ts:30](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L30)*

___

### `Private` db

• **db**: *[IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:31](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L31)*

___

### `Private` logger

• **logger**: *ILogger*

*Defined in [packages/lodestar/src/tasks/index.ts:35](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L35)*

___

### `Private` network

• **network**: *[INetwork](../interfaces/_network_interface_.inetwork.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:34](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L34)*

___

### `Private` sync

• **sync**: *[Sync](_sync_index_.sync.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:33](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L33)*

## Methods

### `Private` handleFinalizedCheckpointChores

▸ **handleFinalizedCheckpointChores**(`finalizedCheckpoint`: Checkpoint): *Promise‹void›*

*Defined in [packages/lodestar/src/tasks/index.ts:56](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`finalizedCheckpoint` | Checkpoint |

**Returns:** *Promise‹void›*

___

### `Private` handleRegularSyncStartedTasks

▸ **handleRegularSyncStartedTasks**(): *Promise‹void›*

*Defined in [packages/lodestar/src/tasks/index.ts:60](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L60)*

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Implementation of [IService](../interfaces/_node_nodejs_.iservice.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:46](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L46)*

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Implementation of [IService](../interfaces/_node_nodejs_.iservice.md)*

*Defined in [packages/lodestar/src/tasks/index.ts:51](https://github.com/ChainSafe/lodestar/blob/4796680/packages/lodestar/src/tasks/index.ts#L51)*

**Returns:** *Promise‹void›*
