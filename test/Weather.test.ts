import { Observer } from "astronomy-engine";
import { beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { DateRange } from "../src/DateRange";
import { Weather } from "../src/Weather";

describe("Weather", () => {
  const observer = new Observer(35.689722, 139.692222, 0); // Tokyo
  const dateRange = new DateRange(new Date("2025-10-10T20:15"), new Date("2025-10-10T22:00"));

  const validMockResponse = {
    hourly: {
      time: ["2025-10-10T20:15", "2025-10-10T21:15", "2025-10-10T22:15"],
      cloud_cover: [5, 10, 15],
      precipitation_probability: [10, 20, 30],
    },
  };

  beforeEach(() => mock.clearAllMocks());

  describe("getWeatherRanges", () => {
    test("should return weather ranges with undefined weather info on not ok response", async () => {
      spyOn(global, "fetch").mockResolvedValueOnce({ ok: false } as unknown as Response);

      const weather = new Weather(observer);
      const result = await weather.getWeatherRanges(dateRange, 100, 100);

      expect(result).toHaveLength(1);
      expect(result[0]?.dateRange).toEqual(dateRange);
      expect(result[0]?.precipitationProbability).toBeUndefined();
      expect(result[0]?.cloudCover).toBeUndefined();
    });
  });

  test("should return weather ranges with undefined weather info when fetch errors", async () => {
    spyOn(global, "fetch").mockRejectedValueOnce(false);

    const weather = new Weather(observer);
    const result = await weather.getWeatherRanges(dateRange, 100, 100);

    expect(result).toHaveLength(1);
    expect(result[0]?.dateRange).toEqual(dateRange);
    expect(result[0]?.precipitationProbability).toBeUndefined();
    expect(result[0]?.cloudCover).toBeUndefined();
  });

  test("should correctly calculate weather values", async () => {
    spyOn(global, "fetch").mockResolvedValueOnce(Response.json(validMockResponse));

    const weather = new Weather(observer);
    const result = await weather.getWeatherRanges(dateRange, 100, 100);

    expect(result).toHaveLength(1);
    expect(result[0]?.dateRange).toEqual(dateRange);
    // last item gets cut off
    expect(result[0]?.precipitationProbability).toBe(15);
    expect(result[0]?.cloudCover).toBe(7.5);
  });

  test("should correctly handle undefined api data", async () => {
    const response = {
      hourly: {
        time: ["2025-10-10T20:15", "2025-10-10T21:15", "2025-10-10T22:15"],
        cloud_cover: [5, null, 15],
        precipitation_probability: [10],
      },
    };
    spyOn(global, "fetch").mockResolvedValueOnce(Response.json(response));

    const weather = new Weather(observer);
    const result = await weather.getWeatherRanges(dateRange, 100, 100);

    expect(result).toHaveLength(1);
    expect(result[0]?.dateRange).toEqual(dateRange);
    // ignores null and empty values
    expect(result[0]?.precipitationProbability).toBe(10);
    expect(result[0]?.cloudCover).toBe(5);
  });
});
