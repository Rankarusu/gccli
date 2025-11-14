# gccli - Galactic Center CLI

CLI to determine whether the galactic center is visible on a given day at given coordinates. Takes into account sun, moon, and weather.

Can output plain text, json and ICS formatted text.

Built with [Bun](https://github.com/oven-sh/bun), [Commander](https://github.com/tj/commander.js) and [Astronomy Engine](https://github.com/cosinekitty/astronomy)

## Usage

```sh
# basic usage
gccli --latitude 50.11 --longitude 8.68 

# get data for specific date and output as json
gccli -l 50.111234 -L 9.234 -h 200 -d 2024-11-14 --json 

# pipe into an ics file
gccli -l 50.111234 -L 9.234 --ics > file.ics 

# ignore moon and weather when calculating visibility
gccli -l 50.111234 -L 9.234 --cloudiness 100 --moon 100 --precipitation 100 
```

## Options

```txt
  -V, --version              output the version number
  -l, --latitude <float>     geographic latitude in degrees north of the Earth's equator. Between -90 to +90
  -L, --longitude <float>    geographic longitude in degrees east of the prime meridian. Between -180 to +180
  -h, --height <int>         observer's elevation above mean sea level in meters (default: 0)
  -d, --date <date>          date to check (default: today)
  -c, --cloudiness <int>     maximum cloudiness to accept as visible (default: 30)
  -p, --precipitation <int>  maximum precipitation probability to accept as visible (default: 30)
  -m, --moon <int>           maximum moon illumination (in percent) to accept (default: 50)
  --json                     output json
  --ics                      output ics, can be piped into a file
  --help                     display help for command
```

## Installation

### run via bun

1. clone the repo
2. use the `gccli` shell script

### as a binary

1. go to the github releases page
2. download the lated version for your system architecture
