import { findVisibility } from "./lib";
import { version } from "../package.json";

import { Command, Option } from "commander";

const program = new Command();

export type Options = {
  latitude: number;
  longitude: number;
  height: number;
  date: Date;
  cloudiness: number;
  precipitation: number;
  moon: number;
  json: boolean;
  ics: boolean;
};

program
  .name("mwr")
  .description("CLI find the next visibility window of the milky way")
  .version(version);

program
  .description("find next window")
  .addOption(new Option("-l, --latitude <float>", "latitude").argParser(parseFloat))
  .addOption(new Option("-L, --longitude <float>", "longitude").argParser(parseFloat))
  .addOption(new Option("-h, --height <int>", "height in meters").argParser(parseInt).default(0))
  .addOption(
    new Option("-d, --date <date>", "date to check")
      .argParser((v) => new Date(v))
      .default(new Date())
  )
  .addOption(
    new Option("-c, --cloudiness <int>", "maximum cloudiness to accept as visible")
      .argParser(parseInt)
      .default(30)
  )
  .addOption(
    new Option(
      "-p, --precipitation <int>",
      "maximum precipitation probability to accept as visible"
    )
      .argParser(parseInt)
      .default(30)
  )
  .addOption(
    new Option("-m, --moon <int>", "maximum moon illumination (in percent) to accept")
      .argParser(parseInt)
      .default(50)
  )
  .addOption(new Option("--json", "output data as json"))
  .addOption(new Option("--ics", "output data as ics, can be piped into a file"));

program.parse(process.argv);

const options = program.opts<Options>();

if (options.ics && options.json) {
  console.error("cannot format to json and ics at the same time");
  process.exit(1);
}

try {
  const result = await findVisibility(options);
  if (options.json) {
    console.log(result.toJson());
  } else if (options.ics) {
    console.log(result.toIcs());
  } else {
    console.log(result.toString());
  }
} catch (e: any) {
  console.error(e?.message);
  process.exit(1);
}
