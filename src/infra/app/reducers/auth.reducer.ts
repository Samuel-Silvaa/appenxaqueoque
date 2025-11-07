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
  SendNewPasswordWithCode,
  SendNewPassword,
} from './../../@types/auth.types';
import {
  requestHandleCreatePatient,
  requestHandleLogIn,
  requestHandleSingUp,
  requestHandleSendEmailConfirmation,
  requestHandleConfirmEmail,
  requestUpdateAvatar as requestHandleUpdateAvatar,
  requestUpdatePatient as requestHandleUpdatePatient,
  requestHandleSendPasswordEmailConfirmation,
  requestHandleSendNewPasswordWithCode,
  requestHandleResetPassword,
} from 'src/infra/services/authService';
import * as SecureStore from 'expo-secure-store';
import { Patient } from 'src/infra/@types/app.types';

// Define initial state type
export interface AuthReducer {
  avatar: string | null;
  token: string | null;
  refreshToken: string | null;
  user: PatientDTO | PhysicianDTO | null;
  sessionEmail: string | null;
  loading: boolean;
  entireScreenLoading: boolean;
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
  entireScreenLoading: false,
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
      SecureStore.deleteItemAsync('token');
      SecureStore.deleteItemAsync('user');
    },
    clearErrorMessage: (state) => {
      return (state = { ...state, error: null });
    },
    setWelcomeJourneyDone: (state) => {
      return (state = { ...state, isFirstAccess: false });
    },
    setPatient: (state, action) => {
      return (state = { ...state, user: action.payload });
    },
    setToken: (state, action) => {
      return (state = { ...state, token: action.payload });
    },
  },
  extraReducers: (builder) => {
    // REQUEST_LOGIN
    builder.addCase(requestLogin.pending, (state) => {
      return (state = { ...state, entireScreenLoading: true, loading: false });
    });
    builder.addCase(
      requestLogin.fulfilled,
      (state, action: PayloadAction<LogInResponse>) => {
        console.log(action);
        SecureStore.setItem('token', action.payload.token);
        SecureStore.setItem('user', JSON.stringify(action.payload.user));
        if (action.payload.user)
          SecureStore.setItemAsync('userId', action.payload.user.id!);
        return (state = {
          ...state,
          ...action.payload,
          refreshToken: '',
          entireScreenLoading: false,
          loading: false,
          sessionEmail: action.meta!.arg.email,
          error: null,
        });
      }
    );
    builder.addCase(requestLogin.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        entireScreenLoading: false,
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
      console.log(action);
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
    //REQUEST_SEND_PASSWORD_EMAIL_CONFIRMATION
    builder.addCase(requestSendPasswordEmailConfirmation.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestSendPasswordEmailConfirmation.fulfilled,
      (state, action: PayloadAction<SendEmailConfirmationResponse>) => {
        try {
          return (state = { ...state, loading: false, error: null });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(
      requestSendPasswordEmailConfirmation.rejected,
      (state, action) => {
        return (state = {
          ...state,
          error: action.error.message ?? 'Erro inesperado',
          loading: false,
        });
      }
    );
    //REQUEST_SEND_NEW_PASSWORD_WITH_CODE
    builder.addCase(requestSendNewPasswordWithCode.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestSendNewPasswordWithCode.fulfilled,
      (state, action: PayloadAction<SendEmailConfirmationResponse>) => {
        try {
          return (state = { ...state, loading: false, error: null });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(
      requestSendNewPasswordWithCode.rejected,
      (state, action) => {
        return (state = {
          ...state,
          error: action.error.message ?? 'Erro inesperado',
          loading: false,
        });
      }
    );
    //REQUEST_RESET_PASSWORD
    builder.addCase(requestResetPassword.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestResetPassword.fulfilled,
      (state, action: PayloadAction<SendEmailConfirmationResponse>) => {
        try {
          return (state = { ...state, loading: false, error: null });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(requestResetPassword.rejected, (state, action) => {
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
            error: null,
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
      state.loading = false;
      state.error = null;
      state.avatar = action.payload.avatar;
      return state;
    });
    builder.addCase(requestUpdateAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Erro ao atualizar avatar';
      return state;
    });
    //REQUEST_UPDATE_PATIENT
    builder.addCase(requestUpdatePatient.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      requestUpdatePatient.fulfilled,
      (state, action: PayloadAction<PatientDTO>) => {
        try {
          return (state = {
            ...state,
            user: action.payload,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.log(err);
          return (state = { ...state, error: 'Erro inesperado!' });
        }
      }
    );
    builder.addCase(requestUpdatePatient.rejected, (state, action) => {
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
export const requestSendEmailConfirmation = createAsyncThunk(
  'auth/requestSendEmailConfirmation',
  async (payload: SendEmailConfirmationDTO) =>
    await requestHandleSendEmailConfirmation(payload)
);
export const requestSendPasswordEmailConfirmation = createAsyncThunk(
  'auth/requestSendPasswordEmailConfirmation',
  async (payload: SendEmailConfirmationDTO) =>
    await requestHandleSendPasswordEmailConfirmation(payload)
);
export const requestSendNewPasswordWithCode = createAsyncThunk(
  'auth/requestSendNewPasswordWithCode',
  async (payload: SendNewPasswordWithCode) =>
    await requestHandleSendNewPasswordWithCode(payload)
);

export const requestResetPassword = createAsyncThunk(
  'auth/requestResetPassword',
  async (payload: SendNewPassword) => await requestHandleResetPassword(payload)
);
export const requestConfirmEmail = createAsyncThunk(
  'auth/requestConfirmEmail',
  async (payload: ConfirmEmailDTO) => await requestHandleConfirmEmail(payload)
);
export const requestUpdateAvatar = createAsyncThunk<
  any,
  { avatar: string; email: string }
>(
  'auth/requestUpdateAvatar',
  async (payload) => await requestHandleUpdateAvatar(payload)
);

export const requestUpdatePatient = createAsyncThunk(
  'auth/requestUpdatePatient',
  async (payload: PatientDTO & { id: string }) =>
    await requestHandleUpdatePatient(payload)
);

// Export actions and reducer
export const {
  signOut,
  clearErrorMessage,
  setWelcomeJourneyDone,
  setPatient,
  setToken,
} = authSlice.actions;
export default authSlice.reducer;
