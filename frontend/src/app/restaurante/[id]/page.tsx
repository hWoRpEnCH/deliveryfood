'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MenuItemSkeleton } from '@/components/Skeleton';
import { useCart } from '@/contexts/CartContext';
import { mapRestaurante, mapRestauranteCardapio } from '@/lib/mappers';
import { getRestaurante } from '@/services/restaurantes';
import type { MenuItemUI, RestaurantUI } from '@/types';

export default function RestauranteDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getItemCount } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantUI | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemUI[]>([]);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    getRestaurante(id)
      .then((data) => {
        setRestaurant(mapRestaurante(data));
        setMenuItems(mapRestauranteCardapio(data));
      })
      .catch((e) => {
        setError((e as Error).message);
        setRestaurant(null);
        setMenuItems([]);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const itemCount = getItemCount();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-6">{error ?? 'Restaurante não encontrado'}</p>
        <Link href="/restaurantes" className="text-[rgb(255,79,1)] font-medium hover:underline">
          Voltar aos restaurantes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link
        href="/restaurantes"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <div className="ifood-card overflow-hidden mb-8">
        <div className="relative aspect-[21/9] sm:aspect-[3/1]">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full font-medium text-gray-900">
                Fechado no momento
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-sm font-medium text-[rgb(255,79,1)] mb-1">{restaurant.category}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[rgb(255,79,1)] font-semibold">
              Taxa: R$ {restaurant.deliveryFee.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
          </div>
          {restaurant.minOrder > 0 && (
            <p className="text-sm text-gray-500 mt-3">
              Pedido mínimo: R$ {restaurant.minOrder.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cardápio</h2>

      {menuItems.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhum item no cardápio.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} menuItem={item} restaurant={restaurant} />
          ))}
        </div>
      )}

      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <Link
            href="/carrinho"
            className="flex items-center justify-center gap-3 w-full py-4 ifood-primary rounded-xl font-semibold shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Ver carrinho ({itemCount})
          </Link>
        </div>
      )}
    </div>
  );
}
