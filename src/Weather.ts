import type { Observer } from "astronomy-engine";
import { DateRange } from "./DateRange";
import { formatDateTime } from "./utils";

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_OPTIONS = ["cloud_cover", "precipitation_probability"] as const;

export class Weather {
  constructor(private readonly observer: Observer) {}

  private async fetchWeather(dateRange: DateRange) {
    const query = new URLSearchParams({
      latitude: this.observer.latitude.toString(),
      longitude: this.observer.longitude.toString(),
      hourly: OPEN_METEO_OPTIONS.join(","),
      timezone: TZ,
      start_hour: formatDateTime(dateRange.start),
      end_hour: formatDateTime(dateRange.end),
    });

    try {
      const response = await fetch(`${OPEN_METEO_URL}?${query.toString()}`);
      if (!response.ok) {
        return undefined;
      }
      const data = (await response.json()) as OpenMeteoForecast;
      return data;
    } catch (error: any) {
      return undefined;
    }
  }

  public async getWeatherRanges(dateRange: DateRange, cloudinessThreshold: number, precipitationThreshold: number) {
    const forecast = await this.fetchWeather(dateRange);
    // no weather info available -> display as N/A
    if (forecast === undefined) {
      return [{
        dateRange,
        cloudCover: undefined,
        precipitationProbability: undefined,
      } as WeatherRange]
    }

    const result: WeatherRange[] = [];
    const currentRange = [];

    for (let i = 0; i < forecast.hourly.time.length; i++) {
      const time = new Date(forecast.hourly.time[i]!);
      if (time.getTime() > dateRange.end.getTime()) {
        // open meteo sends data in hourly intervals. if our interval is less than an hour, we get data outside of our range
        continue;
      }

      // these can be undefined or null
      const precipitationProbability = forecast.hourly.precipitation_probability?.[i] ?? undefined;
      const cloudCover = forecast.hourly.cloud_cover?.[i] ?? undefined;

      // we should be fine to add undefined values here. display as n/a
      if (
        cloudCover === undefined ||
        precipitationProbability === undefined ||
        (cloudCover < cloudinessThreshold && precipitationProbability < precipitationThreshold)
      ) {
        currentRange.push({
          time: time,
          precipitationProbability,
          cloudCover,
        });
      } else {
        const combinedRange = this.createCombinedWeatherRange(currentRange, time);
        if (combinedRange !== undefined) {
          result.push(combinedRange);
        }
        currentRange.length = 0;
      }
    }
    const combinedRange = this.createCombinedWeatherRange(currentRange, dateRange.end);
    if (combinedRange !== undefined) {
      result.push(combinedRange);
    }

    return result;
  }

  private createCombinedWeatherRange(currentRange: WeatherNode[], endTime: Date) {
    if (currentRange.length > 0) {
      const sums = currentRange.reduce(
        (acc, cur) => {
          acc.cloudCover += cur.cloudCover ?? 0;
          acc.precipitationProbability += cur.precipitationProbability ?? 0;
          return acc;
        },
        {
          cloudCover: 0,
          precipitationProbability: 0,
        }
      );

      return {
        dateRange: new DateRange(currentRange[0]!.time, endTime),
        cloudCover: sums.cloudCover / currentRange.length,
        precipitationProbability: sums.precipitationProbability / currentRange.length,
      } as WeatherRange;
    }
  }
}

type OpenMeteoOptions = (typeof OPEN_METEO_OPTIONS)[number];
type OpenMeteoForecast = {
  hourly_units: Record<OpenMeteoOptions, string>;
  hourly: Record<OpenMeteoOptions, number[]> & { time: string[] };
};

type WeatherNode = {
  time: Date;
  cloudCover: number | undefined;
  precipitationProbability: number | undefined;
};
export type WeatherRange = {
  dateRange: DateRange;
  cloudCover: number | undefined;
  precipitationProbability: number | undefined;
};
