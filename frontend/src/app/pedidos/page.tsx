'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock } from 'lucide-react';
import { OrderCard } from '@/components/OrderCard';
import { OrderSkeleton } from '@/components/Skeleton';
import { useUser } from '@/contexts/UserContext';
import { getPedidos } from '@/services/pedidos';
import type { Pedido, PedidoStatus } from '@/types';
import { cn } from '@/lib/utils';

type StatusFilter = PedidoStatus | 'all';

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'entrega', label: 'Em entrega' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

const ACTIVE_STATUSES: PedidoStatus[] = ['pendente', 'preparando', 'entrega'];

export default function PedidosPage() {
  const { user, userId } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadPedidos = useCallback(async () => {
    if (!userId) {
      setPedidos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await getPedidos({ limit: 100, usuario_id: userId });
      setPedidos(res.data);
    } catch {
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  const filteredPedidos =
    statusFilter === 'all'
      ? pedidos
      : pedidos.filter((p) => p.status === statusFilter);

  const activeOrders = pedidos.filter((p) => ACTIVE_STATUSES.includes(p.status));

  const countByStatus = (status: StatusFilter) => {
    if (status === 'all') return pedidos.length;
    return pedidos.filter((p) => p.status === status).length;
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
        <p className="text-gray-500 mb-6">Selecione um usuário para ver seus pedidos.</p>
        <Link href="/usuarios" className="px-6 py-3 ifood-primary rounded-xl font-medium inline-block">
          Ir para Conta
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
        <p className="text-gray-500">
          Pedidos de <span className="font-medium text-gray-700">{user.nome}</span>
        </p>
      </div>

      {activeOrders.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-[rgb(255,235,229)] to-yellow-50 rounded-xl border border-[rgb(255,79,1)]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[rgb(255,79,1)] rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Você tem {activeOrders.length} pedido
                {activeOrders.length > 1 ? 's' : ''} ativo
                {activeOrders.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600">Acompanhe o status em tempo real abaixo</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              statusFilter === filter.value
                ? 'bg-[rgb(255,79,1)] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            )}
          >
            {filter.label}
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                statusFilter === filter.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600',
              )}
            >
              {countByStatus(filter.value)}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : filteredPedidos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg mb-2">Nenhum pedido encontrado</p>
          <p className="text-gray-500 mb-6">Os pedidos aparecerão aqui após a compra</p>
          <Link href="/restaurantes" className="px-6 py-3 ifood-primary rounded-xl font-medium inline-block">
            Ver restaurantes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPedidos.map((pedido) => (
            <OrderCard key={pedido._id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  );
}
