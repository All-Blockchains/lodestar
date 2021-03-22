import {phase0} from "@chainsafe/lodestar-types";
import {IBeaconDb} from "../../../db";
import {GENESIS_SLOT} from "@chainsafe/lodestar-params";

export async function* onBeaconBlocksByRoot(
  requestBody: phase0.BeaconBlocksByRootRequest,
  db: IBeaconDb
): AsyncIterable<phase0.SignedBeaconBlock> {
  const getBlock = db.block.get.bind(db.block);
  const getFinalizedBlock = db.blockArchive.getByRoot.bind(db.blockArchive);
  for (const blockRoot of requestBody) {
    const root = blockRoot.valueOf() as Uint8Array;
    const block = (await getBlock(root, GENESIS_SLOT)) || (await getFinalizedBlock(root));
    if (block) {
      yield block;
    }
  }
}
