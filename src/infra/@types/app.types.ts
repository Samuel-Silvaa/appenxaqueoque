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
  acuteness: string;
  dates?: object | any;
  dateTime?: string;
  foodImpair: string;
  foodImprovement: string;
  id?: string;
  improvementFactor: string | string[];
  isEdition?: boolean;
  location: string;
  medicine: string;
  medicineDosage: number;
  medicineImprovement: string;
  notes: string;
  painType: string;
  period: string;
  periodNotes: string;
  symptoms: string | string[];
  time: string;
  triggers: string | string[];
}

export interface Report {
  id?: string;
  startDate: Date;
  endDate: Date;
  episodeAmount: number;
  time: number;
  location: number;
  acuteness: number;
  painType: number;
  symptoms: number;
  triggers: number;
  improvementFactor: number;
  episodesIds: string;
  notes: string;
  periodNotes: string;
}

export interface AppContextDefaultValues {
  dispatch: (action: any, payload?: any, assetId?: string) => Promise<any>;
  steps: number;
  currentStep: number;
  validateStepForward: (step: number) => boolean;
  handleFormChange: (payload: object) => void;
  submitEpisode: () => void;
  clearEpisodeFormState: () => void;
  episodeFormState: Episode;
  episodes?: Episode[];
  patient?: Patient;
  reports?: Report[];
  pageTitle?: string;
  setPageTitle?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export enum Location {
  FRONTALRIGHT = 'Frontal direita',
  FRONTALLEFT = 'Frontal esquerda',
  FRONTALBILATERAL = 'Frontal bilateral',
  PARIETALRIGHT = 'Parietal direita',
  PARIETALLEFT = 'Parietal esquerda',
  PARIETALBILATERAL = 'Parietal bilateral',
  TEMPLERIGHT = 'Temporal direita',
  TEMPLELEFT = 'Temporal esquerda',
  TEMPLEBILATERAL = 'Temporal bilateral',
  BACKSIDE = 'Posterior/nuca',
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
