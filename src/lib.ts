import { Astro } from "./Astro";
import { Observer } from "astronomy-engine";
import { DateRange } from "./DateRange";
import { Output } from "./Output";
import { Weather } from "./Weather";

export async function findVisibility(
  latitude: number,
  longitude: number,
  height: number,
  referenceDate: Date
) {
  const observer = new Observer(latitude, longitude, height);
  const startOfDay = new Date(referenceDate.setHours(0, 0, 0, 0));
  const startTomorrow = new Date(startOfDay);
  startTomorrow.setDate(startOfDay.getDate() + 1);

  const astro = new Astro(observer);
  const weather = new Weather(observer);

  const gc = astro.getGcVisibility(startOfDay);

  // write everything to a result object that can be formatted to json or whatever
  if (!gc) {
    throw new Error("not visible at all");
  }

  const sunToday = astro.getSunVisibility(startOfDay);
  const sunTomorrow = astro.getSunVisibility(startTomorrow);
  const rangesToCheck = [sunToday, sunTomorrow];

  const moon = astro.getMoonVisibility(startOfDay);
  const moonData = astro.getMoonData(startOfDay);

  // we can ignore moon in first and last quarter
  if (moonData.percentage > 50) {
    rangesToCheck.push(moon);
  }

  const effectiveVisibleRange = gc.subtract(...rangesToCheck.filter((i) => i !== null));

  if (effectiveVisibleRange.length === 0) {
    return new Output([], 0, startOfDay, moonData.moonPhaseText, moonData.percentage);
  }

  const elevation = astro.getGcElevation(effectiveVisibleRange[0]!.start);
  const weatherRelevantStart = effectiveVisibleRange.at(0)!.start;
  const weatherRelevantEnd = effectiveVisibleRange.at(-1)!.end;

  const weatherRanges = await weather.getWeatherRanges(
    new DateRange(weatherRelevantStart, weatherRelevantEnd)
  );

  return new Output(
    weatherRanges,
    elevation,
    startOfDay,
    moonData.moonPhaseText,
    moonData.percentage
  );
}
