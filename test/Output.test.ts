import { describe, expect, test } from "bun:test";
import { DateRange } from "../src/DateRange";
import { Output } from "../src/Output";

describe("Output", () => {
  const valid = new Output(
    [
      {
        dateRange: new DateRange(new Date("2025-10-10T20:15"), new Date("2025-10-10T21:00")),
        precipitationProbability: 23,
        cloudCover: 9,
      },
    ],
    9,
    new Date("2025-10-10"),
    "Full Moon",
    100
  );

  const undefinedWeather = new Output(
    [
      {
        dateRange: new DateRange(new Date("2025-10-10T20:15"), new Date("2025-10-10T21:00")),
        precipitationProbability: undefined,
        cloudCover: undefined,
      },
    ],
    9,
    new Date("2025-10-10"),
    "Full Moon",
    100
  );

  const multipleLines = new Output(
    [
      {
        dateRange: new DateRange(new Date(1000), new Date(2000)),
        precipitationProbability: 0,
        cloudCover: 0,
      },
      {
        dateRange: new DateRange(new Date(3000), new Date(4000)),
        precipitationProbability: 0,
        cloudCover: 0,
      },
    ],
    0,
    new Date(),
    "",
    0
  );

  describe("toString", () => {
    test("should render multiple lines when passed multiple ranges", () => {
      const result = multipleLines.toString();
      console.log(result);
      expect(result).toIncludeRepeated("\n", 6);
    });

    test("should render undefined values as N/A", () => {
      const result = undefinedWeather.toString();
      expect(result).toIncludeRepeated("N/A", 2);
    });
  });

  describe("toICS", () => {
    test("should throw an error when gc is not visible", () => {
      const output = new Output([], 0, new Date(), "", 0);

      expect(() => output.toIcs()).toThrow("Not visible, cannot generate ICS-file");
    });

    test("should render undefined values as N/A", () => {
      const result = undefinedWeather.toIcs();
      expect(result).toIncludeRepeated("N/A", 2);
    });

    test("should render multiple VEVENT blocks when multiple ranges are passed", () => {
      const result = multipleLines.toIcs();

      expect(result).toIncludeRepeated("BEGIN:VCALENDAR", 1);
      expect(result).toIncludeRepeated("END:VCALENDAR", 1);
      expect(result).toIncludeRepeated("BEGIN:VEVENT", 2);
      expect(result).toIncludeRepeated("END:VEVENT", 2);
    });
  });

  describe("toJson", () => {
    test.each([valid, multipleLines, undefinedWeather])("should return valid json", (output) => {
      const result = output.toJson();

      expect(() => JSON.parse(result)).not.toThrow(SyntaxError);
    });
  });
});
