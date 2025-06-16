import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LogInDTO,
  LogInResponse,
  PatientDTO,
  PhysicianDTO,
  SignUpDTO,
  SignUpResponse,
} from './../../@types/auth.types';
import {
  requestHandleCreatePatient,
  requestHandleLogIn,
  requestHandleSingUp,
} from 'src/infra/services/authService';
import * as SecureStore from 'expo-secure-store';

// Define initial state type
export interface AuthReducer {
  token: string | null;
  refreshToken: string | null;
  user: PatientDTO | PhysicianDTO | null;
  sessionEmail: string | null;
  loading: boolean;
  error: string | null;
  isFirstAccess: boolean;
  userType: string | null;
}

const initialState: AuthReducer = {
  token: null,
  refreshToken: null,
  user: null,
  sessionEmail: null,
  loading: false,
  error: null,
  isFirstAccess: false,
  userType: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.error = null;
    },
    clearErrorMessage: (state) => {
      return (state = { ...state, error: null });
    },
    setWelcomeJourneyDone: (state) => {
      return (state = { ...state, isFirstAccess: false });
    },
  },
  extraReducers: (builder) => {
    // REQUEST_LOGIN
    builder.addCase(requestLogin.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestLogin.fulfilled,
      (state, action: PayloadAction<LogInResponse>) => {
        SecureStore.setItem('token', action.payload.token);
        if (action.payload.user)
          SecureStore.setItemAsync('userId', action.payload.user.id!);

        return (state = {
          ...state,
          ...action.payload,
          refreshToken: '',
          sessionEmail: action.payload.email,
          loading: false,
          error: null,
        });
      }
    );
    builder.addCase(requestLogin.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
    //REQUEST_SIGNUP
    builder.addCase(requestSignup.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestSignup.fulfilled,
      (state, action: PayloadAction<SignUpResponse>) => {
        try {
          return (state = { ...state, sessionEmail: action.payload.email });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(requestSignup.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
    //REQUEST_CREATE_PATIENT
    builder.addCase(requestCreatePatient.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestCreatePatient.fulfilled,
      (state, action: PayloadAction<PatientDTO>) => {
        try {
          return (state = {
            ...state,
            user: action.payload,
            loading: false,
            isFirstAccess: true,
          });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(requestCreatePatient.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
  },
});

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (payload: LogInDTO) => await requestHandleLogIn(payload)
);
export const requestSignup = createAsyncThunk(
  'auth/requestSignup',
  async (payload: SignUpDTO) =>
    await requestHandleSingUp({
      email: payload.email,
      password: payload.password,
      userType: 'PATIENT',
    })
);
export const requestCreatePatient = createAsyncThunk(
  'auth/requestCreatePatient',
  async (payload: PatientDTO) => await requestHandleCreatePatient(payload)
);

// Export actions and reducer
export const { signOut, clearErrorMessage, setWelcomeJourneyDone } =
  authSlice.actions;
export default authSlice.reducer;
