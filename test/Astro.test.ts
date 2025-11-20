import { Observer } from "astronomy-engine";
import { describe, expect, test } from "bun:test";
import { Astro } from "../src/Astro";

describe("Astro", () => {
  const dates = [
    { date: new Date("2025-11-20T06:47:57"), percentage: 0 },
    { date: new Date("2025-11-05"), percentage: 100 }, // new moon //full moon
  ];

  describe("getMoonData", () => {
    test.each(dates)("should return correct percentage", ({ date, percentage }) => {
      const observer = new Observer(50.11, 8.26, 0); // Frankfurt
      const astro = new Astro(observer);
      const result = astro.getMoonData(date);

      expect(result.moonPhase).toBeGreaterThan(0);
      expect(result.moonPhase).toBeLessThanOrEqual(360);
      expect(result.percentage).toBeLessThanOrEqual(100);
      expect(result.percentage).toBeGreaterThanOrEqual(0);

      expect(Math.round(result.percentage)).toBe(percentage);
    });
  });
});
