import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LogInDTO,
  LogInResponse,
  PatientDTO,
  PhysicianDTO,
} from '../../@types/auth.types';
import { requestHandleLogIn } from 'src/infra/services/authService';
import * as SecureStore from 'expo-secure-store';

interface Episode {
  acuteness: string | null;
  anotherImpairFactor: string | null;
  anotherImprovementFactor: string | null;
  anotherPainType: string | null;
  anotherTrigger: string | null;
  dates: any;
  foodImpair: string | null;
  foodImprovement: string | null;
  haloSymptoms: Array<string>;
  id: string | null;
  impairFactor: Array<string>;
  improvementFactor: Array<string>;
  isEdition: false;
  location: Array<string>;
  medicine: string | null;
  medicineDosage: 0;
  medicineImprovement: string | null;
  notes: string | null;
  painType: string | null;
  period: string | null;
  periodNotes: string | null;
  symptoms: Array<string>;
  time: string | null;
  triggers: Array<string>;
}

// Define initial state type
export interface AppReducer {
  episode: Episode;
  loading: boolean;
  error: string | null;
}

const initialState: AppReducer = {
  episode: {
    acuteness: null,
    anotherImpairFactor: null,
    anotherImprovementFactor: null,
    anotherPainType: null,
    anotherTrigger: null,
    dates: {},
    foodImpair: null,
    foodImprovement: null,
    haloSymptoms: [],
    id: null,
    impairFactor: [],
    improvementFactor: [],
    isEdition: false,
    location: [],
    medicine: null,
    medicineDosage: 0,
    medicineImprovement: null,
    notes: null,
    painType: null,
    period: null,
    periodNotes: null,
    symptoms: [],
    time: null,
    triggers: [],
  },
  loading: false,
  error: null,
};

// Create slice
const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      return (state = { ...state, error: null });
    },
    handleChangeForm: (state, action) => {
      return state = {...state, episode : {...state, ...action.payload}}
    }
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
  },
});

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (payload: LogInDTO) => await requestHandleLogIn(payload)
);

// Export actions and reducer
export const { clearErrorMessage } = appSlice.actions;
export default appSlice.reducer;
