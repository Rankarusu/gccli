import { findVisibility } from "./lib";
import { version } from "../package.json";

import { Command, InvalidArgumentError, Option } from "commander";

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
  .name("gccli")
  .description("CLI to determine whether the galactic center is visible on a given day at given coordinates. Takes into account sun, moon, and weather")
  .version(version)
  .usage("--latitude <float> --longitude <float>")
  .addHelpText('after',`
Examples:

  $ ${program.name()} --latitude 50.11 --longitude 8.68 # basic usage
  $ ${program.name()} -l 50.111234 -L 9.234 -h 200 -d 2024-11-14 --json # get data for specific date and output as json
  $ ${program.name()} -l 50.111234 -L 9.234 --ics > file.ics # pipe into an ics file
  $ ${program.name()} -l 50.111234 -L 9.234 --cloudiness 100 --moon 100 --precipitation 100 # ignore moon and weather when calculating visibility`
)
  .addOption(
    new Option(
      "-l, --latitude <float>",
      "geographic latitude in degrees north of the Earth's equator. Between -90 to +90"
    )
      .argParser((value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue < -90 || parsedValue > 90) {
          throw new InvalidArgumentError("Invalid latitude. Must be float between -90 and 90");
        }
        return parsedValue;
      })
      .makeOptionMandatory()
  )
  .addOption(
    new Option(
      "-L, --longitude <float>",
      "geographic longitude in degrees east of the prime meridian. Between -180 to +180"
    )
      .argParser((value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue < -180 || parsedValue > 180) {
          throw new InvalidArgumentError("Invalid longitude. Must be float between -180 and 180");
        }
        return parsedValue;
      })
      .makeOptionMandatory()
  )
  .addOption(
    new Option("-h, --height <int>", "observer's elevation above mean sea level in meters")
      .argParser(parseInt)
      .default(0)
  )
  .addOption(
    new Option("-d, --date <date>", "date to check")
      .argParser((v) => new Date(v))
      .default(new Date(), "today")
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
  .addOption(new Option("--json", "output json").conflicts("ics"))
  .addOption(new Option("--ics", "output ics, can be piped into a file").conflicts("json"));

program.parse(process.argv);

const options = program.opts<Options>();

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
