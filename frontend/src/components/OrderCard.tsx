'use client';

import {
  Clock,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  Package,
  Truck as TruckIcon,
} from 'lucide-react';
import type { ElementType } from 'react';
import type { Pedido, PedidoStatus, Restaurante } from '@/types';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  pedido: Pedido;
}

const statusConfig: Record<
  PedidoStatus,
  { label: string; icon: ElementType; color: string; bgColor: string }
> = {
  pendente: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  preparando: {
    label: 'Preparando',
    icon: Package,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  entrega: {
    label: 'Em entrega',
    icon: TruckIcon,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  entregue: {
    label: 'Entregue',
    icon: CheckCircle,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  cancelado: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};

function getRestaurante(ref: Restaurante | string): Restaurante | null {
  return typeof ref === 'string' ? null : ref;
}

export function OrderCard({ pedido }: OrderCardProps) {
  const config = statusConfig[pedido.status];
  const StatusIcon = config.icon;
  const restaurante = getRestaurante(pedido.restaurante_id);
  const orderDate = new Date(pedido.data_pedido);

  return (
    <div className="ifood-card overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-32 h-24 flex-shrink-0 bg-gray-100">
          {restaurante?.imagem && (
            <img
              src={restaurante.imagem}
              alt={restaurante.nome}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {restaurante?.nome ?? 'Restaurante'}
              </h3>
              <p className="text-sm text-gray-500">
                Pedido #{pedido._id.slice(-6).toUpperCase()}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                config.bgColor,
                config.color,
              )}
            >
              <StatusIcon className="w-4 h-4" />
              <span>{config.label}</span>
            </div>
          </div>

          <div className="space-y-1 mb-3">
            {pedido.itens.slice(0, 3).map((item, index) => (
              <p key={index} className="text-sm text-gray-600">
                {item.qtd}x {item.produto}
              </p>
            ))}
            {pedido.itens.length > 3 && (
              <p className="text-sm text-gray-400">+{pedido.itens.length - 3} itens</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {orderDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Total</p>
              <p className="text-lg font-bold text-[rgb(255,79,1)]">
                R$ {pedido.valor_total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
