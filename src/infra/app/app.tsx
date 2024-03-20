import React, { createContext, ReactNode, useContext, useState } from 'react';

import { AppContextDefaultValues, Episode, Patient } from '../@types/app.types';
import { ToastOptions, useToast } from 'react-native-toast-notifications';
import {
  requestCreateEpisode,
  requestFetchEpisodes,
  requestFetchPatient,
} from '../services/appService';
import { AppActions } from './actions';

const episodeInitialForm = {
  dates: {},
  time: '',
  location: '',
  acuteness: '',
  painType: '',
  symptoms: '',
  triggers: '',
  foodImprovement: '',
  foodImpair: '',
  improvementFactor: '',
  medicine: '',
  medicineDosage: 0,
  medicineImprovement: '',
  period: '',
  periodNotes: '',
  notes: '',
};

const AppContext = createContext<AppContextDefaultValues>({
  steps: 9,
  currentStep: 0,
  setCurrentStep: () => null,
  handleFormChange: () => null,
  episodeFormState: episodeInitialForm,
  submitEpisode: () => null,
  dispatch: () => undefined,
  patient: undefined,
  episodes: undefined,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [steps, _] = useState(9);
  const [currentStep, setCurrentStep] = useState(0);
  const [episodeFormState, setEpisodeFormState] = useState(episodeInitialForm);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const toast = useToast();

  const handleFormChange = (payload: any) => {
    setEpisodeFormState((prevState: any) => {
      return Object.assign({ ...prevState, ...payload });
    });
  };

  const submitEpisode = () => {
    const parsedObject = Object.assign(episodeFormState, {
      dateTime: new Date(Object.keys(episodeFormState.dates)[0]),
      location: 'Esquerda',
    });

    Object.keys(parsedObject).map((key) => {
      if (typeof parsedObject[key] === 'string' && parsedObject[key] === '') {
        parsedObject[key] = null;
      }
    });
    delete parsedObject.dates;
    dispatch(AppActions.REQUEST_CREATE_EPISODE, parsedObject);
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
        handleToast(
          err.response.data.message != 'Validation failed'
            ? err.response.data.message
            : 'Tivemos um problema. Tente novamente mais tarde!',
          'danger'
        );
      });
  };

  const dispatch = async (
    action: string,
    payload?: any,
    assetId?: string
  ): Promise<any> => {
    const userId = localStorage.getItem('userId');
    switch (action) {
      case AppActions.REQUEST_CREATE_EPISODE:
        if (userId) {
          return handlePromise({
            promiseFromService: requestCreateEpisode(payload, userId),
            payload,
            successCallbackAction: (res) => reducer(action, payload, res),
          });
        }
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
    }
  };

  const reducer = (type: any, payload: any, response: any) => {
    switch (type) {
      case AppActions.REQUEST_FETCH_PATIENT:
        setPatient(response);
      case AppActions.REQUEST_FETCH_EPISODES:
        setEpisodes(response);
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
        setCurrentStep,
        steps,
        submitEpisode,
        episodes: episodes || undefined,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
