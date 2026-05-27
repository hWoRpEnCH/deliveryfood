import api from '@/lib/api';
import type { PaginatedResponse, Usuario } from '@/types';

export type UsuarioPayload = {
  nome: string;
  email: string;
  senha?: string;
  imagem?: string;
};

export async function getUsuarios(params?: { page?: number; limit?: number; search?: string }) {
  const { data } = await api.get<PaginatedResponse<Usuario>>('/usuarios', { params });
  return data;
}

export async function getUsuario(id: string) {
  const { data } = await api.get<Usuario>(`/usuarios/${id}`);
  return data;
}

export async function createUsuario(payload: {
  nome: string;
  email: string;
  senha: string;
}) {
  const { data } = await api.post<Usuario>('/usuarios', payload);
  return data;
}

export async function updateUsuario(id: string, payload: Partial<UsuarioPayload>) {
  const { data } = await api.patch<Usuario>(`/usuarios/${id}`, payload);
  return data;
}

export async function deleteUsuario(id: string) {
  await api.delete(`/usuarios/${id}`);
}

export async function favoritarRestaurante(usuarioId: string, restauranteId: string) {
  const { data } = await api.post<Usuario>(`/usuarios/${usuarioId}/favoritos`, {
    restaurante_id: restauranteId,
  });
  return data;
}

export async function desfavoritarRestaurante(usuarioId: string, restauranteId: string) {
  const { data } = await api.delete<Usuario>(
    `/usuarios/${usuarioId}/favoritos/${restauranteId}`,
  );
  return data;
}
