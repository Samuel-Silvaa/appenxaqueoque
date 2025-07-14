import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateReportDTO, requestCreateEpisode, requestCreateReport, requestFetchEpisodes, requestFetchPatient, requestFetchReports, requestUpdateEpisode, requestFetchReportEpisodesRange, requestGeneratePdfReport } from "src/infra/services/appService";
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
  pdfReportStatus: 'success' | 'error' | 'loading' | null;
  reportEpisodes: Episode[];
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
    start: null,
    end: null,  
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
  pdfReportStatus: null,
  reportEpisodes: [],
};


  const handleFitEpisodeData = (ep: Episode): Episode => {
    return {
      ...ep,
      period: Number(ep.period) == 1 ? 'true' : 'false',
      triggers: ep.triggers ? String(ep.triggers).split(',').filter(item => item && item.trim()) : [],
      haloSymptoms: ep.haloSymptoms ? String(ep.haloSymptoms).split(',').filter(item => item && item.trim()) : [],
      improvementFactor: ep.improvementFactor ? String(ep.improvementFactor).split(',').filter(item => item && item.trim()) : [],
      symptoms: ep.symptoms ? String(ep.symptoms).split(',').filter(item => item && item.trim()) : [],
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
      state.currentEpStep = 0;
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
  // REQUEST_FETCH_REPORTS_EPISODES_RANGE
  builder.addCase(handleFetchReportEpisodesRange.pending, (state) => {
    state.loading = true;
  });
  builder.addCase(handleFetchReportEpisodesRange.fulfilled, (state, action: PayloadAction<Episode[]>) => {
    state.reportEpisodes = action.payload;
    state.loading = false;
    state.error = null;
  });
  builder.addCase(handleFetchReportEpisodesRange.rejected, (state, action) => {
    state.error = action.error.message ?? 'Erro inesperado';
    state.loading = false;
  });

  // REQUEST_GENERATE_PDF_REPORT
  builder.addCase(handleGeneratePdfReport.pending, (state) => {
    state.pdfReportStatus = 'loading';
  });
  builder.addCase(handleGeneratePdfReport.fulfilled, (state, action) => {
    state.pdfReportStatus = 'success';
  });
  builder.addCase(handleGeneratePdfReport.rejected, (state, action) => {
    state.pdfReportStatus = 'error';
    state.error = action.error.message ?? 'Erro inesperado';
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

export const handleFetchReportEpisodesRange = createAsyncThunk(
  'app/handleFetchReportEpisodesRange',
  async (ids: string) => {
    return await requestFetchReportEpisodesRange(ids);
  }
);

export const handleGeneratePdfReport = createAsyncThunk(
  'app/handleGeneratePdfReport',
  async (payload: { id: string; physicianEmail: string }) => {
    return await requestGeneratePdfReport(payload);
  }
);

// Export actions and reducer
export const { clearAppErrorMessage, handleFormChanging, clearEpisodeState, handleStepForward, setPageTitle, setLoadingState } = appSlice.actions;
export default appSlice.reducer;
