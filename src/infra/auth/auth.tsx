import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  requestHandleLogIn,
  requestHandleSingUp,
  requestHandleCreatePatient,
  requestHandleCreatePhysician,
} from '../services/authService';

import { AuthenticationActions } from './auth.actions';
import { ToastOptions, useToast } from 'react-native-toast-notifications';
import { AuthContextDefaultValues, LogInResponse } from '../@types/auth.types';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext<AuthContextDefaultValues>({
  isAuthLoading: false,
  dispatch: () => null,
  form: {},
  handleFormChange: () => null,
  signOut: () => null,
  session: undefined,
  isLogged: false,
  setIsLoggedTrue: () => null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<{
    token?: string;
    refreshToken?: string;
    user?: { email: string; password: string; userType?: string };
  }>({
    token: undefined,
    refreshToken: undefined,
    user: undefined,
  });
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [session, setSession] = useState<LogInResponse>();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();

  const signOut = async () => {
    await SecureStore.deleteItemAsync('welcome');
    setFormState({});
    setIsLogged(false);
  };

  const setIsLoggedTrue = () => {
    setIsLogged(true);
  };

  const setLocalStorageWelcomeAttr = async () => {
    await SecureStore.setItemAsync('welcome', JSON.stringify('true'));
  };

  const handleFormChange = (payload: any) => {
    setFormState((prevState: any) => {
      return Object.assign({ ...prevState, ...payload });
    });
  };



  const handleToast = (message: string, type: string) => {
    const toastOptions: ToastOptions = {
      type: type,
    };
    toast.show(message, toastOptions);
  };

  const handlePromise = async ({
    promiseFromService,
    payload,
    successCallbackAction = () => {},
    showToast = false,
  }: {
    promiseFromService: Promise<any>;
    payload: any;
    successCallbackAction?: (payload: any) => void;
    showToast?: boolean;
  }) => {
    setIsAuthLoading(true);
    await promiseFromService
      .then((res) => {
        setIsAuthLoading(false);
        successCallbackAction(res.data);
        if (showToast) handleToast('Tudo certo!', 'success');
      })
      .catch((err) => {
        setIsAuthLoading(false);
        handleToast(
          err.response.data.message != 'Validation failed'
            ? err.response.data.message
            : 'Tivemos um problema. Tente novamente mais tarde!',
          'danger'
        );
      });
  };

  const dispatch = async (action: string, payload: any): Promise<void> => {
    switch (action) {

      case AuthenticationActions.REQUEST_SIGNUP:
        handlePromise({
          promiseFromService: requestHandleSingUp({
            email: payload.email,
            password: payload.password,
            userType: 'PATIENT',
          }),
          payload,
          successCallbackAction: (res) => {
            // dispatch(AuthenticationActions.REQUEST_LOGIN, {
            //   email: payload.email,
            //   password: payload.password,
            // });
          },
          showToast: true,
        });
        break;
      // case AuthenticationActions.REQUEST_CREATE_PATIENT:
      //   handlePromise({
      //     promiseFromService: requestHandleCreatePatient(payload),
      //     payload,
      //     successCallbackAction: (res) => {
      //       if (formState.user)
      //         dispatch(AuthenticationActions.REQUEST_LOGIN, {
      //           email: payload.email,
      //           password: formState?.user.password,
      //         });
      //       return reducer(action, payload, res);
      //     },
      //     showToast: true,
      //   });
      //   break;
      case AuthenticationActions.REQUEST_CREATE_PHYSICIAN:
        handlePromise({
          promiseFromService: requestHandleCreatePhysician(payload),
          payload,
          successCallbackAction: (res) => reducer(action, payload, res),
        });
        break;
    }
  };

  const handleSetLocalHeaderData = async (data: {
    token: string;
    refreshToken: string;
    userId: string;
  }) => {
    const { token, refreshToken, userId } = data;
    if (token) await SecureStore.setItemAsync('token', token);
    if (refreshToken)
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    if (userId) await SecureStore.setItemAsync('userId', userId);
  };

  const reducer = async (
    type: AuthenticationActions,
    payload: any,
    response: any
  ) => {
    const { user, token, refreshToken } = response;

    if (token || refreshToken) {
      handleSetLocalHeaderData({
        token,
        refreshToken,
        userId: user ? user.id : null,
      });
    }

    switch (type) {
      // case AuthenticationActions.REQUEST_LOGIN:
      //   if (user) {
      //     setSession(response);
      //     handleFormChange({ id: user.id, session: response });

      //     const isWelcome = await SecureStore.getItemAsync('welcome');
      //     if (isWelcome) {
      //       navigation.navigate('welcome' as any as never);
      //       delete payload.password;
      //     } else {
      //       setIsLogged(true);
      //       delete payload.password;
      //     }
      //   } else {
      //     handleFormChange({
      //       user: { email: payload.email, password: payload.password },
      //       session: response,
      //     });

      //     navigation.navigate('patient' as any as never);
      //   }
      //   break;
      case AuthenticationActions.REQUEST_SIGNUP:
        delete payload.password;
        handleFormChange({ ...payload });
        break;
      case AuthenticationActions.REQUEST_CREATE_PATIENT:
        setLocalStorageWelcomeAttr();
        handleFormChange({ ...payload, user: response });

        break;
      case AuthenticationActions.REQUEST_CREATE_PHYSICIAN:
        setLocalStorageWelcomeAttr();
        handleFormChange({ ...payload, user: response });
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        dispatch,
        form: formState,
        handleFormChange,
        signOut,
        session,
        isLogged,
        setIsLoggedTrue,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
