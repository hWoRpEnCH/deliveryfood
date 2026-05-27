import type { CardapioItem, MenuItemUI, Restaurante, RestaurantUI } from '@/types';

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';

export function mapRestaurante(r: Restaurante): RestaurantUI {
  return {
    id: r._id,
    name: r.nome,
    description: r.descricao ?? '',
    image: r.imagem ?? FALLBACK_IMAGE,
    category: r.categoria,
    deliveryTime: r.tempo_entrega ?? '30-45 min',
    deliveryFee: r.taxa_entrega,
    minOrder: r.pedido_minimo ?? 0,
    isOpen: r.aberto ?? true,
    address: r.endereco ?? 'Endereço não informado',
  };
}

export function mapCardapioItem(item: CardapioItem, restaurantId: string): MenuItemUI {
  return {
    id: item._id,
    restaurantId,
    name: item.produto,
    description: item.descricao ?? '',
    price: item.preco,
    image: item.imagem ?? FALLBACK_IMAGE,
    category: item.categoria,
    available: item.disponivel ?? true,
  };
}

export function mapRestauranteCardapio(r: Restaurante): MenuItemUI[] {
  return (r.cardapio ?? []).map((item) => mapCardapioItem(item, r._id));
}
