export interface Patient {
  id?: string;
  name: string;
  birthDate: string;
  email: string;
  gender: string;
  kinship: string;
  height: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id?: string;
  dateTime?: string;
  dates?: object | any;
  time: string;
  location: string;
  acuteness: string;
  painType: string;
  symptoms: string;
  triggers: string;
  foodImprovement: string;
  foodImpair: string;
  improvementFactor: string;
  medicine: string;
  medicineDosage: number;
  medicineImprovement: string;
  period: string;
  periodNotes: string;
  notes: string;
}

export interface AppContextDefaultValues {
  dispatch: (
    action: any,
    payload?: any,
    assetId?: string
  ) => Promise<any> | void;
  steps: number;
  currentStep: number;
  validateStepForward: (step: number) => boolean;
  validateAutomaticEpisodeStepNavigation: () => boolean;
  handleFormChange: (payload: object) => void;
  submitEpisode: () => void;
  episodeFormState: Episode;
  episodes?: Episode[];
  patient?: Patient;
  pageTitle?: string;
  setPageTitle?: (value: string) => void;
}

export enum Location {
  LEFT = 'Esquerdo',
  RIGHT = 'Direito',
  BOTH = 'Ambos os lados',
  BACKSIDE = 'Parte de trás',
}

export enum Acuteness {
  LIGHT = 'Leve',
  MILD = 'Moderada',
  SEVERE = 'Forte',
}

export enum PainType {
  THROB = 'Pulsátil',
  TIGHT = 'Aperto',
}

export enum Symptom {
  HALO = 'Aura',
  PHOTOSENSIBILITY = 'Sensibilidade à luz',
  HYPERACUSIS = 'Sensibilidade ao barulho',
  NAUSEA = 'Náusea',
  SICKNESS = 'Dor de barriga',
  VOMIT = 'Vômito',
}

export enum Trigger {
  FOOD = 'Alimentação',
  JAGGEDSLEEP = 'Sono irregular',
  EMOTIONAL = 'Fatores emocionais',
}

export enum ImprovementFactor {
  MEDICINE = 'Medicamento',
  SLEEP = 'Sono ou descanso',
  FOOD = 'Alimentação',
}

export enum Time {
  MORNING = 'Manhã',
  EVENING = 'Tarde',
  NIGHT = 'Noite',
  MIDNIGHT = 'Madrugada',
}
