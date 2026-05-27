'use client';

import React from 'react';
import Link from 'next/link';
import { Pizza, Utensils, Salad, Cake, Coffee, UtensilsCrossed, Flame, Fish } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  hamburger: UtensilsCrossed,
  pizza: Pizza,
  sushi: Fish,
  food: Utensils,
  taco: Flame,
  pasta: Utensils,
  salad: Salad,
  cake: Cake,
  coffee: Coffee,
  rice: Utensils,
};

export function CategoryCard({ category, isActive, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Utensils;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300',
          isActive
            ? 'border-[rgb(255,79,1)] bg-[rgb(255,235,229)] text-[rgb(255,79,1)]'
            : 'border-transparent bg-white hover:bg-gray-50 text-gray-700'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            isActive ? 'bg-[rgb(255,79,1)] text-white' : 'bg-gray-100'
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
      </button>
    );
  }

  return (
    <Link
      href={`/restaurantes?categoria=${category.slug}`}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-100 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
    </Link>
  );
}
