import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  AppContextDefaultValues,
  Episode,
  ImprovementFactor,
  Patient,
  Trigger,
} from '../@types/app.types';
import { ToastOptions, useToast } from 'react-native-toast-notifications';
import {
  requestCreateEpisode,
  requestFetchEpisodes,
  requestFetchPatient,
} from '../services/appService';
import { AppActions } from './actions';
import { useNavigation } from '@react-navigation/native';

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
  validateStepForward: () => false,
  validateAutomaticEpisodeStepNavigation: () => false,
  handleFormChange: () => null,
  episodeFormState: episodeInitialForm,
  submitEpisode: () => null,
  dispatch: () => undefined,
  patient: undefined,
  episodes: undefined,
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
  const [pageTitle, setPageTitle] = useState();
  const toast = useToast();

  const ValidateFormEnabledAndReturnBehavior = (
    condition = true,
    nextStep = currentStep + 1,
    showToast = true
  ): boolean => {
    if (condition) {
      setCurrentStep(nextStep);
      return true;
    }
    if (showToast)
      handleToast(
        'Preencha todos os campos obrigatórios antes de continuar!',
        'danger'
      );
    return false;
  };

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
      default:
        return '';
    }
  };

  useEffect(() => {
    setPageTitle(episodeTitle());
  }, [currentStep]);

  const validateAutomaticEpisodeStepNavigation = (
    nextStep?: number
  ): boolean => {
    switch (currentStep) {
      case 0:
        if (!!episodeFormState.dates && !!episodeFormState.time)
          return ValidateFormEnabledAndReturnBehavior(true, nextStep, false);
      case 1:
        if (!!episodeFormState.dates && !!episodeFormState.time)
          return ValidateFormEnabledAndReturnBehavior(true, nextStep, false);
      case 2:
        if (!!episodeFormState.acuteness)
          return ValidateFormEnabledAndReturnBehavior(true, nextStep, false);
      case 3:
        if (!!episodeFormState.painType)
          return ValidateFormEnabledAndReturnBehavior(true, nextStep, false);
      case 4:
        if (!!episodeFormState.symptoms)
          return ValidateFormEnabledAndReturnBehavior(true, nextStep, false);
      case 5:
        if (
          episodeFormState.triggers != Trigger.FOOD &&
          !!episodeFormState.triggers
        )
          return ValidateFormEnabledAndReturnBehavior(true, nextStep, false);
      default:
        return false;
    }
  };

  const validateFullfilledForm = (nextStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return ValidateFormEnabledAndReturnBehavior(
          !!episodeFormState.dates && !!episodeFormState.time,
          nextStep
        );
      case 1:
        return ValidateFormEnabledAndReturnBehavior(
          !!episodeFormState.dates && !!episodeFormState.time,
          nextStep
        );
      case 2:
        return ValidateFormEnabledAndReturnBehavior(
          !!episodeFormState.acuteness,
          nextStep
        );
      case 3:
        return ValidateFormEnabledAndReturnBehavior(
          !!episodeFormState.painType,
          nextStep
        );
      case 4:
        return ValidateFormEnabledAndReturnBehavior(
          !!episodeFormState.symptoms,
          nextStep
        );
      case 5:
        return ValidateFormEnabledAndReturnBehavior(
          episodeFormState.triggers == Trigger.FOOD
            ? !!episodeFormState.triggers && !!episodeFormState.foodImpair
            : !!episodeFormState.triggers,
          nextStep
        );
      case 6:
        return ValidateFormEnabledAndReturnBehavior(
          episodeFormState.improvementFactor == ImprovementFactor.MEDICINE
            ? !!episodeFormState.improvementFactor &&
                !!episodeFormState.medicine &&
                !episodeFormState.medicineDosage &&
                !episodeFormState.medicineImprovement
            : episodeFormState.improvementFactor == ImprovementFactor.FOOD
            ? !!episodeFormState.improvementFactor &&
              !!episodeFormState.foodImprovement
            : !!episodeFormState.improvementFactor,
          nextStep
        );
      case 7:
        return ValidateFormEnabledAndReturnBehavior(
          !!episodeFormState.period,
          nextStep
        );
      default:
        return false;
    }
  };

  const validateStepForward = (nextStep: number): boolean => {
    if (nextStep > currentStep) return validateFullfilledForm(nextStep);
    if (nextStep < currentStep) {
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
            successCallbackAction: (res) => {
              dispatch(AppActions.REQUEST_FETCH_EPISODES);
              navigation.navigate('Success', res);
              setCurrentStep(0);
              setEpisodeFormState(episodeInitialForm);
            },
            isShowingToast: true,
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
        validateStepForward,
        validateAutomaticEpisodeStepNavigation,
        steps,
        submitEpisode,
        episodes: episodes || undefined,
        pageTitle: pageTitle || undefined,
        setPageTitle: setPageTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
