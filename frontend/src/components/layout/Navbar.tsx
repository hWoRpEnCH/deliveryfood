import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-ifood-red text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          DeliveryFood
        </Link>
        <nav className="flex flex-wrap gap-3 text-xs font-medium sm:gap-6 sm:text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/restaurantes" className="hover:underline">
            Restaurantes
          </Link>
          <Link href="/pedidos" className="hover:underline">
            Pedidos
          </Link>
          <Link href="/usuarios" className="hover:underline">
            Usuários
          </Link>
        </nav>
      </div>
    </header>
  );
}
