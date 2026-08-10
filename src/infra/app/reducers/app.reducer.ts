import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateReportDTO,
  requestCreateEpisode,
  requestCreateReport,
  requestFetchEpisodes,
  requestFetchClinicalOptions,
  requestFetchPatient,
  requestFetchReports,
  requestUpdateEpisode,
  requestFetchReportEpisodesRange,
  requestGeneratePdfReport,
  requestDeleteAccount,
  requestDeleteEpisode,
  requestDeleteReport,
} from "src/infra/services/appService";
import {
  Episode,
  EpisodeModalDTO,
  Patient,
  Report,
  ClinicalOption,
} from "src/infra/@types/app.types";

// Define initial state type
export interface AppReducer {
  episode: Episode;
  episodes: Episode[];
  patient: Patient | null;
  reports: Report[] | null;
  currentEpStep: number;
  pageTitle: string;
  loading: boolean;
  error: string | null;
  pdfReportStatus: "success" | "error" | "loading" | null;
  reportEpisodes: Episode[];
  clinicalOptions: ClinicalOption[];
  clinicalOptionsLoading: boolean;
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
  combinedDosage: 0,
  medicineUnit: null,
  medicineImprovement: null,
  notes: null,
  painType: null,
  period: "false",
  periodNotes: null,
  symptoms: [],
  time: null,
  triggers: [],
  start: null,
  end: null,
};

const initialState: AppReducer = {
  episodes: [],
  episode: initialEpisodeState,
  patient: null,
  reports: [],
  currentEpStep: 0,
  pageTitle: "",
  loading: false,
  error: null,
  pdfReportStatus: null,
  reportEpisodes: [],
  clinicalOptions: [],
  clinicalOptionsLoading: false,
};

const handleFitEpisodeData = (ep: Episode): Episode => {
  return {
    ...ep,
    period: Number(ep.period) == 1 ? "true" : "false",
    triggers: ep.triggers
      ? String(ep.triggers)
          .split(",")
          .filter((item) => item && item.trim())
      : [],
    haloSymptoms: ep.haloSymptoms
      ? String(ep.haloSymptoms)
          .split(",")
          .filter((item) => item && item.trim())
      : [],
    improvementFactor: ep.improvementFactor
      ? String(ep.improvementFactor)
          .split(",")
          .filter((item) => item && item.trim())
      : [],
    impairFactor: ep.impairFactor
      ? String(ep.impairFactor)
          .split(",")
          .filter((item) => item && item.trim())
      : [],
    symptoms: ep.symptoms
      ? String(ep.symptoms)
          .split(",")
          .filter((item) => item && item.trim())
      : [],
    location: ep.location
      ? String(ep.location)
          .split(",")
          .filter((item) => item && item.trim())
      : [],
  };
};

// Create slice
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    clearAppErrorMessage: (state) => {
      return (state = { ...state, error: null });
    },
    handleFormChanging: (state, action) => {
      state.episode = { ...state.episode, ...action.payload };
      return state;
    },
    clearEpisodeState: (state) => {
      state.episode = initialEpisodeState;
      state.currentEpStep = 0;
      return state;
    },
    setEpisodeIndex: (state, action) => {
      return (state = { ...state, currentEpStep: action.payload });
    },
    handleStepForward: (state, action) => {
      return (state = { ...state, currentEpStep: action.payload });
    },
    setPageTitle: (state, action) => {
      return (state = { ...state, pageTitle: action.payload });
    },
    setLoadingState: (state, action) => {
      return (state = { ...state, loading: action.payload });
    },
    setPatientData: (state, action) => {
      return (state = { ...state, patient: action.payload });
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
      },
    );
    builder.addCase(handleCreateEpisode.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });
    // REQUEST_FETCH_EPISODES
    builder.addCase(handleFetchEpisodes.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      handleFetchEpisodes.fulfilled,
      (state, action: PayloadAction<Episode[]>) => {
        return (state = {
          ...state,
          episodes: action.payload.map(handleFitEpisodeData),
          loading: false,
          error: null,
        });
      },
    );
    builder.addCase(handleFetchEpisodes.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });
    // REQUEST_FETCH_CLINICAL_OPTIONS
    builder.addCase(handleFetchClinicalOptions.pending, (state) => {
      state.clinicalOptionsLoading = true;
    });
    builder.addCase(
      handleFetchClinicalOptions.fulfilled,
      (state, action: PayloadAction<ClinicalOption[]>) => {
        state.clinicalOptions = action.payload;
        state.clinicalOptionsLoading = false;
      },
    );
    builder.addCase(handleFetchClinicalOptions.rejected, (state) => {
      state.clinicalOptionsLoading = false;
    });
    // REQUEST_FETCH_PATIENT
    builder.addCase(handleFecthPatient.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      handleFecthPatient.fulfilled,
      (state, action: PayloadAction<Patient>) => {
        return (state = {
          ...state,
          patient: action.payload,
          loading: false,
          error: null,
        });
      },
    );
    builder.addCase(handleFecthPatient.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });
    // REQUEST_FETCH_REPORTS
    builder.addCase(handleFecthReports.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      handleFecthReports.fulfilled,
      (state, action: PayloadAction<Report[]>) => {
        return (state = {
          ...state,
          reports: action.payload.sort((a, b) =>
            b.createdAt!.localeCompare(a.createdAt!),
          ),
          loading: false,
          error: null,
        });
      },
    );
    builder.addCase(handleFecthReports.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });
    // REQUEST_CREATE_REPORT
    builder.addCase(handleCreateReport.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(
      handleCreateReport.fulfilled,
      (state, action: PayloadAction<Episode>) => {
        return (state = {
          ...state,
          loading: false,
          error: null,
        });
      },
    );
    builder.addCase(handleCreateReport.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error: "Erro ao gerar relatório!",
        loading: false,
      });
    });
    // REQUEST_FETCH_REPORTS_EPISODES_RANGE
    builder.addCase(handleFetchReportEpisodesRange.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      handleFetchReportEpisodesRange.fulfilled,
      (state, action: PayloadAction<Episode[]>) => {
        state.reportEpisodes = action.payload;
        state.loading = false;
        state.error = null;
      },
    );
    builder.addCase(
      handleFetchReportEpisodesRange.rejected,
      (state, action) => {
        if (action.error.name === "SilentAuthError") {
          state.loading = false;
          return;
        }
        state.error =
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado");
        state.loading = false;
      },
    );

    // REQUEST_GENERATE_PDF_REPORT
    builder.addCase(handleGeneratePdfReport.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleGeneratePdfReport.fulfilled, (state, action) => {
      return (state = { ...state, loading: false });
    });
    builder.addCase(handleGeneratePdfReport.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });

    // REQUEST_DELETE_ACCOUNT
    builder.addCase(handleDeleteAccount.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleDeleteAccount.fulfilled, (state, action) => {
      return (state = { ...state, loading: false });
    });
    builder.addCase(handleDeleteAccount.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });

    // REQUEST_DELETE_REPORT
    builder.addCase(handleDeleteReport.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleDeleteReport.fulfilled, (state, action) => {
      return (state = {
        ...state,
        loading: false,
        reports:
          state.reports?.filter((report) => report.id != action.payload.id) ||
          [],
      });
    });
    builder.addCase(handleDeleteReport.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });

    //REQUEEST_DELETE_EPISODE
    builder.addCase(handleDeleteEpisode.pending, (state) => {
      return (state = { ...state, loading: true });
    });
    builder.addCase(handleDeleteEpisode.fulfilled, (state, action) => {
      return (state = {
        ...state,
        loading: false,
        episodes:
          state.episodes?.filter(
            (episode) => episode.id != action.payload.id,
          ) || [],
      });
    });
    builder.addCase(handleDeleteEpisode.rejected, (state, action) => {
      if (action.error.name === "SilentAuthError")
        return { ...state, loading: false };
      return (state = {
        ...state,
        error:
          action.error.code == "401"
            ? "Sessão expirada. Por favor conecte-se novamente!"
            : (action.error.message ?? "Erro inesperado"),
        loading: false,
      });
    });
  },
});

