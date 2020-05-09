[@chainsafe/lodestar](../README.md) › [Globals](../globals.md) › ["api/rest/routes/validator/produceAttestation"](_api_rest_routes_validator_produceattestation_.md)

# External module: "api/rest/routes/validator/produceAttestation"

## Index

### Interfaces

* [IQuery](../interfaces/_api_rest_routes_validator_produceattestation_.iquery.md)

### Functions

* [registerAttestationProductionEndpoint](_api_rest_routes_validator_produceattestation_.md#const-registerattestationproductionendpoint)

### Object literals

* [opts](_api_rest_routes_validator_produceattestation_.md#const-opts)

## Functions

### `Const` registerAttestationProductionEndpoint

▸ **registerAttestationProductionEndpoint**(`fastify`: FastifyInstance‹Server‹›, IncomingMessage‹›, ServerResponse‹››, `__namedParameters`: object): *void*

*Defined in [packages/lodestar/src/api/rest/routes/validator/produceAttestation.ts:37](https://github.com/ChainSafe/lodestar/blob/16dbdb2e2/packages/lodestar/src/api/rest/routes/validator/produceAttestation.ts#L37)*

**Parameters:**

▪ **fastify**: *FastifyInstance‹Server‹›, IncomingMessage‹›, ServerResponse‹››*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`api` | object |
`config` | IBeaconConfig |

**Returns:** *void*

## Object literals

### `Const` opts

### ▪ **opts**: *object*

*Defined in [packages/lodestar/src/api/rest/routes/validator/produceAttestation.ts:15](https://github.com/ChainSafe/lodestar/blob/16dbdb2e2/packages/lodestar/src/api/rest/routes/validator/produceAttestation.ts#L15)*

▪ **schema**: *object*

*Defined in [packages/lodestar/src/api/rest/routes/validator/produceAttestation.ts:16](https://github.com/ChainSafe/lodestar/blob/16dbdb2e2/packages/lodestar/src/api/rest/routes/validator/produceAttestation.ts#L16)*

* **querystring**: *object*

  * **required**: *string[]* = ["validator_pubkey", "slot", "attestation_committee_index"]

  * **type**: *string* = "object"

  * **properties**: *object*

    * **attestation_committee_index**: *object*

      * **minimum**: *number* = 0

      * **type**: *string* = "integer"

    * **slot**: *object*

      * **minimum**: *number* = 0

      * **type**: *string* = "integer"

    * **validator_pubkey**: *object*

      * **type**: *string* = "string"
