import React, { createContext, ReactNode, useContext, useState } from "react";

import { AppContextDefaultValues, Episode } from "../@types/app.types";
import { ToastOptions, useToast } from "react-native-toast-notifications";
import {
  requestFetchReportEpisodesRange,
  requestGeneratePdfReport,
} from "../services/appService";
import { AppActions } from "./actions";
import * as SecureStore from "expo-secure-store";
import { addHours } from "date-fns";
import {
  handleCreateEpisode,
  handleStepForward,
  handleUpdateEpisode,
} from "./reducers/app.reducer";
import { useDispatch, useSelector } from "react-redux";
import { appStateSelector, authSelector } from "./selectors";
import { useAsyncAppDispatch } from "./store";

const AppContext = createContext<AppContextDefaultValues>({
  isLoading: false,
  validateStepForward: () => false,
  handleToast: () => {},
  submitEpisode: () => new Promise(() => {}),
  dispatch: () => new Promise(() => {}),
  reports: undefined,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const asyncDispatch = useAsyncAppDispatch();
  const auth = useSelector(authSelector);
  const appState = useSelector(appStateSelector);

  const validateStepForward = (nextStep: number): boolean => {
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
          "Preencha ao menos a data do episódio para continuar!",
          "danger",
        );
        return false;
      } else {
        const parsedObject: any = {
          ...appState.episode,
          dateTime: addHours(
            new Date(Object.keys(appState.episode.dates)[0]),
            9,
          ),
          period: appState.episode.period === "true" ? true : false,
          combinedDosage: appState.episode.combinedDosage
            ? parseInt(appState.episode.combinedDosage)
            : null,
          location: Array.isArray(appState.episode.location)
            ? appState.episode.location.join(",")
            : appState.episode.location
              ? appState.episode.location
              : null,
          triggers: Array.isArray(appState.episode.triggers)
            ? appState.episode.triggers.join(",")
            : appState.episode.triggers
              ? appState.episode.triggers
              : null,
          haloSymptoms: Array.isArray(appState.episode.haloSymptoms)
            ? appState.episode.haloSymptoms.join(",")
            : appState.episode.haloSymptoms
              ? appState.episode.haloSymptoms
              : null,
          improvementFactor: Array.isArray(appState.episode.improvementFactor)
            ? appState.episode.improvementFactor.join(",")
            : appState.episode.improvementFactor
              ? appState.episode.improvementFactor
              : null,
          symptoms: Array.isArray(appState.episode.symptoms)
            ? appState.episode.symptoms.join(",")
            : appState.episode.symptoms
              ? appState.episode.symptoms
              : null,
          impairFactor: Array.isArray(appState.episode.impairFactor)
            ? appState.episode.impairFactor.join(",")
            : appState.episode.impairFactor
              ? appState.episode.impairFactor
              : null,
        };

        Object.keys(parsedObject).map((key) => {
          if (
            typeof parsedObject[key] === "string" &&
            parsedObject[key] === ""
          ) {
            parsedObject[key] = null;
          }
        });
        delete parsedObject.dates;

        if (parsedObject.isEdition) {
          delete parsedObject.isEdition;

          if (!appState.episode.id) {
            handleToast(
              "Erro ao editar: ID do episódio não encontrado.",
              "danger",
            );
            return false;
          }

          console.log(
            "[submitEpisode] UPDATE payload:",
            parsedObject,
            "id:",
            appState.episode.id,
          );

          const res = await asyncDispatch(
            handleUpdateEpisode({
              payload: parsedObject,
              id: appState.episode.id,
            }),
          );

          console.log(
            "[submitEpisode] UPDATE result:",
            res.meta.requestStatus,
            res.payload,
          );

          if (res.meta.requestStatus == "fulfilled") {
            const data = res.payload;

            return {
              ...data,
              id: data.id ?? appState.episode.id,
              triggers: Array.isArray(data.triggers)
                ? data.triggers
                : String(data.triggers ?? "")
                    .split(",")
                    .filter(Boolean),
              improvementFactor: Array.isArray(data.improvementFactor)
                ? data.improvementFactor
                : String(data.improvementFactor ?? "")
                    .split(",")
                    .filter(Boolean),
              symptoms: Array.isArray(data.symptoms)
                ? data.symptoms
                : String(data.symptoms ?? "")
                    .split(",")
                    .filter(Boolean),
              haloSymptoms: Array.isArray(data.haloSymptoms)
                ? data.haloSymptoms
                : String(data.haloSymptoms ?? "")
                    .split(",")
                    .filter(Boolean),
              impairFactor: Array.isArray(data.impairFactor)
                ? data.impairFactor
                : String(data.impairFactor ?? "")
                    .split(",")
                    .filter(Boolean),
            };
          }

          const errMsg =
            (res as any).error?.message ||
            "Erro ao editar episódio. Tente novamente.";
          handleToast(errMsg, "danger");
          return false;
        } else {
          delete parsedObject.id;
          delete parsedObject.isEdition;
          console.log(`SUBMIT`, parsedObject);

          const res = await asyncDispatch(
            handleCreateEpisode({
              payload: parsedObject,
              id: auth.user?.id ?? "",
            }),
          );

          if (res.meta.requestStatus == "fulfilled") {
            const data = res.payload as Episode;

            return {
              ...data,
              triggers: String(data.triggers).split(","),
              improvementFactor: String(data.improvementFactor).split(","),
              symptoms: String(data.symptoms).split(","),
              haloSymptoms: String(data.haloSymptoms).split(","),
              impairFactor: String(data.impairFactor).split(","),
            };
          }
        }
      }
    } catch (err) {
      console.log(err);
      handleToast((err as string) || "erro inesperado", "danger");
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
        if (isShowingToast) handleToast("Tudo certo!", "success");
      })
      .catch((err) => {
        setIsLoading(false);
        handleToast(
          err.response.data.message != "Validation failed"
            ? err.response.data.message
            : "Tivemos um problema. Tente novamente mais tarde!",
          "danger",
        );
      });
  };

  const appDispatch = async (
    action: string,
    payload?: any,
    assetId?: string,
  ): Promise<any> => {
    const userId = await SecureStore.getItemAsync("userId");
    switch (action) {
      case AppActions.REQUEST_GENERATE_PDF_REPORT:
        return handlePromise({
          promiseFromService: requestGeneratePdfReport({
            id: payload.id,
            physicianEmail: payload.physicianEmail,
          }),
          payload,
          successCallbackAction: (res) => {
            toast.show(
              "Um pdf do relátorio foi enviado ao médico! Verifique sua caixa de spam",
              {
                type: "success",
              },
            );
          },
          isShowingToast: true,
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

  const reducer = (type: any, payload: any, response: any) => {};

  return (
    <AppContext.Provider
      value={{
        dispatch: appDispatch,
        validateStepForward,
        submitEpisode,
        isLoading,
        handleToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
