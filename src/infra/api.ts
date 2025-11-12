import axios, { AxiosError, AxiosResponse, AxiosResponseHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { navigate } from 'navigationService';
import { useToast } from 'react-native-toast-notifications';
import store from './app/store';
import { signOut } from './app/reducers/auth.reducer';

const api = axios.create({
  //baseURL: 'http://127.0.0.1:8080/',
  baseURL: 'http://ec2-3-84-114-114.compute-1.amazonaws.com:8080/',
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  (error: AxiosError) => {
    debugger;
  }
);

api.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Limpar token e dados do usuário do SecureStore
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('userId');

      // Limpar estado do Redux
      store.dispatch(signOut());

      // Navegar para a tela de login
      navigate('login');
    }
    return Promise.reject(error);
  }
);

const get = async <T>(
  url: string,
  params?: object,
  headers?: object
): Promise<T> => {
  try {
    const { data } = await api.get(url, { headers: headers, params: params });
    return data;
  } catch (error) {
    throw error;
  }
};

const post = async (url: string, payload: object): Promise<any> => {
  try {
    const { data } = await api.post(url, payload);
    return data;
  } catch (error) {
    const err = error as AxiosError;

    // throw a clean error message if present
    const message =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error';

    throw new Error(message);
  }
};

const put = async <T>(
  url: string,
  payload: object,
  headers?: object
): Promise<T> => {
  try {
    const { data } = await api.put(
      url,
      payload,
      headers ? { headers } : undefined
    );
    return data;
  } catch (error) {
    const err = error as AxiosError;

    // throw a clean error message if present
    const message =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error';

    throw new Error(message);
  }
};

const patch = async <T>(
  url: string,
  payload: object,
  headers?: object
): Promise<T> => {
  try {
    const { data } = await api.patch(url, payload, headers);
    return data;
  } catch (error) {
    const err = error as AxiosError;

    // throw a clean error message if present
    const message =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error';

    throw new Error(message);
  }
};

const remove = async <T>(url: string, body?: object): Promise<T> => {
  try {
    const { data } = await api.delete(url, body);
    return data;
  } catch (error) {
    const err = error as AxiosError;

    // throw a clean error message if present
    const message =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error';

    throw new Error(message);
  }
};

export { get, patch, post, put, remove, api as wbsAPI };