export const handleCreateEpisode = createAsyncThunk(
  "app/handleCreateEpisode",
  async (data: { payload: Episode; id: string }) => {
    return await requestCreateEpisode(data.payload, data.id);
  },
);

export const handleUpdateEpisode = createAsyncThunk(
  "app/handleUpdateEpisode",
  async (data: { payload: EpisodeModalDTO; id: string }) => {
    return await requestUpdateEpisode(data.payload, data.id);
  },
);

export const handleFetchEpisodes = createAsyncThunk(
  "app/handleFetchEpisodes",
  async (patientId: string) => {
    return await requestFetchEpisodes(patientId);
  },
);

export const handleFetchClinicalOptions = createAsyncThunk(
  "app/handleFetchClinicalOptions",
  async () => {
    return await requestFetchClinicalOptions();
  },
);

interface DateInterface {
  date: { startDate: string; endDate: string } | null;
}

export const handleFecthReports = createAsyncThunk(
  "app/handleFecthReports",
  async (payload: { patientId: string; date: DateInterface }) => {
    return await requestFetchReports(payload.patientId, payload.date.date!);
  },
);

export const handleFecthPatient = createAsyncThunk(
  "app/handleFetchPatient",
  async (userId: string) => {
    return await requestFetchPatient(userId);
  },
);

export const handleCreateReport = createAsyncThunk(
  "app/handleCreateReport",
  async (payload: CreateReportDTO) => {
    return await requestCreateReport(payload);
  },
);

export const handleFetchReportEpisodesRange = createAsyncThunk(
  "app/handleFetchReportEpisodesRange",
  async (ids: string) => {
    return await requestFetchReportEpisodesRange(ids);
  },
);

export const handleGeneratePdfReport = createAsyncThunk(
  "app/handleGeneratePdfReport",
  async (payload: { id: string; physicianEmail: string }) => {
    return await requestGeneratePdfReport(payload);
  },
);

export const handleDeleteAccount = createAsyncThunk(
  "app/handleDeleteAccount",
  async (payload: { id: string; emailAddress: string }) => {
    return await requestDeleteAccount(payload);
  },
);

export const handleDeleteEpisode = createAsyncThunk(
  "app/handleDeleteEpisode",
  async (payload: { id: string }) => {
    const res = await requestDeleteEpisode(payload);
    return { id: payload.id, ...res };
  },
);

export const handleDeleteReport = createAsyncThunk(
  "app/handleDeleteReport",
  async (payload: { id: string }) => {
    const res = await requestDeleteReport(payload);
    return { id: payload.id, ...res };
  },
);

// Export actions and reducer
export const {
  clearAppErrorMessage,
  handleFormChanging,
  clearEpisodeState,
  handleStepForward,
  setPageTitle,
  setLoadingState,
  setPatientData,
  setEpisodeIndex,
} = appSlice.actions;
export default appSlice.reducer;
