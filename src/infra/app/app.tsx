import React, { createContext, ReactNode, useContext, useState } from 'react';

import { ToastOptions, useToast } from 'react-native-toast-notifications';
import { AppContextDefaultValues } from '../@types/app.types';

const AppContext = createContext<AppContextDefaultValues>({
  steps: 9,
  currentStep: 0,
  setCurrentStep: () => null,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [steps, setSteps] = useState(9);
  const [currentStep, setCurrentStep] = useState(0);
  //   const toast = useToast();

  //   const handleFormChange = (payload: any) => {
  //     setFormState((prevState: any) => {
  //       return Object.assign({ ...prevState, ...payload });
  //     });
  //   };

  //   const handleToast = (message: string, type: string) => {
  //     toast.hideAll();
  //     const toastOptions: ToastOptions = {
  //       animationDuration: 400,
  //       animationType: 'slide-in',
  //       placement: 'top',
  //       duration: 2000,
  //       type: type,
  //     };
  //     toast.show(message, toastOptions);
  //   };

  //   const handlePromise = async ({
  //     promiseFromService,
  //     payload,
  //     successCallbackAction = () => {},
  //   }: {
  //     promiseFromService: Promise<any>;
  //     payload: any;
  //     successCallbackAction?: (payload: any) => void;
  //   }) => {
  //     handleToast('Processando...', 'warning');
  //     await promiseFromService
  //       .then((res) => {
  //         successCallbackAction(res);
  //         handleToast('Tudo certo!', 'success');
  //       })
  //       .catch((err) => {
  //         handleToast(
  //           err.response.data.message != 'Validation failed'
  //             ? err.response.data.message
  //             : 'Tivemos um problema. Tente novamente mais tarde!',
  //           'danger'
  //         );
  //       });
  //   };

  //   const dispatch = async (action: string, payload: any): Promise<void> => {
  //     switch (action) {
  //       case '0':
  //         handlePromise({
  //           promiseFromService: requestHandleCreatePhysician(payload),
  //           payload,
  //           successCallbackAction: (res) => reducer(action, payload, res),
  //         });
  //         break;
  //     }
  //   };

  //   const reducer = (type: any, payload: any, response: any) => {
  //     switch (type) {
  //       case 0:
  //         setLocalStorageWelcomeAttr();
  //         handleFormChange({ ...payload, user: response });
  //         break;
  //     }
  //   };

  return (
    <AppContext.Provider value={{ steps, currentStep, setCurrentStep }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
