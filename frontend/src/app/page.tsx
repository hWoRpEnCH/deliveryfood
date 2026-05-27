'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { RestaurantCard } from '@/components/RestaurantCard';
import { CategoryCard } from '@/components/CategoryCard';
import { RestaurantSkeleton } from '@/components/Skeleton';
import { categories } from '@/data/categories';
import { mapRestaurante } from '@/lib/mappers';
import { getRestaurantes } from '@/services/restaurantes';
import type { RestaurantUI } from '@/types';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<RestaurantUI[]>([]);
  const [filtered, setFiltered] = useState<RestaurantUI[]>([]);

  useEffect(() => {
    getRestaurantes({ limit: 50 })
      .then((res) => {
        const mapped = res.data.filter((r) => r.aberto !== false).map(mapRestaurante);
        setRestaurants(mapped);
        setFiltered(mapped);
      })
      .catch(() => setRestaurants([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFiltered(restaurants);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFiltered(
      restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q),
      ),
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <section className="relative bg-gradient-to-br from-[rgb(255,79,1)] to-[rgb(220,68,0)] text-white py-16 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fadeIn">
            O seu delivery favorito
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-8">
            Descubra os melhores restaurantes da sua região
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar restaurantes ou categorias..."
              className="w-full pl-12 pr-28 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[rgb(255,79,1)] hover:bg-[rgb(220,68,0)] text-white px-6 py-2 rounded-lg font-medium"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-4 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
          <Link
            href="/restaurantes"
            className="flex items-center gap-1 text-[rgb(255,79,1)] font-medium"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Restaurantes em destaque</h2>
            <p className="text-gray-500 mt-1">Peça agora com entrega rápida</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RestaurantSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            Nenhum restaurante encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
