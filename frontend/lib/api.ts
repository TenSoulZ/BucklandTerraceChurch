import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000'),
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', api.defaults.baseURL);
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000')}/api/v1/auth/refresh/`, {
          refresh: refreshToken
        });
        const { access } = res.data;

        useAuthStore.getState().setAccessToken(access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Typed Helper Methods
export const get = <T>(url: string, config?: any): Promise<T> =>
  api.get(url, config).then((res) => res.data);

export const post = <T>(url: string, data?: any, config?: any): Promise<T> =>
  api.post(url, data, config).then((res) => res.data);

export const put = <T>(url: string, data?: any, config?: any): Promise<T> =>
  api.put(url, data, config).then((res) => res.data);

export const patch = <T>(url: string, data?: any, config?: any): Promise<T> =>
  api.patch(url, data, config).then((res) => res.data);

export const del = <T>(url: string, config?: any): Promise<T> =>
  api.delete(url, config).then((res) => res.data);

export default api;
