import type {
  Colecao,
  Confeiteira,
  Loja,
  MesFechado,
  Pedido,
  Produto,
} from "./tipos";

// Dados fake do protótipo. Nada aqui vem de banco ainda — quando o Supabase
// entrar, cada lista destas vira uma tabela com a coluna `confeiteira_id`.
//
// São duas lojas de propósito: uma em Portugal e outra na Suíça. É o que prova
// que a página por slug, o tema e a moeda são mesmo de cada confeiteira.

// ---------------------------------------------------------------- Lisboa (€)

const camila: Confeiteira = {
  slug: "camila-cakes",
  nome: "Camila Cakes",
  tagline: "Bolos de festa feitos por encomenda",
  bio: "Pastelaria artesanal há 8 anos em Campo de Ourique. Trabalho com massas leves, recheios caseiros e encomendas com antecedência. Cada bolo é montado no dia da entrega.",
  cidade: "Lisboa",
  pais: "PT",
  moeda: "EUR",
  whatsapp: "+351 912 000 000",
  instagram: "@camilacakes",
  dominioProprio: "camilacakes.pt",
  tema: {
    marca: "#5A6E55",
    marcaSuave: "#EDF2E9",
    fundo: "#FCFAF6",
    texto: "#38332E",
  },
  entregas: [
    {
      id: "levantamento",
      tipo: "retirada",
      nome: "Levantamento no atelier",
      descricao: "Campo de Ourique — combinamos a hora por mensagem",
      taxa: 0,
    },
    {
      id: "entrega-lisboa",
      tipo: "entrega",
      nome: "Entrega em Lisboa",
      descricao: "Dentro da cidade",
      taxa: 6,
    },
    {
      id: "entrega-grande-lisboa",
      tipo: "entrega",
      nome: "Entrega na Grande Lisboa",
      descricao: "Oeiras, Almada, Sintra, Loures",
      taxa: 12,
    },
  ],
  aceitaPersonalizado: true,
  avisoPagamento:
    "Confirmo a encomenda com 50% de sinal por MB WAY ou transferência bancária. O restante é pago na entrega.",
};

