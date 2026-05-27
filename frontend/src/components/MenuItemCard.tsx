'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import type { MenuItemUI, RestaurantUI } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  menuItem: MenuItemUI;
  restaurant: RestaurantUI;
  compact?: boolean;
}

export function MenuItemCard({ menuItem, restaurant, compact }: MenuItemCardProps) {
  const { cart, addItem, updateQuantity } = useCart();

  const cartItem = cart?.items.find((item) => item.menuItem.id === menuItem.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!menuItem.available) return;
    if (quantity === 0) {
      addItem(menuItem, restaurant);
    } else {
      updateQuantity(menuItem.id, quantity + 1);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {menuItem.name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">
            {menuItem.description}
          </p>
          <p className="text-[rgb(255,79,1)] font-semibold text-sm mt-1">
            R$ {menuItem.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {quantity > 0 ? (
            <>
              <button
                onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-full bg-[rgb(255,79,1)] hover:bg-[rgb(220,68,0)] flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!menuItem.available}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                menuItem.available
                  ? 'bg-[rgb(255,79,1)] text-white hover:bg-[rgb(220,68,0)]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ifood-card overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!menuItem.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-gray-900">
              Indisponivel
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium mb-1 uppercase">
          {menuItem.category}
        </p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {menuItem.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {menuItem.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[rgb(255,79,1)]">
            R$ {menuItem.price.toFixed(2)}
          </p>

          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-6 text-center font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-full bg-[rgb(255,79,1)] hover:bg-[rgb(220,68,0)] flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!menuItem.available}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors',
                menuItem.available
                  ? 'bg-[rgb(255,79,1)] text-white hover:bg-[rgb(220,68,0)]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
