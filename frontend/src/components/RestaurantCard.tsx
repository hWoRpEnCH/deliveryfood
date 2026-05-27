'use client';

import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import type { RestaurantUI } from '@/types';

interface RestaurantCardProps {
  restaurant: RestaurantUI;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurante/${restaurant.id}`}>
      <div className="ifood-card overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-gray-900">
                Fechado
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-[rgb(255,79,1)] transition-colors">
            {restaurant.name}
          </h3>

          <p className="text-sm text-gray-500 mb-2 font-medium">{restaurant.category}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[rgb(255,79,1)] font-semibold">
              R$ {restaurant.deliveryFee.toFixed(2)}
              <span className="text-gray-500 font-normal text-xs">taxa</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
