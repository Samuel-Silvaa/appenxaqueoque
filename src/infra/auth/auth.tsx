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

const AuthContext = createContext<AuthContextDefaultValues>({
  dispatch: () => null,
  form: {},
  handleFormChange: () => null,
  signOut: () => null,
  session: undefined,
  isLogged: false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<object>({});
  const [isLogged, setIsLogged] = useState(true);
  const [session, setSession] = useState<LogInResponse>();
  const toast = useToast();

  const signOut = () => {
    localStorage.clear();
    setFormState({});
    window.dispatchEvent(new Event('storage'));
  };

  const setLocalStorageWelcomeAttr = () => {
    localStorage.setItem('welcome', JSON.stringify('true'));
    window.dispatchEvent(new Event('storage'));
  };

  const handleFormChange = (payload: any) => {
    setFormState((prevState: any) => {
      return Object.assign({ ...prevState, ...payload });
    });
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
  }: {
    promiseFromService: Promise<any>;
    payload: any;
    successCallbackAction?: (payload: any) => void;
  }) => {
    handleToast('Processando...', 'warning');
    await promiseFromService
      .then((res) => {
        successCallbackAction(res);
        handleToast('Tudo certo!', 'success');
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

  const dispatch = async (action: string, payload: any): Promise<void> => {
    switch (action) {
      case AuthenticationActions.REQUEST_LOGIN:
        handlePromise({
          promiseFromService: requestHandleLogIn(payload),
          payload,
          successCallbackAction: (res) => reducer(action, payload, res),
        });
        break;
      case AuthenticationActions.REQUEST_SIGNUP:
        handlePromise({
          promiseFromService: requestHandleSingUp(payload),
          payload,
          successCallbackAction: (res) => reducer(action, payload, res),
        });
        break;
      case AuthenticationActions.REQUEST_CREATE_PATIENT:
        handlePromise({
          promiseFromService: requestHandleCreatePatient(payload),
          payload,
          successCallbackAction: (res) => reducer(action, payload, res),
        });
        break;
      case AuthenticationActions.REQUEST_CREATE_PHYSICIAN:
        handlePromise({
          promiseFromService: requestHandleCreatePhysician(payload),
          payload,
          successCallbackAction: (res) => reducer(action, payload, res),
        });
        break;
    }
  };

  const handleSetLocalHeaderData = (data: {
    token: string;
    refreshToken: string;
    userId: string;
  }) => {
    const { token, refreshToken, userId } = data;

    if (token) localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (userId) localStorage.setItem('userId', userId);
    window.dispatchEvent(new Event('storage'));
  };

  const reducer = (
    type: AuthenticationActions,
    payload: any,
    response: any
  ) => {
    const { user, token, refreshToken } = response;

    if (token || refreshToken) {
      handleSetLocalHeaderData({ token, refreshToken, userId: user.id });
    }

    switch (type) {
      case AuthenticationActions.REQUEST_LOGIN:
        delete payload.password;
        setIsLogged(true);
        setSession(response);
        handleFormChange({ id: user.id, session: response });
        break;
      case AuthenticationActions.REQUEST_SIGNUP:
        delete payload.password;
        handleFormChange({ ...payload, id: user.id });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
