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
     return Time.MIDNIGHT;
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
      return Symptom.PHOTOSENSIBILITY;
    case 1:
      return Symptom.NAUSEA;
    case 2:
      return Symptom.VOMIT;
    case 3:
      return Symptom.HYPERACUSIS;
    case 4:
    return Symptom.SICKNESS;
    default:
      return Symptom.DIZZINESS;
  }
};

export const parseLocation = (acuteness: number) => {
  switch (acuteness) {
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
      return split.filter(item => item && item.trim() !== 'null' && item.trim() !== 'undefined');
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