const produtosCamila: Produto[] = [
  {
    id: "bolo-festa",
    nome: "Bolo de festa",
    descricao:
      "O clássico da casa: massa fofa, recheio generoso e acabamento em chantilly ou ganache.",
    categoria: "Bolos",
    foto: "/produtos/bolo-festa.jpg",
    cor: "#F2E7D9",
    antecedenciaDias: 5,
    maxDecoracoes: 2,
    tamanhos: [
      { id: "p", nome: "Pequeno", porcoes: "15 a 20 fatias", preco: 38, maxRecheios: 1 },
      { id: "m", nome: "Médio", porcoes: "25 a 30 fatias", preco: 55, maxRecheios: 2 },
      { id: "g", nome: "Grande", porcoes: "40 a 50 fatias", preco: 82, maxRecheios: 3 },
    ],
    massas: [
      { id: "branca", nome: "Branca", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 0, disponivel: true },
      { id: "red-velvet", nome: "Red velvet", acrescimo: 8, disponivel: true },
      { id: "cenoura", nome: "Cenoura", acrescimo: 4, disponivel: true },
    ],
    recheios: [
      { id: "brigadeiro", nome: "Brigadeiro", acrescimo: 0, disponivel: true },
      { id: "doce-de-leite", nome: "Doce de leite", acrescimo: 0, disponivel: true },
      { id: "ninho", nome: "Creme de leite em pó", acrescimo: 5, disponivel: true },
      { id: "nutella", nome: "Nutella", acrescimo: 8, disponivel: true },
      { id: "morango", nome: "Morango com natas", acrescimo: 6, disponivel: true },
      { id: "pistacio", nome: "Pistácio", acrescimo: 12, disponivel: false },
    ],
    decoracoes: [
      { id: "liso", nome: "Acabamento liso", acrescimo: 0, disponivel: true },
      { id: "drip", nome: "Drip de chocolate", acrescimo: 7, disponivel: true },
      { id: "flores", nome: "Flores naturais", acrescimo: 15, disponivel: true },
      { id: "topo", nome: "Topo personalizado", acrescimo: 10, disponivel: true },
    ],
  },
  {
    id: "naked-cake",
    nome: "Naked cake",
    descricao:
      "Camadas à mostra, fruta fresca por cima. Bonito de mesa e leve de comer.",
    categoria: "Bolos",
    foto: "/produtos/naked-cake.jpg",
    cor: "#EAF0E4",
    antecedenciaDias: 7,
    maxDecoracoes: 1,
    tamanhos: [
      { id: "m", nome: "Médio", porcoes: "20 a 25 fatias", preco: 62, maxRecheios: 2 },
      { id: "g", nome: "Grande", porcoes: "35 a 40 fatias", preco: 88, maxRecheios: 2 },
    ],
    massas: [
      { id: "branca", nome: "Branca", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 0, disponivel: true },
    ],
    recheios: [
      { id: "morango", nome: "Morango com natas", acrescimo: 0, disponivel: true },
      { id: "frutos-vermelhos", nome: "Frutos vermelhos", acrescimo: 7, disponivel: true },
      { id: "limao", nome: "Creme de limão", acrescimo: 4, disponivel: true },
    ],
    decoracoes: [
      { id: "fruta", nome: "Fruta fresca", acrescimo: 0, disponivel: true },
      { id: "flores", nome: "Flores naturais", acrescimo: 15, disponivel: true },
    ],
  },
  {
    id: "bolo-rei",
    nome: "Bolo-rei recheado",
    descricao:
      "Produção limitada de Natal. Massa de fermentação lenta, recheio à escolha.",
    categoria: "Natal",
    foto: "/produtos/bolo-rei.jpg",
    cor: "#E4EBE3",
    antecedenciaDias: 10,
    maxDecoracoes: 1,
    limite: { total: 40, vendidos: 31 },
    tamanhos: [
      { id: "500", nome: "500g", porcoes: "6 a 8 fatias", preco: 18, maxRecheios: 1 },
      { id: "1kg", nome: "1kg", porcoes: "12 a 15 fatias", preco: 30, maxRecheios: 2 },
    ],
    massas: [
      { id: "tradicional", nome: "Tradicional", acrescimo: 0, disponivel: true },
      { id: "sem-frutas", nome: "Sem frutas cristalizadas", acrescimo: 2, disponivel: true },
    ],
    recheios: [
      { id: "creme-ovos", nome: "Creme de ovos", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 3, disponivel: true },
      { id: "nozes", nome: "Nozes", acrescimo: 5, disponivel: true },
    ],
    decoracoes: [
      { id: "simples", nome: "Embalagem simples", acrescimo: 0, disponivel: true },
      { id: "presente", nome: "Embalagem de presente", acrescimo: 4, disponivel: true },
    ],
  },
  {
    id: "docinhos",
    nome: "Doces de festa",
    descricao:
      "Brigadeiro, beijinho, casadinho. Vendidos por dúzia, sabores à escolha.",
    categoria: "Doces",
    foto: "/produtos/doces-festa.jpg",
    cor: "#EDE9F2",
    antecedenciaDias: 4,
    maxDecoracoes: 1,
    tamanhos: [
      { id: "50", nome: "50 unidades", porcoes: "festa pequena", preco: 25, maxRecheios: 2 },
      { id: "100", nome: "100 unidades", porcoes: "festa média", preco: 45, maxRecheios: 3 },
    ],
    massas: [{ id: "tradicional", nome: "Tradicional", acrescimo: 0, disponivel: true }],
    recheios: [
      { id: "brigadeiro", nome: "Brigadeiro", acrescimo: 0, disponivel: true },
      { id: "beijinho", nome: "Beijinho", acrescimo: 0, disponivel: true },
      { id: "casadinho", nome: "Casadinho", acrescimo: 3, disponivel: true },
      { id: "nozes", nome: "Nozes", acrescimo: 6, disponivel: true },
    ],
    decoracoes: [
      { id: "forma-branca", nome: "Forminha branca", acrescimo: 0, disponivel: true },
      { id: "forma-cor", nome: "Forminha colorida", acrescimo: 4, disponivel: true },
    ],
  },
];

const colecoesCamila: Colecao[] = [
  {
    id: "natal",
    nome: "Natal 2026",
    descricao: "Encomendas até 18 de dezembro. Produção limitada.",
    periodo: "1 nov — 23 dez",
    ativa: true,
    destaque: true,
    produtoIds: ["bolo-rei", "bolo-festa", "docinhos"],
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
    descricao: "Folar recheado e bolos de chocolate.",
    periodo: "1 mar — 5 abr",
    ativa: false,
    destaque: false,
    produtoIds: ["bolo-festa"],
  },
];

