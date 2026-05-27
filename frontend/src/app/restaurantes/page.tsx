'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { RestaurantCard } from '@/components/RestaurantCard';
import { CategoryCard } from '@/components/CategoryCard';
import { RestaurantSkeleton } from '@/components/Skeleton';
import { categories, categorySlugMap } from '@/data/categories';
import { mapRestaurante } from '@/lib/mappers';
import { getRestaurantes } from '@/services/restaurantes';
import type { RestaurantUI } from '@/types';

function RestaurantesContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria');

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoriaParam);
  const [restaurants, setRestaurants] = useState<RestaurantUI[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantUI[]>([]);

  useEffect(() => {
    setSelectedCategory(categoriaParam);
  }, [categoriaParam]);

  const loadRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiCategoria = selectedCategory
        ? categorySlugMap[selectedCategory] ?? selectedCategory
        : undefined;
      const res = await getRestaurantes({
        limit: 100,
        search: searchQuery.trim() || undefined,
        categoria: apiCategoria,
      });
      const mapped = res.data.map(mapRestaurante);
      setRestaurants(mapped);
    } catch {
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredRestaurants(
      restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q),
      ),
    );
  }, [restaurants, searchQuery]);

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(selectedCategory === categorySlug ? null : categorySlug);
  };

  const activeCategory = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurantes</h1>
        <p className="text-gray-500">Explore todos os restaurantes disponíveis</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar restaurantes..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[rgb(255,79,1)] focus:ring-2 focus:ring-[rgb(255,79,1)]/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Filtros</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Filtrar por categoria:</p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={selectedCategory === category.slug}
              onClick={() => handleCategoryClick(category.slug)}
            />
          ))}
        </div>
      </div>

      {activeCategory && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Categoria ativa:</span>
          <span className="px-3 py-1 bg-[rgb(255,235,229)] text-[rgb(255,79,1)] rounded-full text-sm font-medium">
            {activeCategory.name}
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Limpar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <RestaurantSkeleton key={i} />
          ))}
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">Nenhum restaurante encontrado</p>
          <p className="text-gray-500 mb-6">Tente ajustar os filtros</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="px-6 py-3 ifood-primary rounded-xl font-medium"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filteredRestaurants.length} restaurante
            {filteredRestaurants.length !== 1 ? 's' : ''} encontrado
            {filteredRestaurants.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RestaurantesPage() {
  return (
    <Suspense fallback={<RestaurantesLoading />}>
      <RestaurantesContent />
    </Suspense>
  );
}

function RestaurantesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-80 max-w-full bg-gray-100 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RestaurantSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
