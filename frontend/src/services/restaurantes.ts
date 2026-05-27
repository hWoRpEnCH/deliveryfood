import api from '@/lib/api';
import type { PaginatedResponse, Restaurante } from '@/types';

export async function getRestaurantes(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
}) {
  const { data } = await api.get<PaginatedResponse<Restaurante>>('/restaurantes', {
    params,
  });
  return data;
}

export async function getRestaurante(id: string) {
  const { data } = await api.get<Restaurante>(`/restaurantes/${id}`);
  return data;
}

export async function createRestaurante(
  payload: Omit<Restaurante, '_id' | 'createdAt' | 'updatedAt'>,
) {
  const { data } = await api.post<Restaurante>('/restaurantes', payload);
  return data;
}

export async function updateRestaurante(
  id: string,
  payload: Partial<Omit<Restaurante, '_id'>>,
) {
  const { data } = await api.patch<Restaurante>(`/restaurantes/${id}`, payload);
  return data;
}

export async function deleteRestaurante(id: string) {
  await api.delete(`/restaurantes/${id}`);
}
