import axios from 'axios';
import type { ApiError } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data as ApiError | undefined;
    const apiMessage = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message;
    const message = apiMessage ?? error.message ?? 'Erro na requisicao';
    return Promise.reject(new Error(message));
  },
);

export default api;
