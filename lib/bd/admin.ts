import type { Executor } from "./cliente";
import type { Moeda } from "@/lib/tipos";

const numero = (valor: unknown): number => Number(valor ?? 0);

export type ContaResumo = {
  id: string;
  slug: string;
  nome: string;
  cidade: string;
  pais: string;
  moeda: Moeda;
  criadaEm: string;
  suspensa: boolean;
  suspensaMotivo: string | null;
  planoId: string;
  estado: string;
  origem: string;
  periodo: "mensal" | "anual";
  codigo: string | null;
  produtos: number;
  pedidos: number;
  pedidosMes: number;
  ultimoPedido: string | null;
};

export type MetricasPlataforma = {
  contas: { total: number; activas: number; suspensas: number };
  porPlano: { planoId: string; quantas: number }[];
  /**
   * Receita recorrente por moeda, nunca somada entre elas: 12,90 € e
   * R$ 24,90 não dão 37,80 de nada. Quem quiser um total converte-o com uma
   * taxa e assume a data dessa taxa.
   */
  recorrentePorMoeda: { moeda: Moeda; mensal: number; contas: number }[];
  pedidos: { total: number; mes: number; aceites: number; recusados: number };
  novasContasPorMes: { mes: string; quantas: number }[];
};

export async function metricasDaPlataforma(
  exec: Executor,
): Promise<MetricasPlataforma> {
  const [contas] = await exec<{
    total: string;
    activas: string;
    suspensas: string;
  }>(`select count(*)::text as total,
             count(*) filter (where not suspensa)::text as activas,
             count(*) filter (where suspensa)::text as suspensas
      from confeiteiras`);

  const porPlano = await exec<{ plano_id: string; quantas: string }>(
    `select a.plano_id, count(*)::text as quantas
     from assinaturas a
     join confeiteiras c on c.id = a.confeiteira_id
     where not c.suspensa
     group by a.plano_id`,
  );

  /**
   * Só conta quem paga: planos gratuitos e acessos vitalícios ficam de fora,
   * porque não entra dinheiro por eles. O anual é dividido por doze para
   * ficar comparável com o mensal.
   */
  const recorrente = await exec<{
    moeda: Moeda;
    mensal: string;
    contas: string;
  }>(
    `select c.moeda,
            sum(case when a.periodo = 'anual' then p.valor / 12 else p.valor end) as mensal,
            count(*)::text as contas
     from assinaturas a
     join confeiteiras c on c.id = a.confeiteira_id
     join plano_precos p
       on p.plano_id = a.plano_id
      and p.moeda = c.moeda
      and p.periodo = a.periodo
     where a.origem = 'stripe'
       and a.estado in ('activa', 'pagamento_falhou')
       and not c.suspensa
       and p.valor > 0
     group by c.moeda`,
  );

  const [pedidos] = await exec<{
    total: string;
    mes: string;
    aceites: string;
    recusados: string;
  }>(
    `select count(*)::text as total,
            count(*) filter (where criado_em >= date_trunc('month', now()))::text as mes,
            count(*) filter (where status in ('aceito','producao','entregue'))::text as aceites,
            count(*) filter (where status = 'recusado')::text as recusados
     from pedidos`,
  );

  const novas = await exec<{ mes: string; quantas: string }>(
    `select to_char(date_trunc('month', criada_em), 'YYYY-MM') as mes,
            count(*)::text as quantas
     from confeiteiras
     where criada_em >= now() - interval '6 months'
     group by 1 order by 1`,
  );

  return {
    contas: {
      total: numero(contas?.total),
      activas: numero(contas?.activas),
      suspensas: numero(contas?.suspensas),
    },
    porPlano: porPlano.map((l) => ({
      planoId: l.plano_id,
      quantas: numero(l.quantas),
    })),
    recorrentePorMoeda: recorrente.map((l) => ({
      moeda: l.moeda,
      mensal: numero(l.mensal),
      contas: numero(l.contas),
    })),
    pedidos: {
      total: numero(pedidos?.total),
      mes: numero(pedidos?.mes),
      aceites: numero(pedidos?.aceites),
      recusados: numero(pedidos?.recusados),
    },
    novasContasPorMes: novas.map((l) => ({
      mes: l.mes,
      quantas: numero(l.quantas),
    })),
  };
}