const pedidosCamila: Pedido[] = [
  {
    id: "ENC-104",
    cliente: "Juliana Prado",
    telefone: "+351 918 111 222",
    criadoEm: "16/09",
    entregaEm: "27/09",
    entrega: camila.entregas[1],
    status: "aguardando",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Médio",
        massaNome: "Red velvet",
        recheiosNomes: ["Creme de leite em pó", "Nutella"],
        decoracoesNomes: ["Drip de chocolate"],
        observacao: "Aniversário de 30 anos, tema em tons de verde.",
        total: 83,
      },
    ],
  },
  {
    id: "ENC-103",
    cliente: "Marco Bettencourt",
    telefone: "+351 917 333 444",
    criadoEm: "15/09",
    entregaEm: "24/09",
    entrega: camila.entregas[0],
    status: "aguardando",
    itens: [
      {
        produtoNome: "Doces de festa",
        tamanhoNome: "100 unidades",
        massaNome: "Tradicional",
        recheiosNomes: ["Brigadeiro", "Beijinho", "Nozes"],
        decoracoesNomes: ["Forminha colorida"],
        total: 55,
      },
    ],
  },
  {
    id: "ENC-102",
    cliente: "Renata Alves",
    telefone: "+351 916 555 666",
    criadoEm: "12/09",
    entregaEm: "21/09",
    entrega: camila.entregas[1],
    status: "aceito",
    itens: [
      {
        produtoNome: "Naked cake",
        tamanhoNome: "Grande",
        massaNome: "Branca",
        recheiosNomes: ["Morango com natas", "Frutos vermelhos"],
        decoracoesNomes: ["Fruta fresca"],
        total: 95,
      },
    ],
  },
  {
    id: "ENC-101",
    cliente: "Fernanda Lima",
    telefone: "+351 915 777 888",
    criadoEm: "10/09",
    entregaEm: "19/09",
    entrega: camila.entregas[0],
    status: "producao",
    personalizado:
      "Bolo de 3 andares para casamento, 120 convidados, tons de branco e verde-sálvia.",
    itens: [],
  },
  {
    id: "ENC-100",
    cliente: "Ana Beatriz",
    telefone: "+351 914 999 000",
    criadoEm: "02/09",
    entregaEm: "13/09",
    entrega: camila.entregas[2],
    status: "entregue",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Pequeno",
        massaNome: "Cenoura",
        recheiosNomes: ["Brigadeiro"],
        decoracoesNomes: ["Acabamento liso"],
        total: 42,
      },
    ],
  },
  {
    id: "ENC-099",
    cliente: "Tiago Marques",
    telefone: "+351 913 121 314",
    criadoEm: "01/09",
    entregaEm: "12/09",
    entrega: camila.entregas[1],
    status: "entregue",
    itens: [
      {
        produtoNome: "Naked cake",
        tamanhoNome: "Médio",
        massaNome: "Branca",
        recheiosNomes: ["Creme de limão", "Frutos vermelhos"],
        decoracoesNomes: ["Fruta fresca"],
        total: 73,
      },
    ],
  },
  {
    id: "ENC-098",
    cliente: "Sara Cardoso",
    telefone: "+351 912 151 617",
    criadoEm: "30/08",
    entregaEm: "08/09",
    entrega: camila.entregas[0],
    status: "entregue",
    itens: [
      {
        produtoNome: "Doces de festa",
        tamanhoNome: "50 unidades",
        massaNome: "Tradicional",
        recheiosNomes: ["Brigadeiro", "Beijinho"],
        decoracoesNomes: ["Forminha branca"],
        observacao: "Baptizado, forminhas brancas.",
        total: 25,
      },
    ],
  },
  {
    id: "ENC-097",
    cliente: "Bruno Esteves",
    telefone: "+351 911 181 920",
    criadoEm: "28/08",
    entregaEm: "05/09",
    entrega: camila.entregas[2],
    status: "recusado",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Grande",
        massaNome: "Chocolate",
        recheiosNomes: ["Brigadeiro", "Doce de leite", "Nutella"],
        decoracoesNomes: ["Topo personalizado"],
        observacao: "Pedido para daqui a dois dias — sem tempo de produção.",
        total: 112,
      },
    ],
  },
  {
    id: "ENC-096",
    cliente: "Inês Rocha",
    telefone: "+351 910 212 223",
    criadoEm: "25/08",
    entregaEm: "02/09",
    entrega: camila.entregas[1],
    status: "entregue",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Médio",
        massaNome: "Cenoura",
        recheiosNomes: ["Brigadeiro", "Doce de leite"],
        decoracoesNomes: ["Acabamento liso"],
        total: 65,
      },
    ],
  },
  {
    id: "ENC-095",
    cliente: "Patrícia Nunes",
    telefone: "+351 919 242 526",
    criadoEm: "22/08",
    entregaEm: "31/08",
    entrega: camila.entregas[0],
    status: "entregue",
    personalizado:
      "Mesa de doces para chá de bebé: 100 docinhos e um bolo pequeno, tons neutros.",
    itens: [],
  },
  {
    id: "ENC-094",
    cliente: "Hugo Salgado",
    telefone: "+351 918 272 829",
    criadoEm: "20/08",
    entregaEm: "29/08",
    entrega: camila.entregas[1],
    status: "entregue",
    itens: [
      {
        produtoNome: "Naked cake",
        tamanhoNome: "Grande",
        massaNome: "Chocolate",
        recheiosNomes: ["Morango com natas", "Creme de limão"],
        decoracoesNomes: ["Flores naturais"],
        total: 115,
      },
    ],
  },
  {
    id: "ENC-093",
    cliente: "Mariana Pinto",
    telefone: "+351 917 303 132",
    criadoEm: "18/08",
    entregaEm: "26/08",
    entrega: camila.entregas[0],
    status: "entregue",
    itens: [
      {
        produtoNome: "Doces de festa",
        tamanhoNome: "100 unidades",
        massaNome: "Tradicional",
        recheiosNomes: ["Brigadeiro", "Casadinho", "Nozes"],
        decoracoesNomes: ["Forminha colorida"],
        total: 58,
      },
    ],
  },
];

