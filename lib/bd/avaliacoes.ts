import type { Executor } from "./cliente";

export type EstadoAvaliacao = "nova" | "publicada" | "escondida";

export type Avaliacao = {
  id: string;
  nome: string;
  nota: number;
  comentario: string;
  estado: EstadoAvaliacao;
  resposta: string;
  criadaEm: string;
  /** Veio de uma encomenda feita pelo site. */
  verificada: boolean;
};

export type ResumoAvaliacoes = {
  media: number;
  quantas: number;
  /** Quantas de cada nota, da 1 à 5, para a barra de distribuição. */
  porNota: number[];
};

function linhaParaAvaliacao(l: Record<string, unknown>): Avaliacao {
  return {
    id: String(l.id),
    nome: String(l.nome),
    nota: Number(l.nota),
    comentario: String(l.comentario ?? ""),
    estado: l.estado as EstadoAvaliacao,
    resposta: String(l.resposta ?? ""),
    criadaEm: String(l.criada_em),
    verificada: Boolean(l.pedido_id),
  };
}

/** As que a confeitaria aprovou, que são as que aparecem na página dela. */
export async function avaliacoesPublicas(
  exec: Executor,
  slug: string,
): Promise<{ lista: Avaliacao[]; resumo: ResumoAvaliacoes }> {
  const linhas = await exec<Record<string, unknown>>(
    `select a.* from avaliacoes a
     join confeiteiras c on c.id = a.confeiteira_id
     where c.slug = $1 and a.estado = 'publicada'
     order by a.criada_em desc
     limit 50`,
    [slug],
  );
  const lista = linhas.map(linhaParaAvaliacao);

  const porNota = [0, 0, 0, 0, 0];
  for (const a of lista) porNota[a.nota - 1] += 1;
  const soma = lista.reduce((total, a) => total + a.nota, 0);

  return {
    lista,
    resumo: {
      quantas: lista.length,
      media: lista.length ? soma / lista.length : 0,
      porNota,
    },
  };
}

/** Todas, para o painel dela — incluindo as que ainda não tratou. */
export async function avaliacoesDaConfeiteira(
  exec: Executor,
  slug: string,
): Promise<Avaliacao[]> {
  const linhas = await exec<Record<string, unknown>>(
    `select a.* from avaliacoes a
     join confeiteiras c on c.id = a.confeiteira_id
     where c.slug = $1
     order by (a.estado = 'nova') desc, a.criada_em desc`,
    [slug],
  );
  return linhas.map(linhaParaAvaliacao);
}

export type AvaliacaoNova = {
  nome: string;
  nota: number;
  comentario: string;
};

/**
 * Recebe uma avaliação.
 *
 * Entra como "nova" e não aparece na página enquanto a confeitaria não a
 * aprovar. Não é para ela esconder o que não gosta — é a única defesa que
 * tem contra spam e contra quem lhe queira fazer mal — e a página diz que
 * funciona assim, para quem lê saber o que está a ler.
 */
export async function criarAvaliacao(
  exec: Executor,
  slug: string,
  dados: AvaliacaoNova,
): Promise<{ ok: true } | { erro: "semConta" }> {
  const [conta] = await exec<{ id: string }>(
    `select id from confeiteiras where slug = $1 and not suspensa`,
    [slug],
  );
  if (!conta) return { erro: "semConta" };

  await exec(
    `insert into avaliacoes (confeiteira_id, nome, nota, comentario)
     values ($1,$2,$3,$4)`,
    [conta.id, dados.nome, dados.nota, dados.comentario],
  );
  return { ok: true };
}

export async function mudarEstadoAvaliacao(
  exec: Executor,
  slug: string,
  id: string,
  estado: EstadoAvaliacao,
): Promise<void> {
  // O slug entra na condição de propósito: sem ele, bastava adivinhar um id
  // para mexer na avaliação de outra confeitaria.
  await exec(
    `update avaliacoes a
        set estado = $3, tratada_em = now()
       from confeiteiras c
      where c.id = a.confeiteira_id and c.slug = $1 and a.id = $2`,
    [slug, id, estado],
  );
}

export async function responderAvaliacao(
  exec: Executor,
  slug: string,
  id: string,
  resposta: string,
): Promise<void> {
  await exec(
    `update avaliacoes a
        set resposta = $3
       from confeiteiras c
      where c.id = a.confeiteira_id and c.slug = $1 and a.id = $2`,
    [slug, id, resposta.slice(0, 1000)],
  );
}
