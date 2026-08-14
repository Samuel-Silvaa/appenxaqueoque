import { de } from 'date-fns/locale';
import {
  Acuteness,
  ImpairFactor,
  ImprovementFactor,
  Location,
  PainType,
  Report,
  Symptom,
  Time,
  Trigger,
} from '../@types/app.types';
import { random } from 'lodash';

export const pinColor = (
  acuteness: string | number,
  randomize = false
): string => {
  switch (acuteness) {
    case Acuteness.LIGHT:
    case 0:
      return '#C8F7E1';
    case Acuteness.MILD:
    case 1:
      return '#FFCBA6';
    case 2:
    case Acuteness.SEVERE:
      return '#FFB0B5';
    default:
      return randomize ? pinColor(random(2)) : '#9194E9';
  }
};

export const getMostFrequentReportOptionLabel = (
  report: Report,
  category: string,
): string | undefined =>
  report.optionStats
    ?.filter((stat) => stat.category === category)
    .sort(
      (left, right) =>
        right.count - left.count || left.sortOrder - right.sortOrder,
    )[0]?.optionLabel;

export const episodePinColors = (acuteness: string | number): string => {
  switch (acuteness) {
    case 0:
      return '#FFEFDC';
    case 1:
      return '#EFE6FD';
    case 2:
      return '#FFCACD';
    case 3:
      return '#F2D4C4';
    case 4:
      return '#DCF3FF';
    case 5:
      return '#FFDCF1';
    case 6:
      return '#D7F6E7';
    case 7:
      return '#FFB0B5';
    case 8:
      return '#FFE3CA';
    case 9:
      return '#FFD6D9';
    case 10:
      return '#F6DCCF';
    case 11:
      return '#F6DCCF';
    case 12:
      return '#DDF8EC';
    case 13:
      return '#FFE9D5';
    default:
      return '#9194E9';
  }
};

export const parseAcuteness = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return Acuteness.LIGHT;
    case 1:
      return Acuteness.MILD;
    case 2:
      return Acuteness.SEVERE;
    default:
      return Acuteness.NONE;
  }
};

export const parseTime = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return Time.MORNING;
    case 1:
      return Time.EVENING;
    case 2:
      return Time.NIGHT;
    case 3:
      return Time.MIDNIGHT;
    default:
      return Time.NONE;
  }
};

export const parseImprovementFactor = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return ImprovementFactor.MEDICINE;
    case 1:
      return ImprovementFactor.SLEEP;
    case 2:
      return ImprovementFactor.FOOD;
    case 3:
      return ImprovementFactor.ANOTHER;
    default:
      return ImprovementFactor.NONE;
  }
};

export const parseImpairFactor = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return ImpairFactor.JUMP;
    case 1:
      return ImpairFactor.CROUCH;
    case 2:
      return ImpairFactor.ANOTHER;
    default:
      return ImpairFactor.NONE;
  }
};

export const parseSymptoms = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return Symptom.PHOTOSENSIBILITY;
    case 1:
      return Symptom.NAUSEA;
    case 2:
      return Symptom.VOMIT;
    case 3:
      return Symptom.SICKNESS;
    case 4:
      return Symptom.HYPERACUSIS;
    case 5:
      return Symptom.DIZZINESS;
    default:
      return Symptom.NONE;
  }
};

export const parseLocation = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return Location.FRONTALRIGHT;
    case 1:
      return Location.FRONTALLEFT;
    case 2:
      return Location.FRONTALBILATERAL;
    case 3:
      return Location.PARIETALRIGHT;
    case 4:
      return Location.PARIETALLEFT;
    case 5:
      return Location.PARIETALBILATERAL;
    case 6:
      return Location.TEMPLERIGHT;
    case 7:
      return Location.TEMPLELEFT;
    case 8:
      return Location.TEMPLEBILATERAL;
    case 9:
      return Location.BACKSIDE;
    case 10:
      return Location.OCCIPITALRIGHT;
    case 11:
      return Location.OCCIPITALLEFT;
    case 12:
      return Location.OCCIPITALBILATERAL;
    default:
      return Location.NONE;
  }
};

export const parsePainType = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return PainType.THROB;
    case 1:
      return PainType.TIGHT;
    case 2:
      return PainType.ANOTHER;
    default:
      return PainType.NONE;
  }
};

export const parseTriggers = (acuteness: number | string) => {
  switch (Number(acuteness)) {
    case 0:
      return Trigger.JAGGEDSLEEP;
    case 1:
      return Trigger.EMOTIONAL;
    case 2:
      return Trigger.VISUALEFFORT;
    case 3:
      return Trigger.FASTING;
    case 4:
      return Trigger.FOOD;
    default:
      return Trigger.NONE;
  }
};

export const parseArrayField = (field: any): string[] => {
  if (!field || field === null || field === undefined) {
    return [];
  }

  try {
    // Try to parse as JSON first
    if (typeof field === 'string' && field.startsWith('[')) {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    }

    // Fallback to string split for backward compatibility
    if (typeof field === 'string') {
      const split = field.split(',');
      return split.filter(
        (item) => item && item.trim() !== 'null' && item.trim() !== 'undefined'
      );
    }

    // If it's already an array, return it
    if (Array.isArray(field)) {
      return field;
    }

    return [];
  } catch (error) {
    console.warn('Error parsing array field:', error);
    return [];
  }
};
