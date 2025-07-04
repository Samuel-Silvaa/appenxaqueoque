export interface AuthContextDefaultValues {
  form: {
    token?: string;
    refreshToken?: string;
    user?: { email: string; password: string; userType?: string };
  };
  session: LogInResponse | undefined;
}

export interface LogInDTO {
  email: string;
  password: string;
}

export interface LogInResponse {
  email: string;
  token: string;
  userType: string;
  user: PatientDTO | PhysicianDTO;
  isEmailConfirmed: boolean;
}

export interface SignUpDTO {
  email: string;
  password: string;
  userType: string;
}

export interface SignUpResponse {
  email: string;
  userType: string;
  password: string ;
}

export interface SendEmailConfirmationDTO {
  email: string;
}

export interface SendEmailConfirmationResponse {
  message: string;
}

export interface ConfirmEmailDTO {
  token: string;
  email: string;
}

export interface ConfirmEmailResponse {
  message: string;
  isEmailConfirmed: boolean;
}

export interface PatientDTO {
  id?: string;
  name: string;
  email: string;
  birthDate: string;
  gender: string;
  kinship: string;
  height: number;
  weight: number;
}

export interface PhysicianDTO {
  id?: string;
  name: string;
  email: string;
  crm: string;
  additionalInfo: string;
}
