import axios, { AxiosError, AxiosResponse, AxiosResponseHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://192.168.1.66:8080/',
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  (error: AxiosError) => {
    debugger;
    Promise.reject(error).then(alert);
  }
);

// api.interceptors.response.use(
//   (config) => config,
//   (error) => {
//     if (error.request?.status === 401) {
//       localStorage.clear();
//       window.location.href = '/login';
//       window.dispatchEvent(new Event('storage'));
//     } else {
//       Promise.ject(error);
//     }
//   }
// );

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
    const { data } =  await api.post(url, payload);
    return data;
  } catch (error) {
    const err = error as AxiosError;

    throw err.response?.data ;
  }
};

const put = async <T>(url: string, payload: object, headers?: object): Promise<T> => {
  return await api.put(url, payload, headers ? { headers } : undefined);
};

const patch = async <T>(
  url: string,
  payload: object,
  headers?: object
): Promise<T> => {
  return await api.patch(url, payload, headers);
};

const remove = async <T>(url: string, body?: object): Promise<T> => {
  return await api.delete(url, body);
};

export { get, patch, post, put, remove, api as wbsAPI };
