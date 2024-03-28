import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
});

api.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] =
        'Bearer ' + localStorage.getItem('token');
    }
    return config;
  },
  (error: AxiosError) => {
    Promise.reject(error);
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

const post = async <T>(url: string, payload: object): Promise<T> => {
  const { data } = await api.post(url, payload);
  return data;
};

const put = async <T>(url: string, payload: object): Promise<T> => {
  const { data } = await api.put(url, payload);
  return data;
};

const patch = async <T>(
  url: string,
  payload: object,
  headers?: object
): Promise<T> => {
  const { data } = await api.patch(url, payload, headers);
  return data;
};

const remove = async <T>(url: string, body?: object): Promise<T> => {
  const { data } = await api.delete(url, body);
  return data;
};

export { get, patch, post, put, remove, api as wbsAPI };