export async function contas(exec: Executor): Promise<ContaResumo[]> {
  const linhas = await exec<Record<string, unknown>>(
    `select c.id, c.slug, c.nome, c.cidade, c.pais, c.moeda, c.criada_em,
            c.suspensa, c.suspensa_motivo,
            a.plano_id, a.estado, a.origem, a.periodo, a.codigo,
            (select count(*) from produtos p
              where p.confeiteira_id = c.id and p.activo) as produtos,
            (select count(*) from pedidos p
              where p.confeiteira_id = c.id) as pedidos,
            (select count(*) from pedidos p
              where p.confeiteira_id = c.id
                and p.criado_em >= date_trunc('month', now())) as pedidos_mes,
            (select max(p.criado_em) from pedidos p
              where p.confeiteira_id = c.id) as ultimo_pedido
     from confeiteiras c
     left join assinaturas a on a.confeiteira_id = c.id
     order by c.suspensa, c.criada_em desc`,
  );

  return linhas.map((l) => ({
    id: String(l.id),
    slug: String(l.slug),
    nome: String(l.nome),
    cidade: String(l.cidade),
    pais: String(l.pais),
    moeda: l.moeda as Moeda,
    criadaEm: String(l.criada_em),
    suspensa: Boolean(l.suspensa),
    suspensaMotivo: (l.suspensa_motivo as string | null) ?? null,
    planoId: String(l.plano_id ?? "prova"),
    estado: String(l.estado ?? "teste"),
    origem: String(l.origem ?? "stripe"),
    periodo: (l.periodo as "mensal" | "anual") ?? "mensal",
    codigo: (l.codigo as string | null) ?? null,
    produtos: numero(l.produtos),
    pedidos: numero(l.pedidos),
    pedidosMes: numero(l.pedidos_mes),
    ultimoPedido: (l.ultimo_pedido as string | null) ?? null,
  }));
}

// ------------------------------------------------------------------ códigos

export type CodigoResumo = {
  codigo: string;
  planoId: string;
  usos: number;
  maxUsos: number;
  nota: string;
  resgatadoPor: string[];
};

export async function codigos(exec: Executor): Promise<CodigoResumo[]> {
  const linhas = await exec<Record<string, unknown>>(
    `select v.codigo, v.plano_id, v.usos, v.max_usos, v.nota,
            coalesce(
              array_agg(c.nome order by r.resgatado_em)
                filter (where c.nome is not null),
              '{}'
            ) as resgatado_por
     from codigos_vitalicios v
     left join resgates r on r.codigo = v.codigo
     left join confeiteiras c on c.id = r.confeiteira_id
     group by v.codigo, v.plano_id, v.usos, v.max_usos, v.nota, v.criado_em
     order by v.criado_em desc`,
  );
  return linhas.map((l) => ({
    codigo: String(l.codigo),
    planoId: String(l.plano_id),
    usos: numero(l.usos),
    maxUsos: numero(l.max_usos),
    nota: String(l.nota ?? ""),
    resgatadoPor: (l.resgatado_por as string[]) ?? [],
  }));
}

export async function criarCodigo(
  exec: Executor,
  dados: { codigo: string; planoId: string; maxUsos: number; nota: string },
): Promise<boolean> {
  const linhas = await exec<{ codigo: string }>(
    `insert into codigos_vitalicios (codigo, plano_id, max_usos, nota)
     values ($1,$2,$3,$4)
     on conflict (codigo) do nothing
     returning codigo`,
    [dados.codigo, dados.planoId, dados.maxUsos, dados.nota],
  );
  return linhas.length > 0;
}

// --------------------------------------------------------------- definições

export type Definicao = {
  chave: string;
  valor: string;
  descricao: string;
  sensivel: boolean;
};

export async function definicoes(exec: Executor): Promise<Definicao[]> {
  const linhas = await exec<Record<string, unknown>>(
    `select chave, valor, descricao, sensivel from definicoes order by chave`,
  );
  return linhas.map((l) => ({
    chave: String(l.chave),
    valor: String(l.valor ?? ""),
    descricao: String(l.descricao ?? ""),
    sensivel: Boolean(l.sensivel),
  }));
}

export async function guardarDefinicao(
  exec: Executor,
  chave: string,
  valor: string,
): Promise<void> {
  await exec(
    `insert into definicoes (chave, valor) values ($1,$2)
     on conflict (chave) do update set
       valor = excluded.valor, actualizada_em = now()`,
    [chave, valor],
  );
}

export async function suspenderConta(
  exec: Executor,
  slug: string,
  suspensa: boolean,
  motivo?: string,
): Promise<void> {
  await exec(
    `update confeiteiras set suspensa = $2, suspensa_motivo = $3
     where slug = $1`,
    [slug, suspensa, suspensa ? (motivo ?? "") : null],
  );
}

export async function mudarPlano(
  exec: Executor,
  slug: string,
  planoId: string,
): Promise<void> {
  await exec(
    `update assinaturas set plano_id = $2, actualizada_em = now()
     where confeiteira_id = (select id from confeiteiras where slug = $1)`,
    [slug, planoId],
  );
}
