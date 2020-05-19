[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["network/reqResp"](../modules/_network_reqresp_.md) › [ReqResp](_network_reqresp_.reqresp.md)

# Class: ReqResp <**T, U, V**>

## Type parameters

▪ **T**

▪ **U**

▪ **V**

## Hierarchy

* TypeRecord‹EventEmitter‹›, [IReqEvents](../interfaces/_network_interface_.ireqevents.md), [IReqEvents](../interfaces/_network_interface_.ireqevents.md), this› & object & object

  ↳ **ReqResp**

## Implements

* [IReqResp](../interfaces/_network_interface_.ireqresp.md)

## Index

### Constructors

* [constructor](_network_reqresp_.reqresp.md#constructor)

### Properties

* [ _emitType](_network_reqresp_.reqresp.md#optional--_emittype)
* [ _emitterType](_network_reqresp_.reqresp.md#optional--_emittertype)
* [ _eventsType](_network_reqresp_.reqresp.md#optional--_eventstype)
* [config](_network_reqresp_.reqresp.md#private-config)
* [libp2p](_network_reqresp_.reqresp.md#private-libp2p)
* [logger](_network_reqresp_.reqresp.md#private-logger)
* [peerReputations](_network_reqresp_.reqresp.md#private-peerreputations)
* [responseListener](_network_reqresp_.reqresp.md#private-responselistener)

### Methods

* [beaconBlocksByRange](_network_reqresp_.reqresp.md#beaconblocksbyrange)
* [beaconBlocksByRoot](_network_reqresp_.reqresp.md#beaconblocksbyroot)
* [getResponse](_network_reqresp_.reqresp.md#private-getresponse)
* [goodbye](_network_reqresp_.reqresp.md#goodbye)
* [handleRpcRequest](_network_reqresp_.reqresp.md#private-handlerpcrequest)
* [metadata](_network_reqresp_.reqresp.md#metadata)
* [ping](_network_reqresp_.reqresp.md#ping)
* [sendRequest](_network_reqresp_.reqresp.md#private-sendrequest)
* [sendRequestStream](_network_reqresp_.reqresp.md#private-sendrequeststream)
* [sendResponse](_network_reqresp_.reqresp.md#sendresponse)
* [sendResponseStream](_network_reqresp_.reqresp.md#sendresponsestream)
* [start](_network_reqresp_.reqresp.md#start)
* [status](_network_reqresp_.reqresp.md#status)
* [stop](_network_reqresp_.reqresp.md#stop)
* [storePeerEncodingPreference](_network_reqresp_.reqresp.md#private-storepeerencodingpreference)

## Constructors

###  constructor

\+ **new ReqResp**(`opts`: [INetworkOptions](../interfaces/_network_options_.inetworkoptions.md), `__namedParameters`: object): *[ReqResp](_network_reqresp_.reqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:74](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L74)*

**Parameters:**

▪ **opts**: *[INetworkOptions](../interfaces/_network_options_.inetworkoptions.md)*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`config` | IBeaconConfig |
`libp2p` | LibP2p‹› |
`logger` | ILogger |
`peerReputations` | [IReputationStore](../interfaces/_sync_ireputation_.ireputationstore.md) |

**Returns:** *[ReqResp](_network_reqresp_.reqresp.md)*

## Properties

### `Optional`  _emitType

• ** _emitType**? : *V*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md).[ _emitType](../interfaces/_network_interface_.ireqresp.md#optional--_emittype)*

*Inherited from [IGossip](../interfaces/_network_gossip_interface_.igossip.md).[ _emitType](../interfaces/_network_gossip_interface_.igossip.md#optional--_emittype)*

Defined in node_modules/strict-event-emitter-types/types/src/index.d.ts:7

___

### `Optional`  _emitterType

• ** _emitterType**? : *T*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md).[ _emitterType](../interfaces/_network_interface_.ireqresp.md#optional--_emittertype)*

*Inherited from [IGossip](../interfaces/_network_gossip_interface_.igossip.md).[ _emitterType](../interfaces/_network_gossip_interface_.igossip.md#optional--_emittertype)*

Defined in node_modules/strict-event-emitter-types/types/src/index.d.ts:5

___

### `Optional`  _eventsType

• ** _eventsType**? : *U*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md).[ _eventsType](../interfaces/_network_interface_.ireqresp.md#optional--_eventstype)*

*Inherited from [IGossip](../interfaces/_network_gossip_interface_.igossip.md).[ _eventsType](../interfaces/_network_gossip_interface_.igossip.md#optional--_eventstype)*

Defined in node_modules/strict-event-emitter-types/types/src/index.d.ts:6

___

### `Private` config

• **config**: *IBeaconConfig*

*Defined in [packages/lodestar/src/network/reqResp.ts:70](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L70)*

___

### `Private` libp2p

• **libp2p**: *LibP2p*

*Defined in [packages/lodestar/src/network/reqResp.ts:71](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L71)*

___

### `Private` logger

• **logger**: *ILogger*

*Defined in [packages/lodestar/src/network/reqResp.ts:72](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L72)*

___

### `Private` peerReputations

• **peerReputations**: *[IReputationStore](../interfaces/_sync_ireputation_.ireputationstore.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:74](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L74)*

___

### `Private` responseListener

• **responseListener**: *[ResponseEventListener](_network_reqresp_.responseeventlistener.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:73](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L73)*

## Methods

###  beaconBlocksByRange

▸ **beaconBlocksByRange**(`peerInfo`: PeerInfo, `request`: BeaconBlocksByRangeRequest): *Promise‹SignedBeaconBlock[] | null›*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:153](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L153)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`request` | BeaconBlocksByRangeRequest |

**Returns:** *Promise‹SignedBeaconBlock[] | null›*

___

###  beaconBlocksByRoot

▸ **beaconBlocksByRoot**(`peerInfo`: PeerInfo, `request`: BeaconBlocksByRootRequest): *Promise‹SignedBeaconBlock[] | null›*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:160](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`request` | BeaconBlocksByRootRequest |

**Returns:** *Promise‹SignedBeaconBlock[] | null›*

___

### `Private` getResponse

▸ **getResponse**(`peerId`: PeerId, `method`: [Method](../enums/_constants_network_.method.md), `request?`: RequestBody): *AsyncIterable‹[IResponseChunk](../interfaces/_network_encoders_interface_.iresponsechunk.md)›*

*Defined in [packages/lodestar/src/network/reqResp.ts:196](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L196)*

**Parameters:**

Name | Type |
------ | ------ |
`peerId` | PeerId |
`method` | [Method](../enums/_constants_network_.method.md) |
`request?` | RequestBody |

**Returns:** *AsyncIterable‹[IResponseChunk](../interfaces/_network_encoders_interface_.iresponsechunk.md)›*

___

###  goodbye

▸ **goodbye**(`peerInfo`: PeerInfo, `request`: [Goodbye](../enums/_constants_network_.method.md#goodbye)): *Promise‹void›*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:141](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`request` | [Goodbye](../enums/_constants_network_.method.md#goodbye) |

**Returns:** *Promise‹void›*

___

### `Private` handleRpcRequest

▸ **handleRpcRequest**(`peerId`: PeerId, `method`: [Method](../enums/_constants_network_.method.md)): *function*

*Defined in [packages/lodestar/src/network/reqResp.ts:181](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L181)*

**Parameters:**

Name | Type |
------ | ------ |
`peerId` | PeerId |
`method` | [Method](../enums/_constants_network_.method.md) |

**Returns:** *function*

▸ (`source`: AsyncIterable‹RequestBody›): *AsyncGenerator‹[IResponseChunk](../interfaces/_network_encoders_interface_.iresponsechunk.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`source` | AsyncIterable‹RequestBody› |

___

###  metadata

▸ **metadata**(`peerInfo`: PeerInfo): *Promise‹Metadata | null›*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:149](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |

**Returns:** *Promise‹Metadata | null›*

___

###  ping

▸ **ping**(`peerInfo`: PeerInfo, `request`: [Ping](../enums/_constants_network_.method.md#ping)): *Promise‹[Ping](../enums/_constants_network_.method.md#ping) | null›*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:145](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`request` | [Ping](../enums/_constants_network_.method.md#ping) |

**Returns:** *Promise‹[Ping](../enums/_constants_network_.method.md#ping) | null›*

___

### `Private` sendRequest

▸ **sendRequest**<**T**>(`peerInfo`: PeerInfo, `method`: [Method](../enums/_constants_network_.method.md), `body?`: RequestBody): *Promise‹T | null›*

*Defined in [packages/lodestar/src/network/reqResp.ts:218](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L218)*

**Type parameters:**

▪ **T**: *ResponseBody | ResponseBody[]*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`method` | [Method](../enums/_constants_network_.method.md) |
`body?` | RequestBody |

**Returns:** *Promise‹T | null›*

___

### `Private` sendRequestStream

▸ **sendRequestStream**<**T**>(`peerInfo`: PeerInfo, `method`: [Method](../enums/_constants_network_.method.md), `encoding`: [ReqRespEncoding](../enums/_constants_network_.reqrespencoding.md), `body?`: RequestBody): *AsyncIterable‹T›*

*Defined in [packages/lodestar/src/network/reqResp.ts:252](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L252)*

**Type parameters:**

▪ **T**: *ResponseBody*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`method` | [Method](../enums/_constants_network_.method.md) |
`encoding` | [ReqRespEncoding](../enums/_constants_network_.reqrespencoding.md) |
`body?` | RequestBody |

**Returns:** *AsyncIterable‹T›*

___

###  sendResponse

▸ **sendResponse**(`id`: [RequestId](../modules/_constants_network_.md#requestid), `err`: [RpcError](_network_error_.rpcerror.md) | null, `response?`: ResponseBody): *void*

*Defined in [packages/lodestar/src/network/reqResp.ts:113](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [RequestId](../modules/_constants_network_.md#requestid) |
`err` | [RpcError](_network_error_.rpcerror.md) &#124; null |
`response?` | ResponseBody |

**Returns:** *void*

___

###  sendResponseStream

▸ **sendResponseStream**(`id`: [RequestId](../modules/_constants_network_.md#requestid), `err`: [RpcError](_network_error_.rpcerror.md) | null, `chunkIter`: AsyncIterable‹ResponseBody›): *void*

*Defined in [packages/lodestar/src/network/reqResp.ts:121](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [RequestId](../modules/_constants_network_.md#requestid) |
`err` | [RpcError](_network_error_.rpcerror.md) &#124; null |
`chunkIter` | AsyncIterable‹ResponseBody› |

**Returns:** *void*

___

###  start

▸ **start**(): *Promise‹void›*

*Defined in [packages/lodestar/src/network/reqResp.ts:84](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L84)*

**Returns:** *Promise‹void›*

___

###  status

▸ **status**(`peerInfo`: PeerInfo, `request`: Status): *Promise‹Status | null›*

*Implementation of [IReqResp](../interfaces/_network_interface_.ireqresp.md)*

*Defined in [packages/lodestar/src/network/reqResp.ts:137](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`peerInfo` | PeerInfo |
`request` | Status |

**Returns:** *Promise‹Status | null›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Defined in [packages/lodestar/src/network/reqResp.ts:105](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L105)*

**Returns:** *Promise‹void›*

___

### `Private` storePeerEncodingPreference

▸ **storePeerEncodingPreference**(`peerId`: PeerId, `method`: [Method](../enums/_constants_network_.method.md), `encoding`: [ReqRespEncoding](../enums/_constants_network_.reqrespencoding.md)): *function*

*Defined in [packages/lodestar/src/network/reqResp.ts:167](https://github.com/ChainSafe/lodestar/blob/2084b4ac7/packages/lodestar/src/network/reqResp.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`peerId` | PeerId |
`method` | [Method](../enums/_constants_network_.method.md) |
`encoding` | [ReqRespEncoding](../enums/_constants_network_.reqrespencoding.md) |

**Returns:** *function*

▸ (`source`: AsyncIterable‹RequestBody›): *AsyncGenerator‹RequestBody›*

**Parameters:**

Name | Type |
------ | ------ |
`source` | AsyncIterable‹RequestBody› |