// -------------------------------------------------------------- Genebra (CHF)

const sofia: Confeiteira = {
  slug: "doces-da-sofia",
  nome: "Doces da Sofia",
  tagline: "Doçaria portuguesa em Genebra",
  bio: "Saí de Braga há doze anos e trouxe as receitas da minha avó. Faço bolos de festa e doçaria portuguesa por encomenda, para a comunidade daqui e para quem quiser provar.",
  cidade: "Genebra",
  pais: "CH",
  moeda: "CHF",
  whatsapp: "+41 79 000 00 00",
  instagram: "@docesdasofia",
  tema: {
    marca: "#6E6280",
    marcaSuave: "#F1EEF5",
    fundo: "#FBFAF8",
    texto: "#35313A",
  },
  entregas: [
    {
      id: "levantamento",
      tipo: "retirada",
      nome: "Levantamento em Carouge",
      descricao: "Combinamos a hora por mensagem",
      taxa: 0,
    },
    {
      id: "entrega-genebra",
      tipo: "entrega",
      nome: "Entrega em Genebra",
      descricao: "Cidade e arredores",
      taxa: 12,
    },
    {
      id: "entrega-vaud",
      tipo: "entrega",
      nome: "Entrega no cantão de Vaud",
      descricao: "Lausanne, Nyon, Morges",
      taxa: 25,
    },
  ],
  aceitaPersonalizado: false,
  avisoPagamento:
    "Confirmo a encomenda com 50% de sinal por TWINT ou transferência. O restante é pago na entrega.",
};

const produtosSofia: Produto[] = [
  {
    id: "bolo-festa",
    nome: "Bolo de festa",
    descricao:
      "Massa fofa e recheio caseiro, como se faz em Portugal. Acabamento em chantilly.",
    categoria: "Bolos",
    foto: "/produtos/bolo-festa-ch.jpg",
    cor: "#EDE9F2",
    antecedenciaDias: 6,
    maxDecoracoes: 1,
    tamanhos: [
      { id: "p", nome: "Pequeno", porcoes: "15 a 20 fatias", preco: 65, maxRecheios: 1 },
      { id: "m", nome: "Médio", porcoes: "25 a 30 fatias", preco: 95, maxRecheios: 2 },
      { id: "g", nome: "Grande", porcoes: "40 a 50 fatias", preco: 140, maxRecheios: 3 },
    ],
    massas: [
      { id: "branca", nome: "Branca", acrescimo: 0, disponivel: true },
      { id: "chocolate", nome: "Chocolate", acrescimo: 0, disponivel: true },
    ],
    recheios: [
      { id: "creme-ovos", nome: "Creme de ovos", acrescimo: 0, disponivel: true },
      { id: "brigadeiro", nome: "Brigadeiro", acrescimo: 0, disponivel: true },
      { id: "nozes", nome: "Nozes", acrescimo: 10, disponivel: true },
    ],
    decoracoes: [
      { id: "liso", nome: "Acabamento liso", acrescimo: 0, disponivel: true },
      { id: "flores", nome: "Flores naturais", acrescimo: 25, disponivel: true },
    ],
  },
  {
    id: "pasteis-nata",
    nome: "Pastéis de nata",
    descricao:
      "Feitos de manhã, entregues no mesmo dia. Vendidos por dúzia.",
    categoria: "Doçaria",
    foto: "/produtos/pasteis-nata.jpg",
    cor: "#F6EDDD",
    antecedenciaDias: 3,
    maxDecoracoes: 1,
    limite: { total: 30, vendidos: 22 },
    tamanhos: [
      { id: "12", nome: "1 dúzia", porcoes: "12 unidades", preco: 24, maxRecheios: 1 },
      { id: "24", nome: "2 dúzias", porcoes: "24 unidades", preco: 45, maxRecheios: 1 },
    ],
    massas: [{ id: "tradicional", nome: "Tradicional", acrescimo: 0, disponivel: true }],
    recheios: [
      { id: "creme-ovos", nome: "Creme de ovos", acrescimo: 0, disponivel: true },
    ],
    decoracoes: [
      { id: "caixa", nome: "Caixa simples", acrescimo: 0, disponivel: true },
      { id: "caixa-presente", nome: "Caixa de presente", acrescimo: 8, disponivel: true },
    ],
  },
];

