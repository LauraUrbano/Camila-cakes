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
export type Moeda = "EUR" | "CHF" | "BRL";

export type Pais = "PT" | "CH" | "BR";

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

// --------------------------------------------------------------- assinatura

/**
 * Plano da plataforma. Cada plano vira um Product no Stripe e cada preço
 * (mensal/anual, euro/franco) vira um Price — por isso os valores ficam
 * separados por moeda e por período.
 */
export type Plano = {
  id: string;
  nome: string;
  promessa: string;
  /** Preço mensal por moeda. 0 = plano gratuito. */
  mensal: Record<Moeda, number>;
  /** Preço anual por moeda, já com o desconto aplicado. */
  anual: Record<Moeda, number>;
  inclui: string[];
  /** O que este plano ainda não desbloqueia, dito sem rodeios. */
  naoInclui?: string[];
  destaque?: boolean;
};

/**
 * Uma linha da tabela comparativa. O valor por plano é `true` para incluído,
 * `false` para não incluído, ou texto quando o plano tem um limite próprio
 * ("até 5", "básico").
 */
export type LinhaComparacao = {
  rotulo: string;
  valores: Record<string, boolean | string>;
};

export type EstadoAssinatura =
  | "teste"
  | "activa"
  | "vitalicia"
  | "pagamento_falhou"
  | "cancelada";

/**
 * De onde vem o acesso. Um acesso vitalício não é uma assinatura do Stripe:
 * não tem subscription, não renova e não gera faturas — é uma concessão
 * nossa, guardada do nosso lado. Separar a origem evita ir procurar no Stripe
 * um contrato que nunca existiu.
 */
export type OrigemAssinatura = "stripe" | "codigo";

/** Código que dá acesso vitalício a um plano, sem pagamento. */
export type CodigoVitalicio = {
  codigo: string;
  planoId: string;
  usos: number;
  maxUsos: number;
  nota: string;
};

export type Fatura = {
  id: string;
  data: string;
  valor: number;
  paga: boolean;
};

export type Assinatura = {
  planoId: string;
  estado: EstadoAssinatura;
  origem: OrigemAssinatura;
  periodo: "mensal" | "anual";
  /** Dia em que o Stripe cobra a próxima vez. Vazio no acesso vitalício. */
  renovaEm: string;
  /** Últimos quatro dígitos do cartão guardado no Stripe. */
  cartao?: string;
  /** Código usado, quando o acesso veio por aí. */
  codigo?: string;
  faturas: Fatura[];
};

/** Um mês fechado, para os relatórios. */
export type MesFechado = {
  mes: string;
  receita: number;
  encomendas: number;
};

/** Tudo o que pertence a uma confeiteira. No banco, cada lista vira uma
 *  tabela com a coluna `confeiteira_id`. */
export type Loja = {
  confeiteira: Confeiteira;
  produtos: Produto[];
  colecoes: Colecao[];
  pedidos: Pedido[];
  historico: MesFechado[];
  assinatura: Assinatura;
};
