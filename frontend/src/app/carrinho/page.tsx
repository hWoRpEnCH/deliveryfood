 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  ChevronRight,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { createPedido } from '@/services/pedidos';
import { toast } from 'sonner';

export default function CarrinhoPage() {
  const router = useRouter();
  const { user } = useUser();
  const { cart, restaurant, removeItem, clearCart, updateQuantity } = useCart();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [observation, setObservation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Adicione itens de um restaurante para começar</p>
          <Link
            href="/restaurantes"
            className="inline-flex items-center gap-2 px-6 py-3 ifood-primary rounded-xl font-medium"
          >
            Ver restaurantes
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const handleFinishOrder = async () => {
    if (!user) {
      toast.error('Selecione um usuário', {
        description: 'Cadastre ou selecione um usuário em Conta antes de finalizar.',
      });
      router.push('/usuarios');
      return;
    }

    if (!restaurant) return;

    setIsProcessing(true);

    try {
      await createPedido({
        usuario_id: user._id,
        restaurante_id: restaurant.id,
        itens: cart.items.map((item) => ({
          produto: item.menuItem.name,
          preco: item.menuItem.price,
          qtd: item.quantity,
        })),
      });

      toast.success('Pedido realizado com sucesso!', {
        description: `Seu pedido de ${restaurant.name} está sendo preparado.`,
      });

      clearCart();
      router.push('/pedidos');
    } catch (e) {
      toast.error('Erro ao finalizar pedido', {
        description: (e as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Carrinho</h1>
        {!user && (
          <p className="text-sm text-amber-700 mt-2">
            <Link href="/usuarios" className="underline font-medium">
              Selecione um usuário
            </Link>{' '}
            para finalizar o pedido.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="ifood-card p-4">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={restaurant?.image}
                  alt={restaurant?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{restaurant?.name}</h3>
                  <p className="text-sm text-gray-500">{restaurant?.deliveryTime}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.menuItem.id} className="flex items-start gap-3">
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {item.menuItem.description}
                    </p>
                    <p className="text-[rgb(255,79,1)] font-semibold mt-1">
                      R$ {item.menuItem.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-[rgb(255,79,1)] hover:bg-[rgb(220,68,0)] text-white flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.menuItem.id)}
                      className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ifood-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              Endereço de entrega
            </h3>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[rgb(255,79,1)] focus:ring-2 focus:ring-[rgb(255,79,1)]/20 outline-none transition-all"
              placeholder="Digite seu endereço"
            />
          </div>

          <div className="ifood-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Forma de pagamento
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'credit', label: 'Crédito' },
                { id: 'debit', label: 'Débito' },
                { id: 'pix', label: 'PIX' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    paymentMethod === method.id
                      ? 'border-[rgb(255,79,1)] bg-[rgb(255,235,229)] text-[rgb(255,79,1)]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ifood-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Observações</h3>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[rgb(255,79,1)] focus:ring-2 focus:ring-[rgb(255,79,1)]/20 outline-none transition-all resize-none"
              rows={3}
              placeholder="Ex: Sem cebola, ponto da carne mal passado..."
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="ifood-card p-4 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Resumo do pedido</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Itens ({cart.items.reduce((sum, i) => sum + i.quantity, 0)})</span>
                <span>R$ {cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span>R$ {cart.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-[rgb(255,79,1)]">R$ {cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleFinishOrder}
                disabled={isProcessing}
                className="w-full py-3 ifood-primary rounded-xl font-semibold text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  'Finalizar pedido'
                )}
              </button>

              <button
                onClick={() => {
                  clearCart();
                  toast.info('Carrinho limpo');
                }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Limpar carrinho
              </button>

              <Link
                href="/restaurantes"
                className="block w-full py-3 text-center text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
