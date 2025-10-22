import {
  Body,
  DefineStar,
  Horizon,
  Illumination,
  MoonPhase,
  SearchAltitude,
  SearchRiseSet,
  type Observer,
} from "astronomy-engine";
import { DateRange } from "./DateRange";

const GC_RA = 17 + 45 / 60 + 40.0409 / 3600;
const GC_DEC = -(29 + 0 / 60 + 28.118 / 3600);
const GC_DISTANCE = 26996;

DefineStar(Body.Star1, GC_RA, GC_DEC, GC_DISTANCE);

export class Astro {
  constructor(private readonly observer: Observer) {}

  public getGcVisibility(referenceDate: Date) {
    const gcRise = SearchRiseSet(Body.Star1, this.observer, 1, referenceDate, 1);
    if (!gcRise) {
      return null;
    }

    const gcSet = SearchRiseSet(Body.Star1, this.observer, -1, gcRise, 1, 0);
    if (!gcSet) {
      return null;
    }

    return new DateRange(gcRise.date, gcSet.date);
  }

  public getGcElevation(referenceDate: Date) {
    const hor = Horizon(referenceDate, this.observer, GC_RA, GC_DEC, "normal");
    return hor.altitude;
  }

  public getSunVisibility(referenceDate: Date) {
    const nauticalTwilightEnd = SearchAltitude(Body.Sun, this.observer, 1, referenceDate, 1, -12);

    if (!nauticalTwilightEnd) {
      return null;
    }

    const astronomicalTwilightEnd = SearchAltitude(
      Body.Sun,
      this.observer,
      -1,
      nauticalTwilightEnd,
      1,
      -18
    );
    if (!astronomicalTwilightEnd) {
      return null;
    }

    return new DateRange(nauticalTwilightEnd.date, astronomicalTwilightEnd.date);
  }

  public getMoonVisibility(referenceDate: Date) {
    const moonRise = SearchRiseSet(Body.Moon, this.observer, 1, referenceDate, 1);
    if (!moonRise) {
      return null;
    }

    const moonSet = SearchRiseSet(Body.Moon, this.observer, -1, moonRise, 1);

    return moonSet ? new DateRange(moonRise.date, moonSet.date) : null;
  }

  public getMoonData(referenceDate: Date) {
    const moonPhase = MoonPhase(referenceDate);
    const moonPhaseText = this.getMoonPhaseText(moonPhase);

    const moonRise = SearchRiseSet(Body.Moon, this.observer, 1, referenceDate, 1);
    const { phase_fraction } = Illumination(Body.Moon, moonRise ?? referenceDate);
    const percentage = phase_fraction * 100;
    return {
      moonPhase,
      moonPhaseText,
      percentage,
    };
  }

  private getMoonPhaseText(degrees: number) {
    if (degrees === 0) {
      return "New Moon";
    }
    if (degrees > 0 && degrees < 90) {
      return "Waxing Crescent";
    }
    if (degrees === 90) {
      return "First Quarter";
    }
    if (degrees > 90 && degrees < 180) {
      return "Waxing Gibbous";
    }
    if (degrees === 180) {
      return "Full Moon";
    }
    if (degrees > 180 && degrees < 270) {
      return "Waning Gibbous";
    }
    if (degrees === 270) {
      return "Third Quarter";
    }

    return "Waning Crescent";
  }
}
