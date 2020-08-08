import {ICliCommand, ICliCommandOptions} from "../../util";
import {IGlobalArgs} from "../../options";
import {beaconOptions, IBeaconOptions} from "./options";
import {run} from "./run";

export const beacon: ICliCommand<IBeaconOptions, IGlobalArgs> = {
  command: "beacon",
  describe: "Run a beacon node",
  options: beaconOptions as ICliCommandOptions<IBeaconOptions>,
  handler: run
};
