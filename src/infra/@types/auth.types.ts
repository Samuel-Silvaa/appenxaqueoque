
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
