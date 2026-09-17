import type { Colecao, Confeiteira, Pedido, Produto } from "./tipos";

// Dados fake do protótipo. Nada aqui vem de banco ainda — quando o Supabase
// entrar, estes objetos viram linhas de tabela e as telas continuam iguais.

export const confeiteira: Confeiteira = {
  slug: "camila-cakes",
  nome: "Camila Cakes",
  tagline: "Bolos de festa feitos sob encomenda",
  bio: "Confeitaria artesanal há 8 anos. Trabalho com massas leves, recheios caseiros e encomendas com antecedência. Cada bolo é montado no dia da entrega.",
  cidade: "São Paulo, SP",
  whatsapp: "(11) 90000-0000",
  instagram: "@camilacakes",
  emoji: "🍰",
  dominioProprio: "camilacakes.com.br",
  tema: {
    marca: "#B3204D",
    marcaSuave: "#FDEEF3",
    fundo: "#FFFBF8",
    texto: "#2E1C22",
  },
  entregas: [
    {
      id: "retirada",
      tipo: "retirada",
      nome: "Retirada no ateliê",
      descricao: "Vila Mariana — combinamos o horário pelo WhatsApp",
      taxa: 0,
    },
    {
      id: "entrega-zona-sul",
      tipo: "entrega",
      nome: "Entrega — Zona Sul",
      descricao: "Vila Mariana, Moema, Saúde, Ipiranga",
      taxa: 25,
    },
    {
      id: "entrega-demais",
      tipo: "entrega",
      nome: "Entrega — demais regiões",
      descricao: "Consulto a taxa conforme o endereço",
      taxa: 45,
    },
  ],
  aceitaPersonalizado: true,
  avisoPagamento:
    "Confirmo a encomenda com 50% de sinal via Pix. O restante é pago na entrega.",
};

export const produtos: Produto[] = [
  {
    id: "bolo-festa",
    nome: "Bolo de festa",
    descricao:
      "O clássico da casa: massa fofinha, recheio generoso e acabamento em chantilly ou ganache.",
    categoria: "Bolos",
    emoji: "🎂",
    cor: "#F7D9E3",
    antecedenciaDias: 5,
    maxDecoracoes: 2,
    tamanhos: [
      { id: "p", nome: "Pequeno", porcoes: "15 a 20 fatias", preco: 180, maxRecheios: 1 },
      { id: "m", nome: "Médio", porcoes: "25 a 30 fatias", preco: 260, maxRecheios: 2 },
      { id: "g", nome: "Grande", porcoes: "40 a 50 fatias", preco: 390, maxRecheios: 3 },
    ],
    massas: [
      { id: "branca", nome: "Branca", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 0, disponivel: true },
      { id: "red-velvet", nome: "Red velvet", acrescimo: 35, disponivel: true },
      { id: "cenoura", nome: "Cenoura", acrescimo: 15, disponivel: true },
    ],
    recheios: [
      { id: "brigadeiro", nome: "Brigadeiro", acrescimo: 0, disponivel: true },
      { id: "doce-de-leite", nome: "Doce de leite", acrescimo: 0, disponivel: true },
      { id: "ninho", nome: "Creme de ninho", acrescimo: 20, disponivel: true },
      { id: "nutella", nome: "Nutella", acrescimo: 35, disponivel: true },
      { id: "morango", nome: "Morango ao creme", acrescimo: 25, disponivel: true },
      { id: "pistache", nome: "Pistache", acrescimo: 45, disponivel: false },
    ],
    decoracoes: [
      { id: "lisa", nome: "Acabamento liso", acrescimo: 0, disponivel: true },
      { id: "drip", nome: "Drip de chocolate", acrescimo: 30, disponivel: true },
      { id: "flores", nome: "Flores naturais", acrescimo: 60, disponivel: true },
      { id: "topo", nome: "Topo personalizado", acrescimo: 45, disponivel: true },
    ],
  },
  {
    id: "naked-cake",
    nome: "Naked cake",
    descricao:
      "Camadas à mostra, frutas frescas por cima. Bonito de mesa e leve de comer.",
    categoria: "Bolos",
    emoji: "🍰",
    cor: "#FAE8D4",
    antecedenciaDias: 7,
    maxDecoracoes: 1,
    tamanhos: [
      { id: "m", nome: "Médio", porcoes: "20 a 25 fatias", preco: 290, maxRecheios: 2 },
      { id: "g", nome: "Grande", porcoes: "35 a 40 fatias", preco: 420, maxRecheios: 2 },
    ],
    massas: [
      { id: "branca", nome: "Branca", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 0, disponivel: true },
    ],
    recheios: [
      { id: "morango", nome: "Morango ao creme", acrescimo: 0, disponivel: true },
      { id: "frutas-vermelhas", nome: "Frutas vermelhas", acrescimo: 30, disponivel: true },
      { id: "limao", nome: "Creme de limão", acrescimo: 15, disponivel: true },
    ],
    decoracoes: [
      { id: "frutas", nome: "Frutas frescas", acrescimo: 0, disponivel: true },
      { id: "flores", nome: "Flores naturais", acrescimo: 60, disponivel: true },
    ],
  },
  {
    id: "panetone-natal",
    nome: "Panetone recheado",
    descricao:
      "Produção limitada de Natal. Massa artesanal de fermentação lenta, recheio à escolha.",
    categoria: "Natal",
    emoji: "🎄",
    cor: "#E3EDDD",
    antecedenciaDias: 10,
    maxDecoracoes: 1,
    limite: { total: 40, vendidos: 31 },
    tamanhos: [
      { id: "500", nome: "500g", porcoes: "6 a 8 fatias", preco: 95, maxRecheios: 1 },
      { id: "1kg", nome: "1kg", porcoes: "12 a 15 fatias", preco: 165, maxRecheios: 2 },
    ],
    massas: [
      { id: "tradicional", nome: "Tradicional", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 10, disponivel: true },
    ],
    recheios: [
      { id: "brigadeiro", nome: "Brigadeiro", acrescimo: 0, disponivel: true },
      { id: "ninho", nome: "Creme de ninho", acrescimo: 15, disponivel: true },
      { id: "nutella", nome: "Nutella", acrescimo: 25, disponivel: true },
    ],
    decoracoes: [
      { id: "simples", nome: "Embalagem simples", acrescimo: 0, disponivel: true },
      { id: "presente", nome: "Embalagem presente", acrescimo: 18, disponivel: true },
    ],
  },
  {
    id: "docinhos",
    nome: "Docinhos (cento)",
    descricao:
      "Brigadeiro, beijinho, casadinho. Vendidos por cento, sabores misturados.",
    categoria: "Doces",
    emoji: "🍬",
    cor: "#EDE2F5",
    antecedenciaDias: 4,
    maxDecoracoes: 1,
    tamanhos: [
      { id: "50", nome: "50 unidades", porcoes: "meia cento", preco: 110, maxRecheios: 2 },
      { id: "100", nome: "100 unidades", porcoes: "um cento", preco: 200, maxRecheios: 3 },
    ],
    massas: [{ id: "tradicional", nome: "Tradicional", acrescimo: 0, disponivel: true }],
    recheios: [
      { id: "brigadeiro", nome: "Brigadeiro", acrescimo: 0, disponivel: true },
      { id: "beijinho", nome: "Beijinho", acrescimo: 0, disponivel: true },
      { id: "casadinho", nome: "Casadinho", acrescimo: 10, disponivel: true },
      { id: "nozes", nome: "Nozes", acrescimo: 25, disponivel: true },
    ],
    decoracoes: [
      { id: "forminha", nome: "Forminha branca", acrescimo: 0, disponivel: true },
      { id: "forminha-cor", nome: "Forminha colorida", acrescimo: 15, disponivel: true },
    ],
  },
];

