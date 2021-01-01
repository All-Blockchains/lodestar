import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {SignedBeaconBlock, Slot} from "@chainsafe/lodestar-types";
import {SlotRoot} from "@chainsafe/lodestar-types";
import {ErrorAborted, ILogger, sleep, withTimeout} from "@chainsafe/lodestar-utils";
import deepmerge from "deepmerge";
import PeerId from "peer-id";
import {IRegularSyncModules} from "..";
import {defaultOptions, IRegularSyncOptions} from "../options";
import {IBeaconChain} from "../../../chain";
import {INetwork} from "../../../network";
import {ISlotRange} from "../../interface";
import {ZERO_HASH} from "../../../constants";
import {assertLinearChainSegment, getBlockRange} from "../../utils";
import {IBlockRangeFetcher} from "./interface";

/**
 * Get next range by issuing beacon_blocks_by_range requests.
 * Returned result may miss some blocks or contain blocks of a different forkchoice branch.
 * This is ok, we handle that by beacon_blocks_by_root in sync service.
 */
export class BlockRangeFetcher implements IBlockRangeFetcher {
  protected readonly config: IBeaconConfig;
  private readonly network: INetwork;
  private readonly chain: IBeaconChain;
  private readonly logger: ILogger;
  private readonly opts: IRegularSyncOptions;
  // for control range across next() calls
  private lastFetchCheckpoint: SlotRoot;
  // for each next() call
  private rangeStart: Slot = 0;
  private rangeEnd: Slot = 0;
  private getPeers: (exludedPeers?: string[]) => Promise<PeerId[]>;

  constructor(
    options: Partial<IRegularSyncOptions>,
    modules: IRegularSyncModules,
    getPeers: (exludedPeers?: string[]) => Promise<PeerId[]>
  ) {
    this.config = modules.config;
    this.network = modules.network;
    this.chain = modules.chain;
    this.logger = modules.logger;
    this.opts = deepmerge(defaultOptions, options);
    this.getPeers = getPeers;
    this.lastFetchCheckpoint = {root: ZERO_HASH, slot: 0};
  }

  public setLastProcessedBlock(lastFetchCheckpoint: SlotRoot): void {
    this.lastFetchCheckpoint = lastFetchCheckpoint;
  }

  /**
   * Get next block range.
   */
  public async getNextBlockRange(): Promise<SignedBeaconBlock[]> {
    this.updateNextRange();
    let result: SignedBeaconBlock[] | null = null;
    let peer: PeerId | null = null;
    const badPeers = new Set<string>();

    // expect at least 2 blocks since we check linear chain
    while (!result || result!.length <= 1) {
      let slotRange: ISlotRange | null = null;
      try {
        if (result && result!.length <= 1) {
          await this.handleEmptyRange(peer!, result);
        }
        if (peer) {
          // peers may return incorrect empty range, or 1 block, or 2 blocks or unlinear chain segment
          // if we try the same peer it'll just return same result so switching peer here
          badPeers.add(peer.toB58String());
        }
        peer = (await this.getPeers(Array.from(badPeers)))[0];
        slotRange = {start: this.rangeStart, end: this.rangeEnd};
        // result = await getBlockRange(this.logger, this.network.reqResp, peers, slotRange);
        // Work around of https://github.com/ChainSafe/lodestar/issues/1690

        result = await withTimeout(
          async () => getBlockRange(this.logger, this.network.reqResp, [peer], slotRange),
          3 * 60 * 1000, // 3 minutes
          this.signal
        );

        if (result) {
          // we queried from last fetched block
          result = result.filter(
            (signedBlock) =>
              !this.config.types.Root.equals(
                this.lastFetchCheckpoint.root,
                this.config.types.BeaconBlock.hashTreeRoot(signedBlock.message)
              )
          );
          // 0-1 block result should go through and we'll handle it in next round
          if (result.length > 1) assertLinearChainSegment(this.config, result);
        }
      } catch (e) {
        this.logger.verbose("Regular Sync: Failed to get block range ", {...(slotRange ?? {}), error: e.message});
        // sync is stopped for whatever reasons
        if (e instanceof ErrorAborted) return [];
        result = null;
      }
    }

    // success, ignore last block (there should be >= 2 blocks) since we can't validate parent-child
    result.splice(result.length - 1, 1);
    const lastBlock = result[result.length - 1].message;
    this.lastFetchCheckpoint = {root: this.config.types.BeaconBlock.hashTreeRoot(lastBlock), slot: lastBlock.slot};
    return result!;
  }

  // always set range based on last fetch block bc sometimes the previous fetch may not return all blocks
  private updateNextRange(): void {
    // this.lastFetchCheckpoint.slot + 1 maybe an orphaned block and peers will return empty range
    this.rangeStart = this.lastFetchCheckpoint.slot;
    this.rangeEnd = this.rangeStart;
    this.rangeEnd = this.getNewTarget();
  }

  /**
   * Since we query 1 additional block to check linear chain, a return of 0 or 1 block
   * should go to this handler.
   */
  private async handleEmptyRange(peer: PeerId, blocks: SignedBeaconBlock[] = []): Promise<void> {
    const range = {start: this.rangeStart, end: this.rangeEnd};
    const peerHeadSlot = this.network.peerMetadata.getStatus(peer)?.headSlot ?? 0;
    this.logger.verbose("Regular Sync: Not found enough blocks for range", {
      range,
      numBlocks: blocks.length,
    });
    if (range.end <= peerHeadSlot) {
      // range contains skipped slots, query for next range
      this.logger.verbose("Regular Sync: queried range is behind peer head, fetch next range", {
        ...range,
        peerHead: peerHeadSlot,
      });
      // don't trust empty range as it's rarely happen, peer may return it incorrectly most of the time
      // same range start, expand range end
      // slowly increase rangeEnd, using getNewTarget() may cause giant range very quickly
      this.rangeEnd += 1;
    } else {
      this.logger.verbose("Regular Sync: Queried range passed peer head, sleep then try again", {
        range,
        peerHead: peerHeadSlot,
      });
      // don't want to disturb our peer if we pass peer head
      await sleep(this.config.params.SECONDS_PER_SLOT * 1000);
    }
  }

  private getNewTarget(): Slot {
    const currentSlot = this.chain.clock.currentSlot;
    // due to exclusive endSlot in chunkify, we want `currentSlot + 1`
    // since we want to check linear chain, query 1 additional slot
    return Math.min(this.rangeEnd + this.opts.blockPerChunk + 1, currentSlot + 1);
  }
}
