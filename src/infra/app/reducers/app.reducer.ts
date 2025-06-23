import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateReportDTO, requestCreateEpisode, requestCreateReport, requestFetchEpisodes, requestFetchPatient, requestFetchReports, requestUpdateEpisode } from "src/infra/services/appService";
import { Episode, EpisodeModalDTO, Patient, Report } from "src/infra/@types/app.types";


// Define initial state type
export interface AppReducer {
  episode: Episode;
  episodes: Episode[];
  patient: Patient | null,
  reports: Report[] | null,
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
  episodes: [],
  episode: initialEpisodeState,
  patient: null,
  reports: [],
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
    clearAppErrorMessage: (state) => {
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
    setLoadingState: (state, action) => {
      return state = {...state, loading : action.payload}
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
    // REQUEST_FETCH_EPISODES
    builder.addCase(handleFetchEpisodes.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleFetchEpisodes.fulfilled,(state, action: PayloadAction<Episode[]>) => {
        console.log(action.payload)
        return (state = {
          ...state,
          episodes: action.payload,
          loading: false,
          error: null,
        });
      }
    );
    builder.addCase(handleFetchEpisodes.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
    // REQUEST_FETCH_PATIENT
    builder.addCase(handleFecthPatient.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleFecthPatient.fulfilled,(state, action: PayloadAction<Patient>) => {
      console.log( action.payload);
        return (state = {
          ...state,
          patient: action.payload,
          loading: false,
          error: null,
        });
      }
    );
    builder.addCase(handleFecthPatient.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
  // REQUEST_FETCH_REPORTS
    builder.addCase(handleFecthReports.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleFecthReports.fulfilled,(state, action: PayloadAction<Report[]>) => {
        return (state = {
          ...state,
          reports: action.payload,
          loading: false,
          error: null,
        });
      }
    );
    builder.addCase(handleFecthReports.rejected, (state, action) => {
      return (state = {
        ...state,
        error: action.error.message ?? 'Erro inesperado',
        loading: false,
      });
    });
  // REQUEST_CREATE_REPORT
    builder.addCase(handleCreateReport.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleCreateReport.fulfilled,(state, action: PayloadAction<Episode>) => {
        return (state = {
          ...state,
          loading: false,
          error: null,
        });
      }
    );
    builder.addCase(handleCreateReport.rejected, (state, action) => {
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

export const handleFetchEpisodes = createAsyncThunk(
  'app/handleFetchEpisodes',
  async (patientId: string) => {
    return await requestFetchEpisodes( patientId );
  }
);

interface DateInterface {
  date : { startDate: string; endDate: string } | null
}

export const handleFecthReports = createAsyncThunk(
  'app/handleFecthReports', 
  async ( payload:{  patientId: string, date: DateInterface }) => {
    return await requestFetchReports(payload.patientId, payload.date.date!);
  }
);

export const handleFecthPatient = createAsyncThunk(
  'app/handleFetchPatient',
  async ( userId: string) => {
    return await requestFetchPatient(userId);
  }
);

export const handleCreateReport = createAsyncThunk(
  'app/handleCreateReport',
  async (payload: CreateReportDTO) => {
    return await requestCreateReport(payload);
  }
);

// Export actions and reducer
export const { clearAppErrorMessage, handleFormChanging, clearEpisodeState, handleStepForward, setPageTitle, setLoadingState } = appSlice.actions;
export default appSlice.reducer;
