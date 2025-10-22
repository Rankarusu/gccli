export class DateRange {
  constructor(public readonly start: Date, public readonly end: Date) {
    if (end.getTime() <= start.getTime()) {
      throw new Error("End must be larger than start");
    }
  }

  private subtractSingle(dateRange: DateRange) {
    // completely outside
    if (
      dateRange.end.getTime() <= this.start.getTime() ||
      dateRange.start.getTime() >= this.end.getTime()
    ) {
      return [this];
    }

    // intersects left
    if (
      dateRange.start.getTime() < this.start.getTime() &&
      dateRange.end.getTime() <= this.end.getTime()
    ) {
      return [new DateRange(dateRange.end, this.end)];
    }

    // intersects right
    if (
      dateRange.start.getTime() > this.start.getTime() &&
      dateRange.end.getTime() >= this.end.getTime()
    ) {
      return [new DateRange(this.start, dateRange.start)];
    }

    // larger on both sides
    if (
      dateRange.start.getTime() <= this.start.getTime() &&
      dateRange.end.getTime() >= this.end.getTime()
    ) {
      return [];
    }

    // is contained
    if (
      dateRange.start.getTime() >= this.start.getTime() &&
      dateRange.end.getTime() <= this.end.getTime()
    ) {
      return [new DateRange(this.start, dateRange.start), new DateRange(dateRange.end, this.end)];
    }

    return [];
  }

  public subtract(...dateRanges: DateRange[]) {
    return dateRanges.reduce(
      (acc: DateRange[], cur) => {
        return acc.flatMap((i) => i.subtractSingle(cur));
      },
      [this]
    );
  }

  public toJson() {
    return {
      start: this.start,
      end: this.end,
    };
  }
}
