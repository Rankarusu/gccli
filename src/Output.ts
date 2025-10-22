import { formatDate, formatDateTime, formatTime } from "./utils";
import type { WeatherRange } from "./Weather";

export class Output {
  constructor(
    private readonly weatherRanges: WeatherRange[],
    private readonly elevation: number,
    private readonly referenceDate: Date,
    private readonly moonPhase: string,
    private readonly moonPercentage: number
  ) {}

  public toString(): string {
    return `
Galactic Center Visibility - ${formatDate(this.referenceDate)} 
Elevation: ${this.elevation.toFixed(1)}º
Moon: ${this.moonPhase} (${this.moonPercentage.toFixed(1)}%)

From\tTo\tCloudiness\tPrecipitation
${this.weatherRanges.map(
  (r) =>
    `${formatTime(r.dateRange.start)}\t${formatTime(r.dateRange.end)}\t${
      r.cloudCover ?? "N/A"
    }%\t\t${r.precipitationProbability ?? "N/A"}%`
)}
    `;
  }

  public toIcs() {
    // implement this
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
