// Modelo de dados do protótipo.
// Estes tipos são o rascunho do schema que depois vira tabela no Supabase.

export type Opcao = {
  id: string;
  nome: string;
  /** Acréscimo em reais sobre o preço do tamanho. 0 = incluso. */
  acrescimo: number;
  descricao?: string;
  disponivel: boolean;
};

export type Tamanho = {
  id: string;
  nome: string;
  /** Ex.: "20 a 25 fatias" */
  porcoes: string;
  preco: number;
  /** Quantos recheios essa combinação comporta. */
  maxRecheios: number;
};

export type Limite = {
  /** Quantas unidades a confeiteira consegue produzir no período. */
  total: number;
  vendidos: number;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  /** Caminho da foto em /public. */
  foto: string;
  /** Cor de fundo enquanto a foto carrega. */
  cor: string;
  tamanhos: Tamanho[];
  massas: Opcao[];
  recheios: Opcao[];
  decoracoes: Opcao[];
  /** Quantas decorações podem ser escolhidas. */
  maxDecoracoes: number;
  limite?: Limite;
  /** Dias de antecedência mínima para encomendar. */
  antecedenciaDias: number;
};

export type Colecao = {
  id: string;
  nome: string;
  descricao: string;
  periodo: string;
  ativa: boolean;
  destaque: boolean;
  produtoIds: string[];
};

export type TipoEntrega = "entrega" | "retirada";

export type OpcaoEntrega = {
  id: string;
  tipo: TipoEntrega;
  nome: string;
  descricao: string;
  taxa: number;
};

/** Moedas atendidas pela plataforma. */
export type Moeda = "EUR" | "CHF";

export type Pais = "PT" | "CH";

export type Tema = {
  marca: string;
  marcaSuave: string;
  fundo: string;
  texto: string;
};

export type Confeiteira = {
  slug: string;
  nome: string;
  tagline: string;
  bio: string;
  cidade: string;
  pais: Pais;
  /** Cada confeiteira cobra na moeda do país onde trabalha. */
  moeda: Moeda;
  whatsapp: string;
  instagram: string;
  dominioProprio?: string;
  tema: Tema;
  entregas: OpcaoEntrega[];
  aceitaPersonalizado: boolean;
  /** Texto que a confeiteira escreve sobre como ela cobra. */
  avisoPagamento: string;
};

export type StatusPedido =
  | "aguardando"
  | "aceito"
  | "producao"
  | "entregue"
  | "recusado";

export type ItemPedido = {
  produtoNome: string;
  tamanhoNome: string;
  massaNome: string;
  recheiosNomes: string[];
  decoracoesNomes: string[];
  observacao?: string;
  total: number;
};

export type Pedido = {
  id: string;
  cliente: string;
  telefone: string;
  criadoEm: string;
  entregaEm: string;
  entrega: OpcaoEntrega;
  itens: ItemPedido[];
  status: StatusPedido;
  personalizado?: string;
};

/** Tudo o que pertence a uma confeiteira. No banco, cada lista vira uma
 *  tabela com a coluna `confeiteira_id`. */
export type Loja = {
  confeiteira: Confeiteira;
  produtos: Produto[];
  colecoes: Colecao[];
  pedidos: Pedido[];
};
