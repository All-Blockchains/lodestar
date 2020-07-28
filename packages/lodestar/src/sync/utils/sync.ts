import PeerId from "peer-id";
import {IReputation} from "../IReputation";
import {Checkpoint, SignedBeaconBlock, Slot, Status} from "@chainsafe/lodestar-types";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IReqResp} from "../../network";
import {ISlotRange} from "../interface";
import {IBeaconChain} from "../../chain";
import {getBlockRange, isValidChainOfBlocks, sortBlocks, getBlockRangeInterleave} from "./blocks";
import {ILogger} from "@chainsafe/lodestar-utils/lib/logger";
import {toHexString} from "@chainsafe/ssz";
import {blockToHeader} from "@chainsafe/lodestar-beacon-state-transition";
import {sleep} from "../../util/sleep";

export function getHighestCommonSlot(peers: IReputation[]): Slot {
  const slotStatuses = peers.reduce<Map<Slot, number>>((current, peer) => {
    if(peer.latestStatus && current.has(peer.latestStatus.headSlot)) {
      current.set(peer.latestStatus.headSlot, current.get(peer.latestStatus.headSlot) + 1);
    } else if(peer.latestStatus) {
      current.set(peer.latestStatus.headSlot, 1);
    }
    return current;
  }, new Map<Slot, number>());
  if(slotStatuses.size) {
    const best =  [...slotStatuses.entries()]
      .sort((a, b) => {
        const aVotes = a[1];
        const bVotes = b[1];
        if(aVotes > bVotes) return -1;
        if(aVotes < bVotes) return 1;
        const aSlot = a[0];
        const bSlot = b[0];
        if(aSlot > bSlot) return -1;
        if(aSlot < bSlot) return 1;
        return 0;
      });
    return best[0][0];
  } else {
    return 0;
  }
}

export function getStatusFinalizedCheckpoint(status: Status): Checkpoint {
  return {epoch: status.finalizedEpoch, root: status.finalizedRoot};
}

export function getCommonFinalizedCheckpoint(config: IBeaconConfig, peers: IReputation[]): Checkpoint|null {
  const checkpointVotes = peers.reduce<Map<string, {checkpoint: Checkpoint; votes: number}>>(
    (current, peer) => {
      if(!peer.latestStatus) {
        return current;
      }
      const peerCheckpoint = getStatusFinalizedCheckpoint(peer.latestStatus);
      const root = toHexString(config.types.Checkpoint.hashTreeRoot(peerCheckpoint));
      if(current.has(root)) {
        current.get(root).votes++;
      } else {
        current.set(root, {checkpoint: peerCheckpoint, votes: 1});
      }
      return current;
    }, new Map());
  if(checkpointVotes.size > 0) {
    return Array.from(checkpointVotes.values())
      .sort((voteA, voteB) => {
        if (voteA.votes > voteB.votes) return -1;
        if (voteA.votes < voteB.votes) return 1;
        if(voteA.checkpoint.epoch > voteB.checkpoint.epoch) return -1;
        if(voteA.checkpoint.epoch < voteB.checkpoint.epoch) return 1;
        return 0;
      }).shift().checkpoint;
  } else {
    return null;
  }
}

/**
 * Used for initial sync where we divide a range by chunks.
 */
export function fetchBlockChunks(
  logger: ILogger,
  chain: IBeaconChain,
  reqResp: IReqResp,
  getPeers: () => Promise<PeerId[]>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  maxBlocksPerChunk?: number
): (source: AsyncIterable<ISlotRange>,) => AsyncGenerator<SignedBeaconBlock[]> {
  return (source) => {
    return (async function*() {
      for await (const slotRange of source) {
        const peers = await waitForPeers(logger, getPeers);
        if(peers.length === 0) {
          logger.error("fetchBlockChunks: Can't find new peers, stopping sync");
          return;
        }
        try {
          yield await getBlockRange(
            logger,
            reqResp,
            peers,
            slotRange
          );
        } catch (e) {
          logger.debug("Failed to get block range " + JSON.stringify(slotRange) + ". Error: " + e.message);
          return;
        }
      }
    })();
  };
}

/**
 * Used for regular sync where we get blocks by interleaving way.
 */