const colecoesSofia: Colecao[] = [
  {
    id: "sempre",
    nome: "Cardápio de sempre",
    descricao: "Disponível o ano todo.",
    periodo: "sem data de fim",
    ativa: true,
    destaque: false,
    produtoIds: ["bolo-festa", "pasteis-nata"],
  },
];

const pedidosSofia: Pedido[] = [
  {
    id: "ENC-042",
    cliente: "Hélder Sousa",
    telefone: "+41 78 111 22 33",
    criadoEm: "16/09",
    entregaEm: "26/09",
    entrega: sofia.entregas[1],
    status: "aguardando",
    itens: [
      {
        produtoNome: "Bolo de festa",
        tamanhoNome: "Médio",
        massaNome: "Chocolate",
        recheiosNomes: ["Brigadeiro", "Nozes"],
        decoracoesNomes: ["Acabamento liso"],
        total: 105,
      },
    ],
  },
  {
    id: "ENC-041",
    cliente: "Claudia Ferreira",
    telefone: "+41 76 444 55 66",
    criadoEm: "14/09",
    entregaEm: "20/09",
    entrega: sofia.entregas[0],
    status: "aceito",
    itens: [
      {
        produtoNome: "Pastéis de nata",
        tamanhoNome: "2 dúzias",
        massaNome: "Tradicional",
        recheiosNomes: ["Creme de ovos"],
        decoracoesNomes: ["Caixa de presente"],
        total: 53,
      },
    ],
  },
];

// Meses já fechados, para os relatórios. Os pedidos acima cobrem só as últimas
// semanas, então o histórico é ilustrativo — vem do banco quando ele existir.
const historicoCamila: MesFechado[] = [
  { mes: "Abr", receita: 620, encomendas: 9 },
  { mes: "Mai", receita: 845, encomendas: 12 },
  { mes: "Jun", receita: 730, encomendas: 11 },
  { mes: "Jul", receita: 1180, encomendas: 17 },
  { mes: "Ago", receita: 965, encomendas: 14 },
  { mes: "Set", receita: 1390, encomendas: 19 },
];

const historicoSofia: MesFechado[] = [
  { mes: "Abr", receita: 890, encomendas: 7 },
  { mes: "Mai", receita: 1150, encomendas: 9 },
  { mes: "Jun", receita: 1020, encomendas: 8 },
  { mes: "Jul", receita: 1480, encomendas: 12 },
  { mes: "Ago", receita: 1310, encomendas: 10 },
  { mes: "Set", receita: 1640, encomendas: 13 },
];

// ------------------------------------------------------------------- exportes

export const lojas: Loja[] = [
  {
    confeiteira: camila,
    produtos: produtosCamila,
    colecoes: colecoesCamila,
    pedidos: pedidosCamila,
    historico: historicoCamila,
  },
  {
    confeiteira: sofia,
    produtos: produtosSofia,
    colecoes: colecoesSofia,
    pedidos: pedidosSofia,
    historico: historicoSofia,
  },
];

/** O painel do protótipo é sempre o da Camila. */
export const lojaPrincipal = lojas[0];

export function lojaPorSlug(slug: string): Loja | undefined {
  return lojas.find((loja) => loja.confeiteira.slug === slug);
}

export function produtoPorId(loja: Loja, id: string) {
  return loja.produtos.find((produto) => produto.id === id);
}

export function produtosDaColecao(loja: Loja, colecao: Colecao) {
  return colecao.produtoIds
    .map((id) => produtoPorId(loja, id))
    .filter((produto): produto is Produto => Boolean(produto));
}
