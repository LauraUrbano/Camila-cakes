import type { Produto, Tamanho, Opcao } from "./tipos";

export type Selecao = {
  tamanhoId: string;
  massaId: string;
  recheioIds: string[];
  decoracaoIds: string[];
};

export type LinhaPreco = {
  rotulo: string;
  detalhe: string;
  valor: number;
};

export type Orcamento = {
  linhas: LinhaPreco[];
  total: number;
  /** O que ainda falta escolher para o pedido ficar válido. */
  pendencias: string[];
  completo: boolean;
};

export function moeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
  const pendencias: string[] = [];

  const tamanho = acha(produto.tamanhos, selecao.tamanhoId);
  if (!tamanho) {
    return {
      linhas,
      total: 0,
      pendencias: ["Escolha o tamanho"],
      completo: false,
    };
  }

  linhas.push({
    rotulo: tamanho.nome,
    detalhe: tamanho.porcoes,
    valor: tamanho.preco,
  });

  const massa = acha(produto.massas, selecao.massaId);
  if (massa) {
    linhas.push({
      rotulo: `Massa ${massa.nome}`,
      detalhe: massa.acrescimo === 0 ? "inclusa" : "acréscimo",
      valor: massa.acrescimo,
    });
  } else {
    pendencias.push("Escolha a massa");
  }

  const recheios = achaVarios(produto.recheios, selecao.recheioIds);
  for (const recheio of recheios) {
    linhas.push({
      rotulo: `Recheio ${recheio.nome}`,
      detalhe: recheio.acrescimo === 0 ? "incluso" : "recheio premium",
      valor: recheio.acrescimo,
    });
  }

  if (recheios.length < tamanho.maxRecheios) {
    const faltam = tamanho.maxRecheios - recheios.length;
    pendencias.push(
      faltam === 1
        ? "Falta escolher 1 recheio"
        : `Faltam escolher ${faltam} recheios`,
    );
  }

  const decoracoes = achaVarios(produto.decoracoes, selecao.decoracaoIds);
  for (const decoracao of decoracoes) {
    linhas.push({
      rotulo: decoracao.nome,
      detalhe: "decoração",
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
