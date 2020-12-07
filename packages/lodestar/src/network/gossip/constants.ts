/**
 * @module network/gossip
 */

import {CommitteeIndex} from "@chainsafe/lodestar-types";
import {ATTESTATION_SUBNET_COUNT} from "../../constants";

export enum GossipEvent {
  BLOCK = "beacon_block",
  AGGREGATE_AND_PROOF = "beacon_aggregate_and_proof",
  ATTESTATION_SUBNET = "beacon_attestation_{subnet}",
  VOLUNTARY_EXIT = "voluntary_exit",
  PROPOSER_SLASHING = "proposer_slashing",
  ATTESTER_SLASHING = "attester_slashing",
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AttestationSubnetRegExp = new RegExp("^(/eth2/)([a-f0-9]{8})(/beacon_attestation_)([0-9]+/)([a-z_]+)$");

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GossipTopicRegExp = new RegExp("^(/eth2/)([a-f0-9]{8})/(\\w+)(/[a-z]+)");

export function getCommitteeSubnetEvent(index: CommitteeIndex): string {
  return GossipEvent.ATTESTATION_SUBNET.replace("{subnet}", String(index % ATTESTATION_SUBNET_COUNT));
}

export const enum ExtendedValidatorResult {
  accept = "accept",
  reject = "reject",
  ignore = "ignore",
}

export const GOSSIP_MSGID_LENGTH = 20;

/**
 * 4-byte domain for gossip message-id isolation of *invalid* snappy messages
 */
export const MESSAGE_DOMAIN_VALID_SNAPPY = Buffer.from("00000000", "hex");

/**
 * 4-byte domain for gossip message-id isolation of *valid* snappy messages
 */
export const MESSAGE_DOMAIN_INVALID_SNAPPY = Buffer.from("01000000", "hex");
