'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { CartItemUI, CartUI, MenuItemUI, RestaurantUI } from '@/types';

interface CartContextType {
  cart: CartUI | null;
  restaurant: RestaurantUI | null;
  addItem: (menuItem: MenuItemUI, restaurant: RestaurantUI) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function buildCart(
  restaurant: RestaurantUI,
  items: CartItemUI[],
): CartUI {
  const subtotal = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
  return {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    items,
    subtotal,
    deliveryFee: restaurant.deliveryFee,
    total: subtotal + restaurant.deliveryFee,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartUI | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantUI | null>(null);

  const addItem = useCallback((menuItem: MenuItemUI, restaurantData: RestaurantUI) => {
    setCart((prevCart) => {
      if (!prevCart || prevCart.restaurantId !== restaurantData.id) {
        setRestaurant(restaurantData);
        return buildCart(restaurantData, [{ menuItem, quantity: 1 }]);
      }

      const existingIndex = prevCart.items.findIndex(
        (item) => item.menuItem.id === menuItem.id,
      );

      let newItems: CartItemUI[];
      if (existingIndex >= 0) {
        newItems = prevCart.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        newItems = [...prevCart.items, { menuItem, quantity: 1 }];
      }

      return buildCart(restaurantData, newItems);
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setCart((prevCart) => {
      if (!prevCart || !restaurant) return null;

      const newItems = prevCart.items.filter((item) => item.menuItem.id !== menuItemId);
      if (newItems.length === 0) {
        setRestaurant(null);
        return null;
      }

      return buildCart(restaurant, newItems);
    });
  }, [restaurant]);

  const updateQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(menuItemId);
        return;
      }

      setCart((prevCart) => {
        if (!prevCart || !restaurant) return null;

        const newItems = prevCart.items.map((item) =>
          item.menuItem.id === menuItemId ? { ...item, quantity } : item,
        );

        return buildCart(restaurant, newItems);
      });
    },
    [removeItem, restaurant],
  );

  const clearCart = useCallback(() => {
    setCart(null);
    setRestaurant(null);
  }, []);

  const getTotal = useCallback(() => cart?.total ?? 0, [cart]);

  const getItemCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurant,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
