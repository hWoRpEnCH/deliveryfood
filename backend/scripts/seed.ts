import * as bcrypt from "bcrypt";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/DeliveryFood";

const restaurantesSeed = [
  {
    nome: "Pizza Bacana",
    categoria: "Italiana",
    taxa_entrega: 7.0,
    descricao:
      "Pizzas artesanais com massa crocante e ingredientes selecionados.",
    imagem:
      "https://i.pinimg.com/736x/e0/aa/5e/e0aa5e9361fd7817d03eb3c112431afa.jpg",
    endereco: "Rua da Pizza",
    tempo_entrega: "30-50 min",
    pedido_minimo: 35,
    aberto: true,
    cardapio: [
      {
        produto: "Pizza 4 Queijos",
        descricao: "Mozzarella, gorgonzola, parmesão e catupiry.",
        preco: 49.9,
        categoria: "Pizzas",
        imagem:
          "https://i.pinimg.com/736x/90/bf/1a/90bf1a011a8fa878a2588b84aa66d8c0.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Pizza Margherita",
        descricao: "Molho de tomate, mozzarella e manjericão.",
        preco: 44.9,
        categoria: "Pizzas",
        imagem:
          "https://i.pinimg.com/736x/5d/2c/11/5d2c115780ad45087d3d4fa74d368f21.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Fanta Uva",
        preco: 5.0,
        categoria: "Bebidas",
        imagem:
          "https://i.pinimg.com/736x/85/0b/d4/850bd44f7c22572a9af8497dd8fc1e44.jpg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    nome: "Hamborgue's",
    categoria: "Lanches",
    taxa_entrega: 5.99,
    descricao: "Hambúrgueres suculentos com ingredientes frescos.",
    imagem:
      "https://i.pinimg.com/736x/7e/32/a3/7e32a3995232da10d2ff94cd5a4a1fd2.jpg",
    endereco: "Rua do hamburguer gostoso",
    tempo_entrega: "25-40 min",
    pedido_minimo: 20,
    aberto: true,
    cardapio: [
      {
        produto: "Whopper",
        descricao: "Hambúrguer 113g, queijo, alface, tomate e molho especial.",
        preco: 29.9,
        categoria: "Burgers",
        imagem:
          "https://i.pinimg.com/736x/31/d1/6a/31d16a693bcae0f915f19219555bf397.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Batata Frita Média",
        descricao: "Porção média de batatas crocantes.",
        preco: 12.9,
        categoria: "Acompanhamentos",
        imagem:
          "https://i.pinimg.com/736x/9e/a6/c7/9ea6c7e7ff1ac7ee903e9517b785cf10.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Milk Shake Chocolate",
        preco: 16.9,
        categoria: "Bebidas",
        imagem:
          "https://i.pinimg.com/control1/736x/be/0c/76/be0c76bac8bbe290f75ea59c0221880b.jpg",
      },
    ],
  },
  {
    nome: "Sushi do Bom",
    categoria: "Japonesa",
    taxa_entrega: 12.99,
    descricao: "Culinária japonesa autêntica com peixes frescos.",
    imagem:
      "https://i.pinimg.com/736x/4e/d2/40/4ed240f0e0e439290dee82bd91398f9a.jpg",
    endereco: "Liberdade - São Paulo",
    tempo_entrega: "40-60 min",
    pedido_minimo: 50,
    aberto: true,
    cardapio: [
      {
        produto: "Combo Sashimi",
        descricao: "12 peças de sashimi variado.",
        preco: 69.9,
        categoria: "Combos",
        imagem:
          "https://i.pinimg.com/736x/96/8c/37/968c37306a2daa0d505e854378678f2f.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Hot Roll",
        descricao: "8 unidades com salmão grelhado e cream cheese.",
        preco: 32.9,
        categoria: "Hot Rolls",
        imagem:
          "https://i.pinimg.com/736x/95/7d/71/957d71b8ce5394897b647c12471f2ec6.jpg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    nome: "Cantina Italiana",
    categoria: "Italiana",
    taxa_entrega: 6.99,
    descricao: "Massas caseiras e molhos da nonna.",
    imagem:
      "https://i.pinimg.com/736x/28/69/0d/28690d1cad543fbfefc04be260b1e99e.jpg",
    endereco: "Florença (entregas internacionais e instantâneas)",
    tempo_entrega: "35-55 min",
    pedido_minimo: 30,
    aberto: true,
    cardapio: [
      {
        produto: "Spaghetti Carbonara",
        descricao: "Massa fresca, bacon, ovos e parmesão.",
        preco: 38.9,
        categoria: "Massas",
        imagem:
          "https://i.pinimg.com/1200x/e9/0d/8b/e90d8b7f00ef7fcebf773cab024f9be0.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Lasagna Bolonhesa",
        preco: 42.9,
        categoria: "Massas",
        imagem:
          "https://i.pinimg.com/736x/f9/83/43/f9834398838b8ff94c20bbee766af4af.jpg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    nome: "Tacos (que não são de baseball)",
    categoria: "Mexicana",
    taxa_entrega: 4.99,
    descricao: "Sabores autênticos do México.",
    imagem:
      "https://i.pinimg.com/736x/16/2e/d5/162ed505bfd05547d26f08f02d860dcd.jpg",
    endereco: "Abajo del cielo",
    tempo_entrega: "20-35 min",
    pedido_minimo: 25,
    aberto: true,
    cardapio: [
      {
        produto: "Taco Supremo",
        descricao: "Tortilla com carne, queijo, alface e tomate.",
        preco: 18.9,
        categoria: "Tacos",
        imagem:
          "https://i.pinimg.com/736x/9e/4c/53/9e4c535e72dfe04da0b889e565b19467.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Burrito Grande",
        preco: 24.9,
        categoria: "Burritos",
        imagem:
          "https://i.pinimg.com/736x/5d/af/75/5daf75b5bac62fc93618e6dd07eb0aaf.jpg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    nome: "Foias e Matos",
    categoria: "Saudável",
    taxa_entrega: 8.5,
    descricao: "Saladas frescas.",
    imagem:
      "https://i.pinimg.com/736x/ac/f8/5e/acf85e1bbaa43ab5ab93366c78a46deb.jpg",
    endereco: "Jardim Botânico",
    tempo_entrega: "25-40 min",
    pedido_minimo: 28,
    aberto: true,
    cardapio: [
      {
        produto: "Bowl Proteína",
        descricao: "Arroz integral, frango grelhado e legumes.",
        preco: 34.9,
        categoria: "Bowls",
        imagem:
          "https://i.pinimg.com/1200x/31/30/d6/3130d6619b7e7173a26c03ed00f21327.jpg",
      },
      {
        produto: "Salada Caesar",
        preco: 26.9,
        categoria: "Saladas",
        imagem:
          "https://i.pinimg.com/736x/33/1c/36/331c360166ee846709be8eb9ecfff408.jpg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
  {
    nome: "Kung Food",
    categoria: "Chinesa",
    taxa_entrega: 9.0,
    descricao: "Pratos orientais com temperos especiais.",
    imagem:
      "https://i.pinimg.com/736x/63/96/64/63966458742e7a2683cb4fed50c62610.jpg",
    endereco: "Liberdade - em frente ao Sushi do Bom",
    tempo_entrega: "35-50 min",
    pedido_minimo: 32,
    aberto: false,
    cardapio: [
      {
        produto: "Yakisoba Tradicional",
        preco: 36.9,
        categoria: "Pratos",
        imagem:
          "https://i.pinimg.com/736x/96/ae/04/96ae0424866eff2a31cbdd1df8a2781e.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        produto: "Frango Xadrez",
        preco: 39.9,
        categoria: "Pratos",
        imagem:
          "https://i.pinimg.com/736x/d5/60/13/d56013c6e819453bcf4b3044f4ab742f.jpg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
  },
];

function calcTotal(
  itens: { preco: number; qtd: number }[],
  taxa: number,
): number {
  return itens.reduce((acc, i) => acc + i.preco * i.qtd, 0) + taxa;
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  await db.collection("pedidos").deleteMany({});
  await db.collection("usuarios").deleteMany({});
  await db.collection("restaurantes").deleteMany({});

  const senhaHash = await bcrypt.hash("123456", 10);
  const now = new Date();

  const usuarios = [
    {
      nome: "Fulano Exemplo da Silva",
      email: "fulanoes@email.com",
      senha: senhaHash,
      restaurantes_favoritos: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      nome: "Maria Santos",
      email: "maria@email.com",
      senha: senhaHash,
      restaurantes_favoritos: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      nome: "João Oliveira",
      email: "joao@email.com",
      senha: senhaHash,
      restaurantes_favoritos: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const usuarioIds: mongoose.Types.ObjectId[] = [];
  for (const u of usuarios) {
    const res = await db.collection("usuarios").insertOne(u);
    usuarioIds.push(res.insertedId);
  }

  const restauranteIds: mongoose.Types.ObjectId[] = [];
  const restauranteTaxas: number[] = [];

  for (const r of restaurantesSeed) {
    const res = await db.collection("restaurantes").insertOne({
      ...r,
      cardapio: r.cardapio.map((item) => ({ ...item, disponivel: true })),
      createdAt: now,
      updatedAt: now,
    });
    restauranteIds.push(res.insertedId);
    restauranteTaxas.push(r.taxa_entrega);
  }

  await db.collection("usuarios").updateOne(
    { _id: usuarioIds[0] },
    {
      $set: {
        restaurantes_favoritos: [restauranteIds[0], restauranteIds[1]],
      },
    },
  );

  const pedidosSeed = [
    {
      usuario_id: usuarioIds[0],
      restaurante_id: restauranteIds[0],
      itens: [
        { produto: "Pizza 4 Queijos", preco: 49.9, qtd: 1 },
        { produto: "Fanta Uva", preco: 5.0, qtd: 2 },
      ],
      status: "entregue",
      diasAtras: 2,
    },
    {
      usuario_id: usuarioIds[0],
      restaurante_id: restauranteIds[1],
      itens: [
        { produto: "Whopper", preco: 29.9, qtd: 2 },
        { produto: "Batata Frita Média", preco: 12.9, qtd: 1 },
      ],
      status: "preparando",
      diasAtras: 0,
    },
    {
      usuario_id: usuarioIds[1],
      restaurante_id: restauranteIds[2],
      itens: [{ produto: "Combo Sashimi", preco: 69.9, qtd: 1 }],
      status: "entrega",
      diasAtras: 0,
    },
    {
      usuario_id: usuarioIds[1],
      restaurante_id: restauranteIds[4],
      itens: [
        { produto: "Taco Supreme", preco: 18.9, qtd: 3 },
        { produto: "Burrito Grande", preco: 24.9, qtd: 1 },
      ],
      status: "pendente",
      diasAtras: 0,
    },
    {
      usuario_id: usuarioIds[2],
      restaurante_id: restauranteIds[3],
      itens: [{ produto: "Spaghetti Carbonara", preco: 38.9, qtd: 2 }],
      status: "entregue",
      diasAtras: 5,
    },
    {
      usuario_id: usuarioIds[2],
      restaurante_id: restauranteIds[5],
      itens: [
        { produto: "Bowl Proteína", preco: 34.9, qtd: 1 },
        { produto: "Salada Caesar", preco: 26.9, qtd: 1 },
      ],
      status: "cancelado",
      diasAtras: 1,
    },
  ];

  for (const p of pedidosSeed) {
    const idx = restauranteIds.findIndex((id) => id.equals(p.restaurante_id));
    const taxa = restauranteTaxas[idx] ?? 0;
    const data = new Date();
    data.setDate(data.getDate() - p.diasAtras);

    await db.collection("pedidos").insertOne({
      usuario_id: p.usuario_id,
      restaurante_id: p.restaurante_id,
      data_pedido: data,
      itens: p.itens,
      valor_total: calcTotal(p.itens, taxa),
      status: p.status,
      createdAt: data,
      updatedAt: now,
    });
  }

  console.log("Seed concluído!");
  console.log(`- ${usuarioIds.length} usuários`);
  console.log(`- ${restauranteIds.length} restaurantes`);
  console.log(`- ${pedidosSeed.length} pedidos`);
  console.log("Login seed: fulanoes@email.com / 123456");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
