[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["network/nodejs/bundle"](../modules/_network_nodejs_bundle_.md) › [ILibp2pOptions](_network_nodejs_bundle_.ilibp2poptions.md)

# Interface: ILibp2pOptions

## Hierarchy

* **ILibp2pOptions**

## Index

### Properties

* [autoDial](_network_nodejs_bundle_.ilibp2poptions.md#autodial)
* [bootnodes](_network_nodejs_bundle_.ilibp2poptions.md#optional-bootnodes)
* [discv5](_network_nodejs_bundle_.ilibp2poptions.md#discv5)
* [peerDiscovery](_network_nodejs_bundle_.ilibp2poptions.md#optional-peerdiscovery)
* [peerInfo](_network_nodejs_bundle_.ilibp2poptions.md#peerinfo)

## Properties

###  autoDial

• **autoDial**: *boolean*

*Defined in [packages/lodestar/src/network/nodejs/bundle.ts:18](https://github.com/ChainSafe/lodestar/blob/bd8798297/packages/lodestar/src/network/nodejs/bundle.ts#L18)*

___

### `Optional` bootnodes

• **bootnodes**? : *string[]*

*Defined in [packages/lodestar/src/network/nodejs/bundle.ts:25](https://github.com/ChainSafe/lodestar/blob/bd8798297/packages/lodestar/src/network/nodejs/bundle.ts#L25)*

___

###  discv5

• **discv5**: *object*

*Defined in [packages/lodestar/src/network/nodejs/bundle.ts:19](https://github.com/ChainSafe/lodestar/blob/bd8798297/packages/lodestar/src/network/nodejs/bundle.ts#L19)*

#### Type declaration:

* **bindAddr**: *string*

* **bootEnrs**? : *ENRInput[]*

* **enr**: *ENRInput*

___

### `Optional` peerDiscovery

• **peerDiscovery**? : *LibP2pBootstrap | LibP2pMdns | Discv5Discovery[]*

*Defined in [packages/lodestar/src/network/nodejs/bundle.ts:24](https://github.com/ChainSafe/lodestar/blob/bd8798297/packages/lodestar/src/network/nodejs/bundle.ts#L24)*

___

###  peerInfo

• **peerInfo**: *PeerInfo*

*Defined in [packages/lodestar/src/network/nodejs/bundle.ts:17](https://github.com/ChainSafe/lodestar/blob/bd8798297/packages/lodestar/src/network/nodejs/bundle.ts#L17)*
