import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { AppToaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeliveryFood — Delivery de Comida",
  description: "Encontre restaurantes e faça seu pedido online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <UserProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>{children}</main>
            </div>
            <AppToaster />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
