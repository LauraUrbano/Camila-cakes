import type { Moeda, Produto, Tamanho, Opcao } from "./tipos";

export type Selecao = {
  tamanhoId: string;
  massaId: string;
  recheioIds: string[];
  decoracaoIds: string[];
};

/**
 * Uma linha do orçamento. Guarda chaves, não frases: o nome da opção é da
 * confeiteira e fica como ela o escreveu, mas "massa", "incluído" ou
 * "recheio premium" são palavras nossas e mudam com a língua de quem olha.
 */
export type LinhaPreco = {
  tipo: "tamanho" | "massa" | "recheio" | "decoracao";
  nome: string;
  detalhe: "porcoes" | "incluido" | "inclusa" | "acrescimo" | "premium";
  /** Só no tamanho: o texto das porções, escrito pela confeiteira. */
  porcoes?: string;
  valor: number;
};

/** O que falta escolher, em chaves para o ecrã traduzir. */
export type Pendencia =
  | { tipo: "tamanho" }
  | { tipo: "massa" }
  | { tipo: "recheios"; faltam: number };

export type Orcamento = {
  linhas: LinhaPreco[];
  total: number;
  pendencias: Pendencia[];
  completo: boolean;
};

/**
 * Cada moeda tem o seu formato local: em Portugal o símbolo vem depois do
 * número e a vírgula separa os cêntimos; na Suíça é o contrário.
 */
const formatos: Record<Moeda, Intl.NumberFormat> = {
  EUR: new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }),
  CHF: new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" }),
  BRL: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
};

export function moeda(valor: number, codigo: Moeda = "EUR"): string {
  return formatos[codigo].format(valor);
}

function acha<T extends { id: string }>(lista: T[], id: string) {
  return lista.find((item) => item.id === id);
}

function achaVarios(lista: Opcao[], ids: string[]) {
  return ids
    .map((id) => acha(lista, id))
    .filter((opcao): opcao is Opcao => Boolean(opcao));
}

/**
 * Calcula o preço de uma combinação.
 *
 * A regra é sempre a mesma: o tamanho define o preço de partida e quantos
 * recheios cabem; massa, recheios e decorações entram como acréscimo. Uma
 * opção com acréscimo 0 está inclusa no preço do tamanho.
 */
export function calcular(produto: Produto, selecao: Selecao): Orcamento {
  const linhas: LinhaPreco[] = [];
  const pendencias: Pendencia[] = [];

  const tamanho = acha(produto.tamanhos, selecao.tamanhoId);
  if (!tamanho) {
    return {
      linhas,
      total: 0,
      pendencias: [{ tipo: "tamanho" }],
      completo: false,
    };
  }

  linhas.push({
    tipo: "tamanho",
    nome: tamanho.nome,
    detalhe: "porcoes",
    porcoes: tamanho.porcoes,
    valor: tamanho.preco,
  });

  const massa = acha(produto.massas, selecao.massaId);
  if (massa) {
    linhas.push({
      tipo: "massa",
      nome: massa.nome,
      detalhe: massa.acrescimo === 0 ? "inclusa" : "acrescimo",
      valor: massa.acrescimo,
    });
  } else {
    pendencias.push({ tipo: "massa" });
  }

  const recheios = achaVarios(produto.recheios, selecao.recheioIds);
  for (const recheio of recheios) {
    linhas.push({
      tipo: "recheio",
      nome: recheio.nome,
      detalhe: recheio.acrescimo === 0 ? "incluido" : "premium",
      valor: recheio.acrescimo,
    });
  }

  if (recheios.length < tamanho.maxRecheios) {
    pendencias.push({
      tipo: "recheios",
      faltam: tamanho.maxRecheios - recheios.length,
    });
  }

  const decoracoes = achaVarios(produto.decoracoes, selecao.decoracaoIds);
  for (const decoracao of decoracoes) {
    linhas.push({
      tipo: "decoracao",
      nome: decoracao.nome,
      detalhe: decoracao.acrescimo === 0 ? "incluido" : "acrescimo",
      valor: decoracao.acrescimo,
    });
  }

  const total = linhas.reduce((soma, linha) => soma + linha.valor, 0);

  return {
    linhas,
    total,
    pendencias,
    completo: pendencias.length === 0,
  };
}

/** Quantos recheios ainda cabem na combinação escolhida. */
export function vagasDeRecheio(tamanho: Tamanho | undefined, escolhidos: number) {
  if (!tamanho) return 0;
  return Math.max(0, tamanho.maxRecheios - escolhidos);
}

/** Menor preço possível do produto, para mostrar no card do cardápio. */
export function precoAPartirDe(produto: Produto): number {
  return Math.min(...produto.tamanhos.map((tamanho) => tamanho.preco));
}

export function restam(produto: Produto): number | null {
  if (!produto.limite) return null;
  return Math.max(0, produto.limite.total - produto.limite.vendidos);
}
