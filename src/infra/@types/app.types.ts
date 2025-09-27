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
  acuteness: string | null;
  anotherImpairFactor: string | null;
  anotherImprovementFactor: string | null;
  anotherPainType: string | null;
  anotherTrigger: string | null;
  dates?: object | any;
  dateTime?: string | null;
  foodImpair: string | null;
  foodImprovement: string | null;
  haloSymptoms: string | string[];
  id?: string | null;
  impairFactor: string | string[];
  improvementFactor: string | string[];
  isEdition?: boolean;
  location: string | string[];
  medicine: string | null;
  medicineDosage: number;
  medicineUnit: string | null;
  medicineImprovement: string | null;
  notes: string | null;
  painType: string | null;
  period: any;
  periodNotes: string | null;
  symptoms: string | string[];
  time: string | null;
  triggers: string | string[];
  start?: string | null;
  end?: string | null;
}

export interface EpisodeModalDTO {
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  height?: string;
  kinship?: string;
  name?: string;
  patientId?: string;
  weight?: string;
  acuteness: string;
  dates?: object | any;
  dateTime?: string;
  foodImpair: string;
  foodImprovement: string;
  id?: string;
  improvementFactor: string | string[];
  isEdition?: boolean;
  location: string | string[];
  medicine: string;
  medicineDosage: number;
  medicineImprovement: string;
  notes: string;
  painType: string;
  period: boolean;
  periodNotes: string;
  symptoms: string | string[];
  time: string;
  impairFactor: string | string[];
  triggers: string | string[];
}

export interface Report {
  createdAt?: string;
  id?: string;
  startDate: string;
  endDate: string;
  episodeAmount: number;
  time: number;
  location: number;
  acuteness: number;
  painType: number;
  haloSymptom: number;
  symptoms: number;
  triggers: number;
  impairFactor: number;
  improvementFactor: number;
  episodesIds: string;
  notes: string;
  periodNotes: string;
}

export interface AppContextDefaultValues {
  isLoading: boolean;
  dispatch: (action: any, payload?: any, assetId?: string) => Promise<any>;
  validateStepForward: (step: number) => boolean;
  submitEpisode: () => Promise<any>;
  handleToast: (message: string, type: string) => void;
  episodes?: Episode[];
  patient?: Patient;
  reports?: Report[];
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
  OCCIPITALRIGHT = 'Occipital direita',
  OCCIPITALLEFT = 'Occipital esquerda',
  OCCIPITALBILATERAL = 'Occipital bilateral',
  NONE = 'Dados insuficientes',
}

export enum ImpairFactor {
  JUMP = 'Pular',
  CROUCH = 'Agachar',
  ANOTHER = 'Outros',
  NONE = 'Dados insuficientes',
}

export enum Acuteness {
  LIGHT = 'Leve',
  MILD = 'Moderada',
  SEVERE = 'Forte',
  NONE = 'Dados insuficientes',
}

export enum PainType {
  THROB = 'Pulsátil',
  TIGHT = 'Aperto',
  ANOTHER = 'Outros',
  NONE = 'Dados insuficientes',
}

export enum HaloSymptom {
  VISUAL_DISTORTIONS = 'Alterações visuais',
  TINGLING = 'Formigamento',
  SPEECH_DISTORTIONS = 'Alterações na fala',
  NONE = 'Dados insuficientes',
}

export enum Symptom {
  PHOTOSENSIBILITY = 'Sensibilidade à luz',
  NAUSEA = 'Náusea',
  VOMIT = 'Vômito',
  SICKNESS = 'Dor de barriga',
  HYPERACUSIS = 'Sensibilidade ao barulho',
  DIZZINESS = 'Tontura',
  NONE = 'Dados insuficientes',
}

export enum Trigger {
  JAGGEDSLEEP = 'Sono irregular',
  EMOTIONAL = 'Fatores emocionais',
  VISUALEFFORT = 'Esforço visual',
  FASTING = 'Jejum prolongado',
  FOOD = 'Alimentação',
  ANOTHER = 'Outros',
  NONE = 'Dados insuficientes',
}

export enum ImprovementFactor {
  MEDICINE = 'Medicamento',
  SLEEP = 'Sono ou descanso',
  FOOD = 'Alimentação',
  ANOTHER = 'Outros',
  NONE = 'Dados insuficientes',
}

export enum Time {
  MORNING = 'Manhã',
  EVENING = 'Tarde',
  NIGHT = 'Noite',
  MIDNIGHT = 'Madrugada',
  NONE = 'Dados insuficientes',
}
