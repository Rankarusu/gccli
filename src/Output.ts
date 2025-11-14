import { randomUUIDv7 } from "bun";
import { formatDate, formatDateTime, formatIcsDateTime, formatTime } from "./utils";
import type { WeatherRange } from "./Weather";

const ICS_TITLE = "Galactic Center is visible!";

export class Output {
  constructor(
    private readonly weatherRanges: WeatherRange[],
    private readonly elevation: number,
    private readonly referenceDate: Date,
    private readonly moonPhase: string,
    private readonly moonPercentage: number
  ) {}

  public toString(): string {
    return `Galactic Center Visibility - ${formatDate(this.referenceDate)} 
Elevation: ${this.elevation.toFixed(1)}º
Moon: ${this.moonPhase} (${this.moonPercentage.toFixed(1)}%)

From\tTo\tCloudiness\tPrecipitation
${this.weatherRanges.map(
  (r) =>
    `${formatTime(r.dateRange.start)}\t${formatTime(r.dateRange.end)}\t${
      r.cloudCover ?? "N/A"
    }%\t\t${r.precipitationProbability ?? "N/A"}%`
)}`;
  }

  public toIcs() {
    if (this.weatherRanges.length === 0) {
      throw new Error("Not visible, cannot generate ICS-file");
    }

    return `BEGIN:VCALENDAR
VERSION:2.0
${this.weatherRanges.map((r) => this.getDateRangeIcsRepresentation(r)).join("\n")}
END:VCALENDAR`;
  }

  private getDateRangeIcsRepresentation(dateRange: WeatherRange) {
    const now = new Date();
    return `BEGIN:VEVENT
DTSTAMP:${formatIcsDateTime(now)}
UID:${randomUUIDv7(undefined, now)}@gccli.de
DTSTART:${formatIcsDateTime(dateRange.dateRange.start)}
DTEND:${formatIcsDateTime(dateRange.dateRange.end)}
DESCRIPTION:${this.getIcsDescription(dateRange)}
SUMMARY:${ICS_TITLE}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:${ICS_TITLE}
TRIGGER:-PT15M
END:VALARM
END:VEVENT`;
  }

  private getIcsDescription(dateRange: WeatherRange) {
    return `Elevation: ${this.elevation.toFixed(1)}º\\nMoon: ${
      this.moonPhase
    } (${this.moonPercentage.toFixed(1)}%)\\nCloud Cover: ${
      dateRange.cloudCover ?? "N/A"
    }%\\nPrecipitation Probability: ${dateRange.precipitationProbability ?? "N/A"}%`;
  }

  public toJson(): string {
    return JSON.stringify({
      date: formatDate(this.referenceDate),
      visible: this.weatherRanges.length > 0,
      elevation: this.elevation,
      moon: {
        phase: this.moonPhase,
        percentage: this.moonPercentage,
      },
      ranges: this.weatherRanges.map((r) => ({
        from: formatDateTime(r.dateRange.start),
        to: formatDateTime(r.dateRange.end),
        cloudCover: r.cloudCover,
        precipitationProbability: r.precipitationProbability,
      })),
    });
  }
}
