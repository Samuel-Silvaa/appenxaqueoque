import { AuthenticationActions } from '../auth/auth.actions';

export interface AuthContextDefaultValues {
  isAuthLoading: boolean;
  dispatch: (action: AuthenticationActions, payload: any) => void;
  form: {
    token?: string;
    refreshToken?: string;
    user?: { email: string; password: string; userType?: string };
  };
  handleFormChange: (payload: any) => void;
  isLogged: boolean;
  signOut: () => void;
  session: LogInResponse | undefined;
  setIsLoggedTrue: () => void;
}

export interface LogInDTO {
  email: string;
  password: string;
}

export interface LogInResponse {
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
