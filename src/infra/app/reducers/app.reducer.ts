import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import FormSteps from '../../../modules/app/episode/components';
import React from "react";
import { requestCreateEpisode, requestUpdateEpisode } from "src/infra/services/appService";
import { Episode, EpisodeModalDTO } from "src/infra/@types/app.types";


// Define initial state type
export interface AppReducer {
  episode: Episode;
  currentEpStep: number;
  pageTitle: string;
  loading: boolean;
  error: string | null;
}

const initialEpisodeState: Episode = {
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
    period: 'false',
    periodNotes: null,
    symptoms: [],
    time: null,
    triggers: [],
  }

const initialState: AppReducer = {
  episode: initialEpisodeState,
  currentEpStep: 0,
  pageTitle : '',
  loading: false,
  error: null,
};


  const handleFitEpisodeData = (ep: Episode): Episode => {
    return {
      ...ep,
      period: Number(ep.period) == 1 ? 'true' : 'false',
      triggers: String(ep.triggers).split(','),
      haloSymptoms: String(ep.haloSymptoms),
      improvementFactor: String(ep.improvementFactor).split(','),
      symptoms: String(ep.symptoms).split(','),
    };
  };

// Create slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      return (state = { ...state, error: null });
    },
    handleFormChanging: (state, action) => {
      state.episode = {...state.episode, ...action.payload}
      return state
    },
    clearEpisodeState: (state) => {
      state.episode = initialEpisodeState;
      return state;
    },
    handleStepForward: (state, action) => {
      return state = {...state, currentEpStep: action.payload};
    },
    setPageTitle: (state, action) => {
      return state = {...state, pageTitle: action.payload};
    },

  },
  extraReducers: (builder) => {
    // REQUEST_CREATE_EPISODE
    builder.addCase(handleCreateEpisode.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      handleCreateEpisode.fulfilled,
      (state, action: PayloadAction<Episode>) => {

        return (state = {
          ...state,
          episode: handleFitEpisodeData(action.payload),
          loading: false,
          error: null,
        });
      }
    );
    builder.addCase(handleCreateEpisode.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
  },
});

export const handleCreateEpisode = createAsyncThunk(
  'app/handleCreateEpisode',
  async (data : {payload: Episode, id: string}) => {
    return await requestCreateEpisode(data.payload, data.id );
  }
);

export const handleUpdateEpisode = createAsyncThunk(
  'app/handleUpdateEpisode',
  async (data : {payload: EpisodeModalDTO, id: string}) => {
    return await requestUpdateEpisode(data.payload, data.id );
  }
);

// Export actions and reducer
export const { clearErrorMessage, handleFormChanging, clearEpisodeState, handleStepForward, setPageTitle } = appSlice.actions;
export default appSlice.reducer;
