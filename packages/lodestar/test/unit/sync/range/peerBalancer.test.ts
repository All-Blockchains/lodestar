import {expect} from "chai";
import PeerId from "peer-id";
import {config} from "@chainsafe/lodestar-config/minimal";
import {LogLevel, WinstonLogger} from "@chainsafe/lodestar-utils";
import {silentLogger} from "../../../utils/logger";
import {Batch, BatchOpts} from "../../../../src/sync/range/batch";
import {ChainPeersBalancer} from "../../../../src/sync/range/utils/peerBalancer";

const debugMode = process.env.DEBUG;

describe("sync / range / peerBalancer", () => {
  const opts: BatchOpts = {epochsPerBatch: 1};
  const logger = debugMode ? new WinstonLogger({level: LogLevel.verbose, module: "SYNC"}) : silentLogger;
  const error = Error("TEST_ERROR");

  it("bestPeerToRetryBatch", () => {
    // Run N times to make sure results are consistent with different shufflings
    for (let i = 0; i < 5; i++) {
      const peer1 = new PeerId(Buffer.from([0])); // Offset by one, PeerId encodes to B58String 0 as "1"
      const peer2 = new PeerId(Buffer.from([1]));
      const peer3 = new PeerId(Buffer.from([2]));
      const batch0 = new Batch(0, config, logger, opts);
      const batch1 = new Batch(1, config, logger, opts);

      // Batch zero has a failedDownloadAttempt with peer0
      batch0.startDownloading(peer1);
      batch0.downloadingError(error);

      // peer2 is busy downloading batch1
      batch1.startDownloading(peer2);

      const peerBalancer = new ChainPeersBalancer([peer1, peer2, peer3], [batch0, batch1]);

      expect(peerBalancer.bestPeerToRetryBatch(batch0)).to.equal(
        peer3,
        "peer1 has a failed attempt, and peer2 is busy, best peer to retry batch0 must be peer3"
      );

      batch0.startDownloading(peer3);
      batch0.downloadingError(error);
      expect(peerBalancer.bestPeerToRetryBatch(batch0)).to.equal(
        peer2,
        "If peer3 also has a failed attempt for batch0, peer2 must become the best"
      );
    }
  });

  it("idlePeers", () => {
    // Run N times to make sure results are consistent with different shufflings
    for (let i = 0; i < 5; i++) {
      const peer1 = new PeerId(Buffer.from([0]));
      const peer2 = new PeerId(Buffer.from([1]));
      const peer3 = new PeerId(Buffer.from([2]));
      const peer4 = new PeerId(Buffer.from([3]));
      const batch0 = new Batch(0, config, logger, opts);
      const batch1 = new Batch(1, config, logger, opts);

      // peer1 and peer2 are busy downloading
      batch0.startDownloading(peer1);
      batch1.startDownloading(peer2);

      const peerBalancer = new ChainPeersBalancer([peer1, peer2, peer3, peer4], [batch0, batch1]);

      const idlePeers = peerBalancer.idlePeers();

      const idlePeersIds = idlePeers.map((p) => p.toB58String()).sort();
      const expectedIds = [peer3, peer4].map((p) => p.toB58String()).sort();
      expect(idlePeersIds).to.deep.equal(expectedIds, "Wrong idlePeers (encoded as B58String)");
    }
  });
});
