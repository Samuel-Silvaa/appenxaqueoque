import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LogInDTO,
  LogInResponse,
  PatientDTO,
  PhysicianDTO,
  SignUpDTO,
  SignUpResponse,
  SendEmailConfirmationDTO,
  SendEmailConfirmationResponse,
  ConfirmEmailDTO,
  ConfirmEmailResponse,
} from './../../@types/auth.types';
import {
  requestHandleCreatePatient,
  requestHandleLogIn,
  requestHandleSingUp,
  requestHandleSendEmailConfirmation,
  requestHandleConfirmEmail,
  requestUpdateAvatar as requestHandleUpdateAvatar,
} from 'src/infra/services/authService';
import * as SecureStore from 'expo-secure-store';

// Define initial state type
export interface AuthReducer {
  avatar: string | null;
  token: string | null;
  refreshToken: string | null;
  user: PatientDTO | PhysicianDTO | null;
  sessionEmail: string | null;
  loading: boolean;
  error: string | null;
  isFirstAccess: boolean;
  userType: string | null;
  isEmailConfirmed: boolean;
}

const initialState: AuthReducer = {
  avatar: null,
  token: null,
  refreshToken: null,
  user: null,
  sessionEmail: null,
  loading: false,
  error: null,
  isFirstAccess: false,
  userType: null,
  isEmailConfirmed: false,
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
    //REQUEST_SEND_EMAIL_CONFIRMATION
    builder.addCase(requestSendEmailConfirmation.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestSendEmailConfirmation.fulfilled,
      (state, action: PayloadAction<SendEmailConfirmationResponse>) => {
        try {
          return (state = { ...state, loading: false, error: null });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(requestSendEmailConfirmation.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
    //REQUEST_CONFIRM_EMAIL
    builder.addCase(requestConfirmEmail.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestConfirmEmail.fulfilled,
      (state, action: PayloadAction<ConfirmEmailResponse>) => {
        try {
          return (state = { 
            ...state, 
            isEmailConfirmed: action.payload.isEmailConfirmed,
            loading: false, 
            error: null 
          });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(requestConfirmEmail.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
    //REQUEST_UPDATE_AVATAR
    builder.addCase(requestUpdateAvatar.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(requestUpdateAvatar.fulfilled, (state, action) => {
      console.log('PAYLOAD : ',action.payload);
      state.loading = false;
      state.error = null;
      state.avatar = action.payload.avatar;
      return state;
    });
    builder.addCase(requestUpdateAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Erro ao atualizar avatar';
      return state
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
export const requestSendEmailConfirmation = createAsyncThunk(
  'auth/requestSendEmailConfirmation',
  async (payload: SendEmailConfirmationDTO) => await requestHandleSendEmailConfirmation(payload)
);
export const requestConfirmEmail = createAsyncThunk(
  'auth/requestConfirmEmail',
  async (payload: ConfirmEmailDTO) => await requestHandleConfirmEmail(payload)
);
export const requestUpdateAvatar = createAsyncThunk<any, { avatar: string; email: string }>(
  'auth/requestUpdateAvatar',
  async (payload) => await requestHandleUpdateAvatar(payload)
);

// Export actions and reducer
export const { signOut, clearErrorMessage, setWelcomeJourneyDone } =
  authSlice.actions;
export default authSlice.reducer;
