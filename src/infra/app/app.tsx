import React, { createContext, ReactNode, useContext, useState } from 'react';

import {
  AppContextDefaultValues,
  Episode,
  Location,
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
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const episodeInitialForm = {
  id: '',
  acuteness: '',
  dates: {},
  foodImpair: '',
  foodImprovement: '',
  improvementFactor: [],
  isEdition: false,
  location: '',
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
  steps: 9,
  currentStep: 0,
  validateStepForward: () => false,
  handleFormChange: () => null,
  episodeFormState: episodeInitialForm,
  submitEpisode: () => null,
  clearEpisodeFormState: () => null,
  dispatch: () => new Promise(() => {}),
  patient: undefined,
  episodes: undefined,
  reports: undefined,
  pageTitle: '',
  setPageTitle: undefined,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const navigation = useNavigation();
  const [steps, _] = useState(9);
  const [currentStep, setCurrentStep] = useState(0);
  const [episodeFormState, setEpisodeFormState] = useState(episodeInitialForm);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [reports, setReports] = useState<Report[] | undefined>();
  const [pageTitle, setPageTitle] = useState();
  const toast = useToast();

  const clearEpisodeFormState = () => {
    setEpisodeFormState(episodeInitialForm);
  };

  // const ValidateFormEnabledAndReturnBehavior = (
  //   condition = true,
  //   nextStep = currentStep + 1,
  //   showToast = true
  // ): boolean => {
  //   if (condition) {
  //     setCurrentStep(nextStep);
  //     debugger;
  //     return true;
  //   }
  //   if (showToast)
  //     handleToast(
  //       'Preencha todos os campos obrigatórios antes de continuar!',
  //       'danger'
  //     );
  //   return false;
  // };

  const episodeTitle = () => {
    switch (currentStep) {
      case 0:
        return 'Data e horário';
      case 1:
        return 'Localização';
      case 2:
        return 'Intensidade';
      case 3:
        return 'Característica da dor';
      case 4:
        return 'Sintomas associados';
      case 5:
        return 'Gatilhos';
      case 6:
        return 'Fatores de melhora';
      case 7:
        return 'Período menstrual';
      case 8:
        return 'Observações';
    }
  };

  const validateStepForward = (nextStep: number): boolean => {
    if (nextStep >= 0) {
      setCurrentStep(nextStep);
      return true;
    }

    return false;
  };

  const handleFormChange = (payload: any) => {
    setEpisodeFormState((prevState: any) => {
      return Object.assign({ ...prevState, ...payload });
    });
  };

  const submitEpisode = () => {
    const parsedObject: any = Object.assign(episodeFormState, {
      dateTime: new Date(Object.keys(episodeFormState.dates)[0]),
      location: Location.FRONTALRIGHT,
      triggers: episodeFormState.triggers.join(','),
      improvementFactor: episodeFormState.improvementFactor.join(','),
      symptoms: episodeFormState.symptoms.join(','),
    });

    Object.keys(parsedObject).map((key) => {
      if (typeof parsedObject[key] === 'string' && parsedObject[key] === '') {
        parsedObject[key] = null;
      }
    });
    delete parsedObject.dates;

    if (parsedObject.isEdition) {
      delete parsedObject.isEdition;
      dispatch(AppActions.REQUEST_UPDATE_EPISODE, parsedObject);
    } else {
      delete parsedObject.id;
      delete parsedObject.isEdition;
      dispatch(AppActions.REQUEST_CREATE_EPISODE, parsedObject);
    }
  };

  const handleToast = (message: string, type: string) => {
    toast.hideAll();
    const toastOptions: ToastOptions = {
      animationDuration: 400,
      animationType: 'slide-in',
      placement: 'top',
      duration: 2000,
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
    if (isShowingToast) handleToast('Processando...', 'warning');
    return promiseFromService
      .then((res) => {
        successCallbackAction(res);
        if (isShowingToast) handleToast('Tudo certo!', 'success');
      })
      .catch((err) => {
        console.log(err);
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
      triggers: String(ep.triggers).split(','),
      improvementFactor: String(ep.improvementFactor).split(','),
      symptoms: String(ep.symptoms).split(','),
    };
  };

  const dispatch = async (
    action: string,
    payload?: any,
    assetId?: string
  ): Promise<any> => {
    const userId = await SecureStore.getItemAsync('userId');
    switch (action) {
      case AppActions.REQUEST_CREATE_EPISODE:
        if (userId) {
          return handlePromise({
            promiseFromService: requestCreateEpisode(payload, userId),
            payload,
            successCallbackAction: (res) => {
              dispatch(AppActions.REQUEST_FETCH_EPISODES);
              navigation.navigate('Success', handleFitEpisodeData(res));
              setCurrentStep(0);
              setEpisodeFormState(handleFitEpisodeData(res));
            },
            isShowingToast: true,
          });
        }
        break;
      case AppActions.REQUEST_CREATE_REPORT:
        if (userId) {
          return handlePromise({
            promiseFromService: requestCreateReport({
              ...payload,
              patientId: userId,
            }),
            payload,
            successCallbackAction: (res) => {
              dispatch(AppActions.REQUEST_FETCH_REPORTS, {});
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
            toast.show('Um pdf do relátorio foi enviado ao médico!', {
              type: 'success',
            });
          },
          isShowingToast: true,
        });
        break;
      case AppActions.REQUEST_UPDATE_EPISODE:
        return handlePromise({
          promiseFromService: requestUpdateEpisode(payload, payload.id),
          payload,
          successCallbackAction: (res) => {
            dispatch(AppActions.REQUEST_FETCH_EPISODES);
            navigation.navigate('Success', res);
            setCurrentStep(0);
            setEpisodeFormState(handleFitEpisodeData(res));
          },
          isShowingToast: true,
        });
        break;
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
        if (userId)
          return handlePromise({
            promiseFromService: requestFetchEpisodes(userId),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
        break;
      case AppActions.REQUEST_FETCH_REPORTS:
        if (userId)
          return handlePromise({
            promiseFromService: requestFetchReports(userId, payload),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
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
        currentStep,
        dispatch,
        episodeFormState,
        handleFormChange,
        patient: patient || undefined,
        validateStepForward,
        steps,
        submitEpisode,
        episodes: episodes || undefined,
        pageTitle: pageTitle || undefined,
        reports: reports,
        setPageTitle: setPageTitle,
        clearEpisodeFormState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