export const colecoes: Colecao[] = [
  {
    id: "natal",
    nome: "Natal 2026",
    descricao: "Encomendas até 18 de dezembro. Produção limitada.",
    periodo: "1 nov — 23 dez",
    ativa: true,
    destaque: true,
    produtoIds: ["panetone-natal", "bolo-festa", "docinhos"],
  },
  {
    id: "sempre",
    nome: "Cardápio de sempre",
    descricao: "Disponível o ano todo.",
    periodo: "sem data de fim",
    ativa: true,
    destaque: false,
    produtoIds: ["bolo-festa", "naked-cake", "docinhos"],
  },
  {
    id: "pascoa",
    nome: "Páscoa",
    descricao: "Ovos de colher e bolos de chocolate.",
    periodo: "1 mar — 5 abr",
    ativa: false,
    destaque: false,
    produtoIds: ["bolo-festa"],
  },
];

export const pedidos: Pedido[] = [
  {
    id: "PED-104",
    cliente: "Juliana Prado",
    telefone: "(11) 98888-1122",
    criadoEm: "16/09",
    entregaEm: "27/09",
    entrega: confeiteira.entregas[1],
    status: "aguardando",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Médio",
        massaNome: "Red velvet",
        recheiosNomes: ["Creme de ninho", "Nutella"],
        decoracoesNomes: ["Drip de chocolate"],
        observacao: "Aniversário de 30 anos, tema vermelho.",
        total: 380,
      },
    ],
  },
  {
    id: "PED-103",
    cliente: "Marcos Vinícius",
    telefone: "(11) 97777-3344",
    criadoEm: "15/09",
    entregaEm: "24/09",
    entrega: confeiteira.entregas[0],
    status: "aguardando",
    itens: [
      {
        produtoNome: "Docinhos (cento)",
        tamanhoNome: "100 unidades",
        massaNome: "Tradicional",
        recheiosNomes: ["Brigadeiro", "Beijinho", "Nozes"],
        decoracoesNomes: ["Forminha colorida"],
        total: 240,
      },
    ],
  },
  {
    id: "PED-102",
    cliente: "Renata Alves",
    telefone: "(11) 96666-5566",
    criadoEm: "12/09",
    entregaEm: "21/09",
    entrega: confeiteira.entregas[1],
    status: "aceito",
    itens: [
      {
        produtoNome: "Naked cake",
        tamanhoNome: "Grande",
        massaNome: "Branca",
        recheiosNomes: ["Morango ao creme", "Frutas vermelhas"],
        decoracoesNomes: ["Frutas frescas"],
        total: 475,
      },
    ],
  },
  {
    id: "PED-101",
    cliente: "Fernanda Lima",
    telefone: "(11) 95555-7788",
    criadoEm: "10/09",
    entregaEm: "19/09",
    entrega: confeiteira.entregas[0],
    status: "producao",
    personalizado:
      "Bolo de 3 andares para casamento, 120 convidados, tons de branco e verde.",
    itens: [],
  },
  {
    id: "PED-100",
    cliente: "Ana Beatriz",
    telefone: "(11) 94444-9900",
    criadoEm: "02/09",
    entregaEm: "13/09",
    entrega: confeiteira.entregas[2],
    status: "entregue",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Pequeno",
        massaNome: "Cenoura",
        recheiosNomes: ["Brigadeiro"],
        decoracoesNomes: ["Acabamento liso"],
        total: 195,
      },
    ],
  },
];

export function produtoPorId(id: string) {
  return produtos.find((produto) => produto.id === id);
}

export function produtosDaColecao(colecao: Colecao) {
  return colecao.produtoIds
    .map(produtoPorId)
    .filter((produto): produto is Produto => Boolean(produto));
}
