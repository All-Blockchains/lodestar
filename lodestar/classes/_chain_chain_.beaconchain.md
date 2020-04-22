[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["chain/chain"](../modules/_chain_chain_.md) › [BeaconChain](_chain_chain_.beaconchain.md)

# Class: BeaconChain <**T, U, V**>

## Type parameters

▪ **T**

▪ **U**

▪ **V**

## Hierarchy

* TypeRecord‹EventEmitter‹›, [IChainEvents](../interfaces/_chain_interface_.ichainevents.md), [IChainEvents](../interfaces/_chain_interface_.ichainevents.md), this› & object & object

  ↳ **BeaconChain**

## Implements

* [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)

## Index

### Constructors

* [constructor](_chain_chain_.beaconchain.md#constructor)

### Properties

* [ _emitType](_chain_chain_.beaconchain.md#optional--_emittype)
* [ _emitterType](_chain_chain_.beaconchain.md#optional--_emittertype)
* [ _eventsType](_chain_chain_.beaconchain.md#optional--_eventstype)
* [_currentForkDigest](_chain_chain_.beaconchain.md#private-_currentforkdigest)
* [attestationProcessor](_chain_chain_.beaconchain.md#private-attestationprocessor)
* [blockProcessor](_chain_chain_.beaconchain.md#private-blockprocessor)
* [chain](_chain_chain_.beaconchain.md#chain)
* [chainId](_chain_chain_.beaconchain.md#chainid)
* [clock](_chain_chain_.beaconchain.md#clock)
* [config](_chain_chain_.beaconchain.md#private-config)
* [db](_chain_chain_.beaconchain.md#private-db)
* [eth1](_chain_chain_.beaconchain.md#private-eth1)
* [eth1Listener](_chain_chain_.beaconchain.md#private-eth1listener)
* [forkChoice](_chain_chain_.beaconchain.md#forkchoice)
* [logger](_chain_chain_.beaconchain.md#private-logger)
* [metrics](_chain_chain_.beaconchain.md#private-metrics)
* [networkId](_chain_chain_.beaconchain.md#networkid)
* [opPool](_chain_chain_.beaconchain.md#private-oppool)
* [opts](_chain_chain_.beaconchain.md#private-opts)

### Accessors

* [currentForkDigest](_chain_chain_.beaconchain.md#currentforkdigest)

### Methods

* [checkGenesis](_chain_chain_.beaconchain.md#private-checkgenesis)
* [getCurrentForkDigest](_chain_chain_.beaconchain.md#private-getcurrentforkdigest)
* [getHeadBlock](_chain_chain_.beaconchain.md#getheadblock)
* [getHeadState](_chain_chain_.beaconchain.md#getheadstate)
* [initializeBeaconChain](_chain_chain_.beaconchain.md#initializebeaconchain)
* [isInitialized](_chain_chain_.beaconchain.md#isinitialized)
* [receiveAttestation](_chain_chain_.beaconchain.md#receiveattestation)
* [receiveBlock](_chain_chain_.beaconchain.md#receiveblock)
* [start](_chain_chain_.beaconchain.md#start)
* [stop](_chain_chain_.beaconchain.md#stop)
* [waitForState](_chain_chain_.beaconchain.md#private-waitforstate)

## Constructors

###  constructor

\+ **new BeaconChain**(`opts`: [IChainOptions](../interfaces/_chain_options_.ichainoptions.md), `__namedParameters`: object): *[BeaconChain](_chain_chain_.beaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:59](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L59)*

**Parameters:**

▪ **opts**: *[IChainOptions](../interfaces/_chain_options_.ichainoptions.md)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`db` | [IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md) |
`eth1` | [IEth1Notifier](../interfaces/_eth1_interface_.ieth1notifier.md)‹› |
`logger` | ILogger |
`metrics` | [IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md) |
`opPool` | [OpPool](_oppool_oppool_.oppool.md)‹› |

**Returns:** *[BeaconChain](_chain_chain_.beaconchain.md)*

## Properties

### `Optional`  _emitType

• ** _emitType**? : *V*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[ _emitType](../interfaces/_chain_interface_.ibeaconchain.md#optional--_emittype)*

*Inherited from [IEth1Notifier](../interfaces/_eth1_interface_.ieth1notifier.md).[ _emitType](../interfaces/_eth1_interface_.ieth1notifier.md#optional--_emittype)*

Defined in node_modules/strict-event-emitter-types/types/src/index.d.ts:7

___

### `Optional`  _emitterType

• ** _emitterType**? : *T*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[ _emitterType](../interfaces/_chain_interface_.ibeaconchain.md#optional--_emittertype)*

*Inherited from [IEth1Notifier](../interfaces/_eth1_interface_.ieth1notifier.md).[ _emitterType](../interfaces/_eth1_interface_.ieth1notifier.md#optional--_emittertype)*

Defined in node_modules/strict-event-emitter-types/types/src/index.d.ts:5

___

### `Optional`  _eventsType

• ** _eventsType**? : *U*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[ _eventsType](../interfaces/_chain_interface_.ibeaconchain.md#optional--_eventstype)*

*Inherited from [IEth1Notifier](../interfaces/_eth1_interface_.ieth1notifier.md).[ _eventsType](../interfaces/_eth1_interface_.ieth1notifier.md#optional--_eventstype)*

Defined in node_modules/strict-event-emitter-types/types/src/index.d.ts:6

___

### `Private` _currentForkDigest

• **_currentForkDigest**: *ForkDigest*

*Defined in [packages/lodestar/src/chain/chain.ts:57](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L57)*

___

### `Private` attestationProcessor

• **attestationProcessor**: *[IAttestationProcessor](../interfaces/_chain_interface_.iattestationprocessor.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:58](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L58)*

___

### `Private` blockProcessor

• **blockProcessor**: *[BlockProcessor](_chain_blocks_processor_.blockprocessor.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:56](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L56)*

___

###  chain

• **chain**: *string*

*Defined in [packages/lodestar/src/chain/chain.ts:44](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L44)*

___

###  chainId

• **chainId**: *Uint16*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[chainId](../interfaces/_chain_interface_.ibeaconchain.md#chainid)*

*Defined in [packages/lodestar/src/chain/chain.ts:46](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L46)*

___

###  clock

• **clock**: *[IBeaconClock](../interfaces/_chain_clock_interface_.ibeaconclock.md)*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[clock](../interfaces/_chain_interface_.ibeaconchain.md#clock)*

*Defined in [packages/lodestar/src/chain/chain.ts:48](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L48)*

___

### `Private` config

• **config**: *IBeaconConfig*

*Defined in [packages/lodestar/src/chain/chain.ts:49](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L49)*

___

### `Private` db

• **db**: *[IBeaconDb](../interfaces/_db_api_beacon_interface_.ibeacondb.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:50](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L50)*

___

### `Private` eth1

• **eth1**: *[IEth1Notifier](../interfaces/_eth1_interface_.ieth1notifier.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:52](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L52)*

___

### `Private` eth1Listener

• **eth1Listener**: *function*

*Defined in [packages/lodestar/src/chain/chain.ts:59](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L59)*

#### Type declaration:

▸ (`eth1Block`: Block): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eth1Block` | Block |

___

###  forkChoice

• **forkChoice**: *[ILMDGHOST](../interfaces/_chain_forkchoice_interface_.ilmdghost.md)*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[forkChoice](../interfaces/_chain_interface_.ibeaconchain.md#forkchoice)*

*Defined in [packages/lodestar/src/chain/chain.ts:45](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L45)*

___

### `Private` logger

• **logger**: *ILogger*

*Defined in [packages/lodestar/src/chain/chain.ts:53](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L53)*

___

### `Private` metrics

• **metrics**: *[IBeaconMetrics](../interfaces/_metrics_interface_.ibeaconmetrics.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:54](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L54)*

___

###  networkId

• **networkId**: *Uint64*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md).[networkId](../interfaces/_chain_interface_.ibeaconchain.md#networkid)*

*Defined in [packages/lodestar/src/chain/chain.ts:47](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L47)*

___

### `Private` opPool

• **opPool**: *[OpPool](_oppool_oppool_.oppool.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:51](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L51)*

___

### `Private` opts

• **opts**: *[IChainOptions](../interfaces/_chain_options_.ichainoptions.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:55](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L55)*

## Accessors

###  currentForkDigest

• **get currentForkDigest**(): *ForkDigest*

*Defined in [packages/lodestar/src/chain/chain.ts:111](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L111)*

**Returns:** *ForkDigest*

## Methods

### `Private` checkGenesis

▸ **checkGenesis**(`eth1Block`: Block): *Promise‹BeaconState›*

*Defined in [packages/lodestar/src/chain/chain.ts:193](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`eth1Block` | Block |

**Returns:** *Promise‹BeaconState›*

___

### `Private` getCurrentForkDigest

▸ **getCurrentForkDigest**(): *Promise‹ForkDigest›*

*Defined in [packages/lodestar/src/chain/chain.ts:164](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L164)*

**Returns:** *Promise‹ForkDigest›*

___

###  getHeadBlock

▸ **getHeadBlock**(): *Promise‹SignedBeaconBlock | null›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:83](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L83)*

**Returns:** *Promise‹SignedBeaconBlock | null›*

___

###  getHeadState

▸ **getHeadState**(): *Promise‹BeaconState | null›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:79](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L79)*

**Returns:** *Promise‹BeaconState | null›*

___

###  initializeBeaconChain

▸ **initializeBeaconChain**(`genesisState`: BeaconState, `depositDataRootList`: TreeBacked‹List‹Root››): *Promise‹void›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:123](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`genesisState` | BeaconState |
`depositDataRootList` | TreeBacked‹List‹Root›› |

**Returns:** *Promise‹void›*

___

###  isInitialized

▸ **isInitialized**(): *boolean*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:87](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L87)*

**Returns:** *boolean*

___

###  receiveAttestation

▸ **receiveAttestation**(`attestation`: Attestation): *Promise‹void›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:115](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`attestation` | Attestation |

**Returns:** *Promise‹void›*

___

###  receiveBlock

▸ **receiveBlock**(`signedBlock`: SignedBeaconBlock, `trusted`: boolean): *Promise‹void›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:119](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L119)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`signedBlock` | SignedBeaconBlock | - |
`trusted` | boolean | false |

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:92](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L92)*

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Implementation of [IBeaconChain](../interfaces/_chain_interface_.ibeaconchain.md)*

*Defined in [packages/lodestar/src/chain/chain.ts:105](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L105)*

**Returns:** *Promise‹void›*

___

### `Private` waitForState

▸ **waitForState**(): *Promise‹BeaconState›*

*Defined in [packages/lodestar/src/chain/chain.ts:170](https://github.com/ChainSafe/lodestar/blob/f536e8f/packages/lodestar/src/chain/chain.ts#L170)*

**Returns:** *Promise‹BeaconState›*
