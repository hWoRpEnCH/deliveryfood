# DeliveryFood — CRUD de pedidos estilo iFood

Aplicação fullstack para gestão de usuários, restaurantes e pedidos de delivery.

## Estrutura

```
delivery-food/
├── backend/          # NestJS + MongoDB + Mongoose
├── frontend/         # Next.js + UI Bolt (iFood style)
├── docker-compose.yml
└── README.md
```

## Pré-requisitos

- Node.js 18+
- Docker (MongoDB)
- npm

## 1. MongoDB

```bash
docker compose up -d
```

## 2. Backend

```bash
cd backend
npm install
npm run seed    # popula 3 usuários, 7 restaurantes, 6 pedidos
npm run start:dev
```

API: **http://localhost:3001**

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:3000**

## Seed (login)

| Campo | Valor |
|-------|-------|
| E-mail | `fulanoes@email.com` |
| Senha | `123456` |

Outros usuários: `maria@email.com`, `joao@email.com` (mesma senha).

## Rotas do frontend

| Rota | Descrição |
|------|-----------|
| `/` | Home — busca e destaques |
| `/restaurantes` | Lista com filtros |
| `/restaurante/[id]` | Cardápio + carrinho |
| `/carrinho` | Finalizar pedido (API) |
| `/pedidos` | Meus pedidos |
| `/usuarios` | Cadastro e seleção de usuário |
| `/usuarios/favoritos` | Favoritos |
| `/gerenciar/restaurantes` | CRUD admin restaurantes |
| `/gerenciar/pedidos` | CRUD admin pedidos |

## Modelo MongoDB (NoSQL)

**Restaurante:** nome, categoria, taxa_entrega, cardápio embutido, imagem, endereço, tempo_entrega, aberto.

**Pedido:** usuario_id, restaurante_id, itens, valor_total (calculado), status.

**Usuario:** nome, email, senha (hash), restaurantes_favoritos.

> Avaliações foram removidas — o front Bolt foi adaptado sem ratings.

## Reexecutar seed

```bash
cd backend && npm run seed
```

Isso limpa e repopula usuários, restaurantes (com cardápio) e pedidos.
