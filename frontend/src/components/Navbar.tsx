'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Home,
  UtensilsCrossed,
  ClipboardList,
  User,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/restaurantes', label: 'Restaurantes', icon: UtensilsCrossed },
    { href: '/pedidos', label: 'Pedidos', icon: ClipboardList },
    { href: '/usuarios', label: 'Conta', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[rgb(255,79,1)] flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              DeliveryFood
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[rgb(255,235,229)] text-[rgb(255,79,1)]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/carrinho"
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg ifood-primary"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Carrinho</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[rgb(255,79,1)] text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs',
                  isActive ? 'text-[rgb(255,79,1)]' : 'text-gray-500',
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
