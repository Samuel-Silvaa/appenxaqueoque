import axios, { AxiosError, AxiosResponse, AxiosResponseHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { navigate } from 'navigationService';
import store from 'src/infra/app/store';
import { signOut } from 'src/infra/app/reducers/auth.reducer';

class SilentAuthError extends Error {
  constructor() {
    super('SILENT_AUTH_ERROR');
    this.name = 'SilentAuthError';
  }
}

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
  (error) => {
    const status = error.response?.status ?? error.request?.status;
    if (status === 401 || status === 400) {
      const token = store.getState().auth.token;
      if (token) {
        store.dispatch(signOut());
        navigate('login');
        return Promise.reject(new SilentAuthError());
      }
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
    if (error instanceof SilentAuthError) throw error;
    throw error;
  }
};

const post = async (url: string, payload: object): Promise<any> => {
  try {
    const { data } = await api.post(url, payload);
    return data;
  } catch (error) {
    if (error instanceof SilentAuthError) throw error;
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
    if (error instanceof SilentAuthError) throw error;
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
    if (error instanceof SilentAuthError) throw error;
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
    if (error instanceof SilentAuthError) throw error;
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
