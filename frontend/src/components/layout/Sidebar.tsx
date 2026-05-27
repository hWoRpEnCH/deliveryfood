'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/restaurantes', label: 'Restaurantes' },
  { href: '/pedidos', label: 'Pedidos' },
  { href: '/usuarios', label: 'Usuários' },
  { href: '/usuarios/favoritos', label: 'Favoritos' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ifood-gray">
        Menu
      </p>
      <ul className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-red-50 text-ifood-red'
                    : 'text-ifood-dark hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
