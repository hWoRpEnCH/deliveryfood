export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface CardapioItem {
  _id: string;
  produto: string;
  descricao?: string;
  preco: number;
  categoria: string;
  imagem?: string;
  disponivel: boolean;
}

export interface Restaurante {
  _id: string;
  nome: string;
  categoria: string;
  taxa_entrega: number;
  descricao?: string;
  imagem?: string;
  endereco?: string;
  tempo_entrega?: string;
  pedido_minimo?: number;
  aberto?: boolean;
  cardapio?: CardapioItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Usuario {
  _id: string;
  nome: string;
  email: string;
  imagem?: string;
  restaurantes_favoritos: Restaurante[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemPedido {
  produto: string;
  preco: number;
  qtd: number;
}

export type PedidoStatus =
  | 'pendente'
  | 'preparando'
  | 'entrega'
  | 'entregue'
  | 'cancelado';

export interface Pedido {
  _id: string;
  usuario_id: Usuario | string;
  restaurante_id: Restaurante | string;
  data_pedido: string;
  itens: ItemPedido[];
  valor_total: number;
  status: PedidoStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface MenuItemUI {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface RestaurantUI {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  address: string;
}

export interface CartItemUI {
  menuItem: MenuItemUI;
  quantity: number;
}

export interface CartUI {
  restaurantId: string;
  restaurantName: string;
  items: CartItemUI[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface ApiError {
  statusCode: number;
  message: string[] | string;
  error: string;
}
