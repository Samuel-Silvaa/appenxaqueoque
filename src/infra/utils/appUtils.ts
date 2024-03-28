import {
  Acuteness,
  ImprovementFactor,
  Location,
  PainType,
  Symptom,
  Time,
  Trigger,
} from '../@types/app.types';

export const pinColor = (acuteness: string | number): string => {
  switch (acuteness) {
    case Acuteness.LIGHT:
    case 0:
      return '#C8F7E1';
    case Acuteness.MILD:
    case 1:
      return '#FFCBA6';
    case 2:
    case Acuteness.SEVERE:
      return '#FFCACD';
    default:
      return '#9194E9';
  }
};

export const parseAcuteness = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return Acuteness.LIGHT;
    case 1:
      return Acuteness.MILD;
    default:
      return Acuteness.SEVERE;
  }
};

export const parseTime = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return Time.MORNING;
    case 1:
      return Time.EVENING;
    case 2:
      return Time.NIGHT;
    default:
      Time.MIDNIGHT;
  }
};

export const parseImprovementFactor = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return ImprovementFactor.MEDICINE;
    case 1:
      return ImprovementFactor.SLEEP;
    default:
      return ImprovementFactor.FOOD;
  }
};

export const parseSymptoms = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return Symptom.HALO;
    case 1:
      return Symptom.PHOTOSENSIBILITY;
    case 2:
      return Symptom.HYPERACUSIS;
    case 3:
      return Symptom.NAUSEA;
    case 4:
      return Symptom.SICKNESS;
    default:
      return Symptom.VOMIT;
  }
};

export const parseLocation = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return Location.LEFT;
    case 1:
      return Location.RIGHT;
    case 2:
      return Location.BOTH;
    default:
      return Location.BACKSIDE;
  }
};

export const parsePainType = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return PainType.THROB;
    default:
      return PainType.TIGHT;
  }
};

export const parseTriggers = (acuteness: number) => {
  switch (acuteness) {
    case 0:
      return Trigger.FOOD;
    case 1:
      return Trigger.JAGGEDSLEEP;
    default:
      return Trigger.EMOTIONAL;
  }
};