export function fetchBlockInterleave(
  logger: ILogger,
  reqResp: IReqResp,
  getPeers: () => Promise<PeerId[]>,
): (source: AsyncIterable<ISlotRange>,) => AsyncGenerator<SignedBeaconBlock[]> {
  return (source) => {
    return (async function*() {
      for await (const slotRange of source) {
        const peers = await waitForPeers(logger, getPeers);
        if(peers.length === 0) {
          logger.error("fetchBlockInterleave: Can't find new peers");
          return;
        }
        try {
          yield await getBlockRangeInterleave(
            logger,
            reqResp,
            peers,
            slotRange
          );
        } catch (e) {
          logger.debug("Failed to get block range " + JSON.stringify(slotRange) + ". Error: " + e.message);
          return;
        }
      }
    })();
  };
}

export function validateBlocks(
  config: IBeaconConfig, chain: IBeaconChain, logger: ILogger, onBlockVerificationFail: Function
): (source: AsyncIterable<SignedBeaconBlock[]>) => AsyncGenerator<SignedBeaconBlock[]> {
  return (source) => {
    return (async function*() {
      for await (const blockChunk of source) {
        if(blockChunk.length === 0) {
          continue;
        }
        const head =  blockToHeader(config, (await chain.getHeadBlock()).message);
        if(
          isValidChainOfBlocks(
            config,
            head,
            blockChunk
          )
        ) {
          yield blockChunk;
        } else {
          logger.warn(
            "Hash chain doesnt match! "
              + `Head(${head.slot}): ${toHexString(config.types.BeaconBlockHeader.hashTreeRoot(head))}`
              + `Blocks: (${blockChunk[0].message.slot}..${blockChunk[blockChunk.length - 1].message.slot})`
          );
          //discard blocks and trigger resync so we try to fetch blocks again
          onBlockVerificationFail();
        }
      }
    })();
  };
}

/**
 * Bufferes and orders block and passes them to chain.
 * Returns last processed slot if it was successful,
 * current head slot if there was consensus split
 * or null if there was no slots
 * @param config
 * @param chain
 * @param logger
 * @param isInitialSync
 * @param trusted
 */
export function processSyncBlocks(
  config: IBeaconConfig, chain: IBeaconChain, logger: ILogger, isInitialSync: boolean, trusted = false
): (source: AsyncIterable<SignedBeaconBlock[]>) => Promise<Slot|null> {
  return async (source) => {
    let blockBuffer: SignedBeaconBlock[] = [];
    let lastProcessedSlot: Slot|null = null;
    for await (const blocks of source) {
      logger.info("Imported blocks for slots: " + blocks.map((block) => block.message.slot).join(","));
      blockBuffer.push(...blocks);
    }
    blockBuffer = sortBlocks(blockBuffer);
    let headRoot = chain.forkChoice.headBlockRoot();
    let headSlot = chain.forkChoice.headBlockSlot();
    while(blockBuffer.length > 0) {
      const signedBlock = blockBuffer.shift();
      const block = signedBlock.message;
      if(!isInitialSync ||
        (isInitialSync && block.slot > headSlot && config.types.Root.equals(headRoot, block.parentRoot))) {
        await chain.receiveBlock(signedBlock, trusted);
        headRoot = config.types.BeaconBlockHeader.hashTreeRoot(blockToHeader(config, block));
        headSlot = block.slot;
        if(block.slot > lastProcessedSlot) {
          lastProcessedSlot = block.slot;
        }
      } else {
        logger.warn(
          "Received block parent root doesn't match our head",
          {
            head: toHexString(headRoot),
            headSlot,
            blockParent: toHexString(block.parentRoot),
            blockSlot: block.slot
          }
        );
        //this will trigger sync to retry to fetch this chunk again
        lastProcessedSlot = lastProcessedSlot || chain.forkChoice.headBlockSlot();
        break;
      }
    }
    return lastProcessedSlot;
  };
}

async function waitForPeers(logger: ILogger, getPeers: () => Promise<PeerId[]>): Promise<PeerId[]> {
  let peers = await getPeers();
  let retry = 0;
  while (peers.length === 0 && retry < 5) {
    logger.info("Waiting for peers...");
    await sleep(6000);
    peers = await getPeers();
    retry++;
  }
  return peers;
}