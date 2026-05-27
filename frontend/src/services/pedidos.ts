import api from '@/lib/api';
import type { ItemPedido, PaginatedResponse, Pedido } from '@/types';

export async function getPedidos(params?: {
  page?: number;
  limit?: number;
  usuario_id?: string;
  restaurante_id?: string;
}) {
  const { data } = await api.get<PaginatedResponse<Pedido>>('/pedidos', { params });
  return data;
}

export async function getPedido(id: string) {
  const { data } = await api.get<Pedido>(`/pedidos/${id}`);
  return data;
}

export async function createPedido(payload: {
  usuario_id: string;
  restaurante_id: string;
  itens: ItemPedido[];
  data_pedido?: string;
}) {
  const { data } = await api.post<Pedido>('/pedidos', payload);
  return data;
}

export async function updatePedido(
  id: string,
  payload: Partial<{
    usuario_id: string;
    restaurante_id: string;
    itens: ItemPedido[];
    data_pedido: string;
  }>,
) {
  const { data } = await api.patch<Pedido>(`/pedidos/${id}`, payload);
  return data;
}

export async function deletePedido(id: string) {
  await api.delete(`/pedidos/${id}`);
}
