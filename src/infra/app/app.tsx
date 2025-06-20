import React, { createContext, ReactNode, useContext, useState } from 'react';

import {
  AppContextDefaultValues,
  Episode,
  HaloSymptom,
  Patient,
} from '../@types/app.types';
import { ToastOptions, useToast } from 'react-native-toast-notifications';
import {
  requestCreateEpisode,
  requestCreateReport,
  requestFetchEpisodes,
  requestFetchPatient,
  requestFetchReportEpisodesRange,
  requestFetchReports,
  requestGeneratePdfReport,
  requestUpdateEpisode,
} from '../services/appService';
import { AppActions } from './actions';
import * as SecureStore from 'expo-secure-store';
import { addHours } from 'date-fns';
import { handleCreateEpisode, handleStepForward } from './reducers/app.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector, authSelector } from './selectors';
import { useAsyncAppDispatch } from './store';
import { useNavigation } from '@react-navigation/native';

const episodeInitialForm = {
  acuteness: '',
  anotherImpairFactor: '',
  anotherImprovementFactor: '',
  anotherPainType: '',
  anotherTrigger: '',
  dates: {},
  foodImpair: '',
  foodImprovement: '',
  haloSymptoms: [],
  id: '',
  impairFactor: [],
  improvementFactor: [],
  isEdition: false,
  location: [],
  medicine: '',
  medicineDosage: 0,
  medicineImprovement: '',
  notes: '',
  painType: '',
  period: '',
  periodNotes: '',
  symptoms: [],
  time: '',
  triggers: [],
};

