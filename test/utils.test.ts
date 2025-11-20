import { describe, expect, test } from "bun:test";
import { formatDate, formatDateTime, formatIcsDate, formatIcsDateTime, formatIcsTime, formatTime } from "../src/utils";

describe("utils", () => {
  const dateRaw = "2020-04-01T20:15";
  const expectedTime = "20:15";
  const expectedDate = "2020-04-01";

  const expectedIcsDateTime = "20200401T201500Z";
  const expectedIcsDate = "20200401";
  const expectedIcsTime = "201500";

  describe("formatDateTime", () => {
    test("should format DateTime correctly", () => {
      const date = new Date(dateRaw);
      const result = formatDateTime(date);

      expect(result).toIncludeRepeated("T", 1);
      expect(result).toBe(dateRaw);
    });
  });

  describe("formatTime", () => {
    test("should format time correctly", () => {
      const date = new Date(dateRaw);
      const result = formatTime(date);

      expect(result).toBe(expectedTime);
    });
  });

  describe("formatDate", () => {
    test("should format date correctly", () => {
      const dateRaw = "2020-04-01";
      const date = new Date(dateRaw);
      const result = formatDate(date);

      expect(result).toBe(expectedDate);
    });
  });

  describe("formatIcsDateTime", () => {
    test("should format DateTime correctly", () => {
      const date = new Date(dateRaw);
      const result = formatIcsDateTime(date);

      expect(result).toIncludeRepeated("T", 1);
      expect(result).toEndWith("Z");
      expect(result).toBe(expectedIcsDateTime);
    });
  });

  describe("formatIcsTime", () => {
    test("should format time correctly", () => {
      const date = new Date(dateRaw);
      const result = formatIcsTime(date);

      expect(result).toBe(expectedIcsTime);
    });
  });

  describe("formatIcsDate", () => {
    test("should format date correctly", () => {
      const date = new Date(dateRaw);
      const result = formatIcsDate(date);

      expect(result).toBe(expectedIcsDate);
    });
  });
});
