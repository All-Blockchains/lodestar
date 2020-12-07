import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import axios from "axios";
import tar from "tar";
import stream from "stream";
import {promisify} from "util";

const BASE_URL = "https://github.com/ethereum/eth2.0-spec-tests/releases/download";

export type TestToDownload = "general" | "mainnet" | "minimal";
export const defaultTestsToDownload: TestToDownload[] = ["general", "mainnet", "minimal"];

export interface IDownloadTestsOptions {
  specVersion: string;
  outputDir: string;
  testsToDownload?: TestToDownload[];
}

export async function downloadTests(
  {specVersion, outputDir, testsToDownload = defaultTestsToDownload}: IDownloadTestsOptions,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  log: (msg: string) => void = () => {}
): Promise<void> {
  log(`outputDir = ${outputDir}`);

  // Use version.txt as a flag to prevent re-downloading the tests
  const versionFile = path.join(outputDir, "version.txt");
  const existingVersion = fs.existsSync(versionFile) && fs.readFileSync(versionFile, "utf8").trim();

  if (existingVersion && existingVersion === specVersion) {
    return log(`version ${specVersion} already downloaded`);
  }

  if (fs.existsSync(outputDir)) {
    log(`Cleaning ${outputDir}`);
    rimraf.sync(outputDir);
  }

  fs.mkdirSync(outputDir, {recursive: true});

  await Promise.all(
    testsToDownload.map(async (test) => {
      const url = `${BASE_URL}/${specVersion}/${test}.tar.gz`;

      // download tar
      const {data, headers} = await axios({
        method: "get",
        url,
        responseType: "stream",
      });

      const totalSize = headers["content-length"];
      log(`Downloading ${url} - ${totalSize} bytes`);

      // extract tar into output directory
      await promisify(stream.pipeline)(data, tar.x({cwd: outputDir}));

      log(`Downloaded  ${url}`);
    })
  );

  fs.writeFileSync(versionFile, specVersion);
}