const AppContext = createContext<AppContextDefaultValues>({
  isLoading: false,
  validateStepForward: () => false,
  submitEpisode: () => new Promise(() => {}),
  dispatch: () => new Promise(() => {}),
  patient: undefined,
  episodes: undefined,
  reports: undefined,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [steps, _] = useState(12);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [reports, setReports] = useState<Report[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const asyncDispatch = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);


  const validateStepForward = (nextStep: number): boolean => {
    console.log(nextStep);
    if (nextStep >= 0) {
      dispatch(handleStepForward(nextStep));
      return true;
    }

    return false;
  };

  const submitEpisode = async () => {
    try {
      if (!Object.keys(appState.episode.dates).length) {
        handleToast(
          'Preencha ao menos a data do episódio para continuar!',
          'danger'
        );
        return false;
      } else {
        const parsedObject: any = {
          ...appState.episode,
          dateTime: addHours(
            new Date(Object.keys(appState.episode.dates)[0]),
            9
          ),
          location: Array.isArray(appState.episode.location)
            ? appState.episode.location.join(',')
            : appState.episode.location,
          triggers: Array.isArray(appState.episode.triggers)
            ? appState.episode.triggers.join(',')
            : appState.episode.triggers,
          haloSymptoms: Array.isArray(appState.episode.haloSymptoms)
            ? appState.episode.haloSymptoms.join(',')
            : appState.episode.haloSymptoms,
          improvementFactor: Array.isArray(appState.episode.improvementFactor)
            ? appState.episode.improvementFactor.join(',')
            : appState.episode.improvementFactor,
          symptoms: Array.isArray(appState.episode.symptoms)
            ? appState.episode.symptoms.join(',')
            : appState.episode.symptoms,
          impairFactor: Array.isArray(appState.episode.impairFactor)
            ? appState.episode.impairFactor.join(',')
            : appState.episode.impairFactor,
        };

        Object.keys(parsedObject).map((key) => {
          if (
            typeof parsedObject[key] === 'string' &&
            parsedObject[key] === ''
          ) {
            parsedObject[key] = null;
          }
        });
        delete parsedObject.dates;

        if (parsedObject.isEdition) {
          delete parsedObject.isEdition;
          return appDispatch(
            AppActions.REQUEST_UPDATE_EPISODE,
            parsedObject,
            appState.episode.id!
          );
        } else {
          delete parsedObject.id;
          delete parsedObject.isEdition;
          const res = await asyncDispatch(
            handleCreateEpisode({
              payload: parsedObject,
              id: auth.user?.id ?? '',
            })
          );

          if (res.meta.requestStatus == 'fulfilled') {
            const data = res.payload as Episode;

            return {
              ...data,
              triggers: String(data.triggers).split(','),
              improvementFactor: String(data.improvementFactor).split(','),
              symptoms: String(data.symptoms).split(','),
              haloSymptoms: String(data.haloSymptoms).split(','),
              impairFactor: String(data.impairFactor).split(','),
            };
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleToast = (message: string, type: string) => {
    toast.hideAll();
    const toastOptions: ToastOptions = {
      type: type,
    };
    toast.show(message, toastOptions);
  };

  const handlePromise = async ({
    promiseFromService,
    payload,
    successCallbackAction = () => {},
    isShowingToast = false,
  }: {
    promiseFromService: Promise<any>;
    payload: any;
    successCallbackAction?: (payload: any) => void;
    isShowingToast?: boolean;
  }) => {
    setIsLoading(true);
    return promiseFromService
      .then((res) => {
        setIsLoading(false);
        successCallbackAction(res);
        if (isShowingToast) handleToast('Tudo certo!', 'success');
      })
      .catch((err) => {
        setIsLoading(false);
        handleToast(
          err.response.data.message != 'Validation failed'
            ? err.response.data.message
            : 'Tivemos um problema. Tente novamente mais tarde!',
          'danger'
        );
      });
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

  const appDispatch = async (
    action: string,
    payload?: any,
    assetId?: string
  ): Promise<any> => {
    const userId = await SecureStore.getItemAsync('userId');
    switch (action) {
      case AppActions.REQUEST_CREATE_REPORT:
        if (userId) {
          return handlePromise({
            promiseFromService: requestCreateReport({
              ...payload,
              patientId: userId,
            }),
            payload,
            successCallbackAction: (res) => {
              appDispatch(AppActions.REQUEST_FETCH_REPORTS, {});
            },
            isShowingToast: true,
          });
        }
        break;
      case AppActions.REQUEST_GENERATE_PDF_REPORT:
        return handlePromise({
          promiseFromService: requestGeneratePdfReport({
            id: payload.id,
            physicianEmail: payload.physicianEmail,
          }),
          payload,
          successCallbackAction: (res) => {
            toast.show(
              'Um pdf do relátorio foi enviado ao médico! Verifique sua caixa de spam',
              {
                type: 'success',
              }
            );
          },
          isShowingToast: true,
        });
      case AppActions.REQUEST_FETCH_PATIENT:
        if (userId) {
          handlePromise({
            promiseFromService: requestFetchPatient(userId),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
          return requestFetchPatient(userId);
        }
        break;
      case AppActions.REQUEST_FETCH_EPISODES:
        if (userId) {
          handlePromise({
            promiseFromService: requestFetchEpisodes(userId),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
          return requestFetchEpisodes(userId);
        }
      case AppActions.REQUEST_FETCH_REPORTS:
        if (userId) {
          handlePromise({
            promiseFromService: requestFetchReports(userId, payload),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
          return requestFetchReports(userId, payload);
        }

      case AppActions.REQUEST_FETCH_REPORTS_EPISODES_RANGE:
        if (userId) {
          handlePromise({
            promiseFromService: requestFetchReportEpisodesRange(payload),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
          return requestFetchReportEpisodesRange(payload);
        }
        break;
    }
  };

  const reducer = (type: any, payload: any, response: any) => {
    switch (type) {
      case AppActions.REQUEST_FETCH_PATIENT:
        setPatient(response);
      case AppActions.REQUEST_FETCH_EPISODES:
        setEpisodes(response);
        break;
      case AppActions.REQUEST_FETCH_REPORTS:
        setReports(response);
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        dispatch: appDispatch,
        patient: patient || undefined,
        validateStepForward,
        steps,
        submitEpisode,
        episodes: episodes || undefined,
        reports: reports,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
