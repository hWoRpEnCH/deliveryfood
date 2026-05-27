'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useUser } from '@/contexts/UserContext';
import { mapRestaurante } from '@/lib/mappers';
import { getRestaurantes } from '@/services/restaurantes';
import {
  desfavoritarRestaurante,
  favoritarRestaurante,
  getUsuario,
} from '@/services/usuarios';
import type { Restaurante, RestaurantUI } from '@/types';

export default function FavoritosPage() {
  const { user, userId } = useUser();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const [u, r] = await Promise.all([
        getUsuario(userId),
        getRestaurantes({ limit: 100 }),
      ]);
      setRestaurantes(r.data);
      const ids = new Set(
        (u.restaurantes_favoritos ?? []).map((f) =>
          typeof f === 'string' ? f : f._id,
        ),
      );
      setFavoritosIds(ids);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (restauranteId: string) => {
    if (!userId) {
      toast.error('Selecione um usuário em Conta');
      return;
    }
    try {
      if (favoritosIds.has(restauranteId)) {
        await desfavoritarRestaurante(userId, restauranteId);
        toast.success('Removido dos favoritos');
      } else {
        await favoritarRestaurante(userId, restauranteId);
        toast.success('Adicionado aos favoritos');
      }
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const favoritos: RestaurantUI[] = restaurantes
    .filter((r) => favoritosIds.has(r._id))
    .map(mapRestaurante);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Selecione um usuário para ver favoritos.</p>
        <Link href="/usuarios" className="text-[rgb(255,79,1)] font-medium hover:underline">
          Ir para Conta
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/usuarios"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Favoritos</h1>
      <p className="text-gray-500 mb-8">Olá, {user.nome}</p>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : favoritos.length === 0 ? (
        <p className="text-gray-500 mb-10">Nenhum favorito ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {favoritos.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Todos os restaurantes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantes.map((r) => (
          <div key={r._id} className="space-y-2">
            <RestaurantCard restaurant={mapRestaurante(r)} />
            <button
              type="button"
              onClick={() => toggle(r._id)}
              className="flex items-center gap-2 text-sm font-medium text-[rgb(255,79,1)]"
            >
              <Heart className={`w-4 h-4 ${favoritosIds.has(r._id) ? 'fill-current' : ''}`} />
              {favoritosIds.has(r._id) ? 'Desfavoritar' : 'Favoritar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
