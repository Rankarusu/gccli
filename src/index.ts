import { findVisibility } from "./lib";
import { version } from "../package.json";

import { Command, Option } from "commander";

const program = new Command();

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
  .addOption(new Option("--json", "output data as json"));

program.parse(process.argv);

const options = program.opts();

try {
  const result = await findVisibility(
    options.latitude,
    options.longitude,
    options.height,
    options.date
  );
  if (options.json) {
    console.log(result.toJson());
  } else {
    console.log(result.toString());
  }
} catch (e: any) {
  console.error(e?.message);
  process.exit(1);
}
