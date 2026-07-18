import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { navigate } from "navigationService";
import store from "src/infra/app/store";
import { signOut, setToken } from "src/infra/app/reducers/auth.reducer";

class SilentAuthError extends Error {
  constructor() {
    super("SILENT_AUTH_ERROR");
    this.name = "SilentAuthError";
  }
}

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as any)?.apiUrl ||
  "http://127.0.0.1:8080/";

console.log(baseURL);

if (!baseURL.startsWith("https://") && !__DEV__) {
  // eslint-disable-next-line no-console
  console.warn(
    "[api] baseURL não usa HTTPS em build de produção. Configure EXPO_PUBLIC_API_URL.",
  );
}

const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifySubscribers(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status ?? error.request?.status;

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        store.dispatch(signOut());
        navigate("login");
        return Promise.reject(new SilentAuthError());
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${baseURL}session/refresh`, {
          refreshToken,
        });

        await SecureStore.setItemAsync("token", data.token);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        store.dispatch(
          setToken({ token: data.token, refreshToken: data.refreshToken }),
        );

        api.defaults.headers.common["Authorization"] = "Bearer " + data.token;
        originalRequest.headers["Authorization"] = "Bearer " + data.token;

        notifySubscribers(data.token);
        return api(originalRequest);
      } catch {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refreshToken");
        store.dispatch(signOut());
        navigate("login");
        return Promise.reject(new SilentAuthError());
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

const get = async <T>(
  url: string,
  params?: object,
  headers?: object,
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
    const message =
      (err.response?.data as any)?.error?.message ||
      (err.response?.data as any)?.message ||
      err.message ||
      "Unknown error";
    throw new Error(message);
  }
};

const put = async <T>(
  url: string,
  payload: object,
  headers?: object,
): Promise<T> => {
  try {
    const { data } = await api.put(
      url,
      payload,
      headers ? { headers } : undefined,
    );
    return data;
  } catch (error) {
    if (error instanceof SilentAuthError) throw error;
    const err = error as AxiosError;
    const message =
      (err.response?.data as any)?.error?.message ||
      (err.response?.data as any)?.message ||
      err.message ||
      "Unknown error";
    throw new Error(message);
  }
};

const patch = async <T>(
  url: string,
  payload: object,
  headers?: object,
): Promise<T> => {
  try {
    const { data } = await api.patch(url, payload, headers);
    return data;
  } catch (error) {
    if (error instanceof SilentAuthError) throw error;
    const err = error as AxiosError;
    const message =
      (err.response?.data as any)?.error?.message ||
      (err.response?.data as any)?.message ||
      err.message ||
      "Unknown error";
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
    const message =
      (err.response?.data as any)?.error?.message ||
      (err.response?.data as any)?.message ||
      err.message ||
      "Unknown error";
    throw new Error(message);
  }
};

export { get, patch, post, put, remove, api as wbsAPI };
