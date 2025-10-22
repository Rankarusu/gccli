import { describe, expect, test } from "bun:test";
import { DateRange } from "./DateRange";

describe(() => {
  const cases = [
    [1000, 999],
    [1000, 1000],
  ];

  test.each(cases)("should throw for invalid range", (a, b) => {
    expect(() => new DateRange(new Date(a), new Date(b))).toThrow("End must be larger than start");
  });

  const cases0 = [
    [0, 999],
    [0, 1000],
    [2001, 3000],
    [2000, 3000],
  ];
  test.each(cases0)("should return same range on no intersection", (start, end) => {
    const a = new DateRange(new Date(1000), new Date(2000));
    const b = new DateRange(new Date(start), new Date(end));

    const result = a.subtract(b);

    expect(result).toBeArrayOfSize(1);
    expect(result[0]).toBe(a);
  });

  test("should return correct value if intersect left", () => {
    const a = new DateRange(new Date(1000), new Date(2000));
    const b = new DateRange(new Date(0), new Date(1100));

    const result = a.subtract(b);

    expect(result).toBeArrayOfSize(1);
    expect(result[0]?.start.getTime()).toBe(1100);
    expect(result[0]?.end.getTime()).toBe(2000);
  });

  test("should return correct value if intersect right", () => {
    const a = new DateRange(new Date(1000), new Date(2000));
    const b = new DateRange(new Date(1900), new Date(3000));

    const result = a.subtract(b);

    expect(result).toBeArrayOfSize(1);
    expect(result[0]?.start.getTime()).toBe(1000);
    expect(result[0]?.end.getTime()).toBe(1900);
  });

  const cases1 = [
    [1000, 2000],
    [0, 4000],
  ];
  test.each(cases1)("should return empty array if overlapped completely", (start, end) => {
    const a = new DateRange(new Date(1000), new Date(2000));
    const b = new DateRange(new Date(start), new Date(end));

    const result = a.subtract(b);

    expect(result).toBeArrayOfSize(0);
  });

  const cases2 = [
    [1500, 1600],
    [1001, 1999],
  ];
  test.each(cases2)("should return split range if contained", (start, end) => {
    const a = new DateRange(new Date(1000), new Date(2000));
    const b = new DateRange(new Date(start), new Date(end));

    const result = a.subtract(b);

    expect(result).toBeArrayOfSize(2);
    expect(result[0]?.start.getTime()).toBe(1000);
    expect(result[0]?.end.getTime()).toBe(start);
    expect(result[1]?.start.getTime()).toBe(end);
    expect(result[1]?.end.getTime()).toBe(2000);
  });
  
  test("should split properly with multiple inputs", () => {
    const a = new DateRange(new Date(1000), new Date(2000));
    const b = new DateRange(new Date(900), new Date(1100));

    const c = new DateRange(new Date(1200), new Date(1300));
    const d = new DateRange(new Date(1700), new Date(1800))

    const result = a.subtract(...[b,c,d]);

    expect(result).toBeArrayOfSize(3);
    expect(result[0]?.start.getTime()).toBe(1100);
    expect(result[0]?.end.getTime()).toBe(1200);
    expect(result[1]?.start.getTime()).toBe(1300);
    expect(result[1]?.end.getTime()).toBe(1700);
    expect(result[2]?.start.getTime()).toBe(1800);
    expect(result[2]?.end.getTime()).toBe(2000);
  });
});
