import type { Executor } from "./cliente";
import type {
  Colecao,
  Confeiteira,
  Loja,
  MesFechado,
  Opcao,
  Pedido,
  Produto,
  StatusPedido,
} from "@/lib/tipos";

/**
 * Lê as lojas da base e devolve-as na forma que as telas já usam, para o
 * resto da aplicação não ter de saber de onde vieram.
 *
 * O Postgres devolve `numeric` como texto, de propósito: converter para
 * número em JavaScript perderia precisão em valores grandes. Como aqui são
 * preços de bolos, a conversão é segura — mas tem de ser explícita, e não
 * acidental.
 */
const numero = (valor: unknown): number => Number(valor ?? 0);

type LinhaProduto = {
  id: string;
  chave: string;
  nome: string;
  descricao: string;
  categoria: string;
  foto: string | null;
  cor: string;
  max_decoracoes: number;
  antecedencia_dias: number;
  limite_total: number | null;
  limite_vendidos: number;
};

/**
 * Quantas voltas à base é que uma página custa.
 *
 * O condutor do Neon fala por HTTP: cada instrução é um pedido de rede
 * próprio, e um pedido de rede custa perto de um décimo de segundo. Ler
 * produto a produto — uma volta para os tamanhos, outra para as opções —
 * dava setenta voltas numa página e oito segundos de espera no telemóvel.
 *
 * Por isso aqui não há consultas dentro de ciclos. Pede-se cada tabela uma
 * vez, para todas as confeitarias de uma vez, e agrupa-se em memória. O
 * número de voltas passa a ser fixo, e deixa de crescer com o número de
 * bolos que ela põe no cardápio.
 */
function agrupar<L, C>(linhas: L[], chave: (linha: L) => C): Map<C, L[]> {
  const mapa = new Map<C, L[]>();
  for (const linha of linhas) {
    const k = chave(linha);
    const lista = mapa.get(k);
    if (lista) lista.push(linha);
    else mapa.set(k, [linha]);
  }
  return mapa;
}

type LinhaConfeiteira = {
  id: string;
  slug: string;
  nome: string;
  tagline: string;
  bio: string;
  cidade: string;
  pais: Confeiteira["pais"];
  moeda: Confeiteira["moeda"];
  whatsapp: string;
  instagram: string;
  dominio_proprio: string | null;
  tema: Confeiteira["tema"];
  aceita_personalizado: boolean;
  aviso_pagamento: string;
  lingua: string | null;
  modelo: string | null;
};

const diaMes = (valor: string | null) =>
  valor
    ? new Date(valor).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" })
    : "";

/**
 * O cardápio e a montra de um conjunto de confeitarias.
 *
 * É o que a página pública precisa, e mais nada: encomendas, facturas e
 * assinatura não entram aqui. Quem abre `cakelyo.app/bolos-de-casa` não tem
 * de pagar a leitura da contabilidade dela.
 */
async function montras(
  exec: Executor,
  confeiteiras: LinhaConfeiteira[],
): Promise<Map<string, { confeiteira: Confeiteira; produtos: Produto[]; colecoes: Colecao[] }>> {
  const ids = confeiteiras.map((c) => c.id);
  const montras = new Map<
    string,
    { confeiteira: Confeiteira; produtos: Produto[]; colecoes: Colecao[] }
  >();
  if (ids.length === 0) return montras;

  const [entregas, linhasProdutos, linhasColecoes] = await Promise.all([
    exec<{
      confeiteira_id: string;
      chave: string;
      tipo: "retirada" | "entrega";
      nome: string;
      descricao: string;
      taxa: string;
    }>(
      `select confeiteira_id, chave, tipo, nome, descricao, taxa from entregas
       where confeiteira_id = any($1::uuid[]) order by ordem, nome`,
      [ids],
    ),
    exec<LinhaProduto & { confeiteira_id: string }>(
      `select * from produtos where confeiteira_id = any($1::uuid[]) and activo
       order by ordem, nome`,
      [ids],
    ),
    exec<{
      confeiteira_id: string;
      id: string;
      chave: string;
      nome: string;
      descricao: string;
      periodo: string;
      ativa: boolean;
      destaque: boolean;
    }>(
      `select confeiteira_id, id, chave, nome, descricao, periodo, ativa, destaque
       from colecoes where confeiteira_id = any($1::uuid[]) order by ordem, nome`,
      [ids],
    ),
  ]);

  const produtoIds = linhasProdutos.map((p) => p.id);
  const colecaoIds = linhasColecoes.map((c) => c.id);

  const [tamanhos, opcoes, ligacoes] = await Promise.all([
    produtoIds.length
      ? exec<{
          produto_id: string;
          chave: string;
          nome: string;
          porcoes: string;
          preco: string;
          max_recheios: number;
        }>(
          `select produto_id, chave, nome, porcoes, preco, max_recheios from tamanhos
           where produto_id = any($1::uuid[]) order by ordem, preco`,
          [produtoIds],
        )
      : [],
    produtoIds.length
      ? exec<{
          produto_id: string;
          grupo: "massa" | "recheio" | "decoracao";
          chave: string;
          nome: string;
          acrescimo: string;
          disponivel: boolean;
        }>(
          `select produto_id, grupo, chave, nome, acrescimo, disponivel from opcoes
           where produto_id = any($1::uuid[]) order by grupo, ordem, nome`,
          [produtoIds],
        )
      : [],
    colecaoIds.length
      ? exec<{ colecao_id: string; produto_id: string }>(
          `select colecao_id, produto_id from colecao_produtos
           where colecao_id = any($1::uuid[]) order by ordem`,
          [colecaoIds],
        )
      : [],
  ]);

  const entregasPor = agrupar(entregas, (e) => e.confeiteira_id);
  const produtosPor = agrupar(linhasProdutos, (p) => p.confeiteira_id);
  const colecoesPor = agrupar(linhasColecoes, (c) => c.confeiteira_id);
  const tamanhosPor = agrupar(tamanhos, (t) => t.produto_id);
  const opcoesPor = agrupar(opcoes, (o) => o.produto_id);
  const ligacoesPor = agrupar(ligacoes, (l) => l.colecao_id);
  const chavePorId = new Map(linhasProdutos.map((p) => [p.id, p.chave]));

  for (const c of confeiteiras) {
    const confeiteira: Confeiteira = {
      slug: c.slug,
      nome: c.nome,
      tagline: c.tagline,
      bio: c.bio,
      cidade: c.cidade,
      pais: c.pais,
      moeda: c.moeda,
      lingua: c.lingua ?? undefined,
      modelo: c.modelo ?? undefined,
      whatsapp: c.whatsapp,
      instagram: c.instagram,
      dominioProprio: c.dominio_proprio ?? undefined,
      tema: typeof c.tema === "string" ? JSON.parse(c.tema) : c.tema,
      aceitaPersonalizado: c.aceita_personalizado,
      avisoPagamento: c.aviso_pagamento,
      entregas: (entregasPor.get(c.id) ?? []).map((e) => ({
        id: e.chave,
        tipo: e.tipo,
        nome: e.nome,
        descricao: e.descricao,
        taxa: numero(e.taxa),
      })),
    };

    const produtos: Produto[] = (produtosPor.get(c.id) ?? []).map((p) => {
      const minhas = opcoesPor.get(p.id) ?? [];
      const doGrupo = (grupo: string): Opcao[] =>
        minhas
          .filter((o) => o.grupo === grupo)
          .map((o) => ({
            id: o.chave,
            nome: o.nome,
            acrescimo: numero(o.acrescimo),
            disponivel: o.disponivel,
          }));

      return {
        id: p.chave,
        nome: p.nome,
        descricao: p.descricao,
        categoria: p.categoria,
        foto: p.foto ?? "",
        cor: p.cor,
        maxDecoracoes: p.max_decoracoes,
        antecedenciaDias: p.antecedencia_dias,
        limite:
          p.limite_total === null
            ? undefined
            : { total: p.limite_total, vendidos: p.limite_vendidos },
        tamanhos: (tamanhosPor.get(p.id) ?? []).map((t) => ({
          id: t.chave,
          nome: t.nome,
          porcoes: t.porcoes,
          preco: numero(t.preco),
          maxRecheios: t.max_recheios,
        })),
        massas: doGrupo("massa"),
        recheios: doGrupo("recheio"),
        decoracoes: doGrupo("decoracao"),
      };
    });

    const colecoes: Colecao[] = (colecoesPor.get(c.id) ?? []).map((col) => ({
      id: col.chave,
      nome: col.nome,
      descricao: col.descricao,
      periodo: col.periodo,
      ativa: col.ativa,
      destaque: col.destaque,
      produtoIds: (ligacoesPor.get(col.id) ?? [])
        .map((l) => chavePorId.get(l.produto_id))
        .filter((chave): chave is string => Boolean(chave)),
    }));

    montras.set(c.id, { confeiteira, produtos, colecoes });
  }

  return montras;
}

/**
 * A montra de uma confeitaria, sem a contabilidade dela.
 *
 * É o que servem as páginas públicas. Lê uma confeitaria, não todas: antes
 * disto, abrir a página da Camila lia também a loja inteira de todas as
 * outras — encomendas e facturas incluídas — para depois deitar fora.
 */
export async function montraDaBase(
  exec: Executor,
  slug: string,
): Promise<Pick<Loja, "confeiteira" | "produtos" | "colecoes"> | undefined> {
  const confeiteiras = await exec<LinhaConfeiteira>(
    `select * from confeiteiras where slug = $1`,
    [slug],
  );
  if (confeiteiras.length === 0) return undefined;
  const mapa = await montras(exec, confeiteiras);
  return mapa.get(confeiteiras[0].id);
}

/**
 * A montra de todas as confeitarias — para o índice e para o mapa do sítio,
 * que mostram o cardápio delas mas não têm nada que ver com as encomendas.
 */
export async function montrasDaBase(
  exec: Executor,
): Promise<Pick<Loja, "confeiteira" | "produtos" | "colecoes">[]> {
  const confeiteiras = await exec<LinhaConfeiteira>(
    `select * from confeiteiras order by criada_em, slug`,
  );
  const mapa = await montras(exec, confeiteiras);
  return confeiteiras
    .map((c) => mapa.get(c.id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
}

/** Só o que o índice e o mapa do sítio precisam: nome, slug, frase. */
export async function vitrinesDaBase(
  exec: Executor,
): Promise<Pick<Confeiteira, "slug" | "nome" | "tagline" | "cidade">[]> {
  return exec(
    `select slug, nome, tagline, cidade from confeiteiras order by criada_em, slug`,
  );
}

export async function lojasDaBase(exec: Executor): Promise<Loja[]> {
  const confeiteiras = await exec<LinhaConfeiteira>(
    `select * from confeiteiras order by criada_em, slug`,
  );
  return lojasCompletas(exec, confeiteiras);
}

/**
 * A loja inteira de uma confeitaria — cardápio, encomendas, contas.
 *
 * É o que o painel dela precisa, e só o painel dela.
 */
export async function lojaDaBase(
  exec: Executor,
  slug: string,
): Promise<Loja | undefined> {
  const confeiteiras = await exec<LinhaConfeiteira>(
    `select * from confeiteiras where slug = $1`,
    [slug],
  );
  if (confeiteiras.length === 0) return undefined;
  return (await lojasCompletas(exec, confeiteiras))[0];
}

async function lojasCompletas(
  exec: Executor,
  confeiteiras: LinhaConfeiteira[],
): Promise<Loja[]> {
  const ids = confeiteiras.map((c) => c.id);
  if (ids.length === 0) return [];

  const [mapaMontras, linhasPedidos, meses, assinaturas, faturas] = await Promise.all([
    montras(exec, confeiteiras),
    exec<{
      confeiteira_id: string;
      id: string;
      referencia: string;
      cliente_nome: string;
      telefone: string;
      criado_em: string;
      entrega_em: string | null;
      entrega_nome: string;
      entrega_tipo: "retirada" | "entrega" | null;
      entrega_taxa: string;
      status: StatusPedido;
      personalizado: string | null;
    }>(
      `select * from pedidos where confeiteira_id = any($1::uuid[])
       order by criado_em desc, referencia desc`,
      [ids],
    ),
    exec<{ confeiteira_id: string; mes: string; receita: string; encomendas: number }>(
      `select confeiteira_id, mes, receita, encomendas from historico_mensal
       where confeiteira_id = any($1::uuid[]) order by mes`,
      [ids],
    ),
    exec<{
      confeiteira_id: string;
      plano_id: string;
      estado: Loja["assinatura"]["estado"];
      origem: Loja["assinatura"]["origem"];
      periodo: "mensal" | "anual";
      renova_em: string | null;
      cartao: string | null;
      codigo: string | null;
    }>(`select * from assinaturas where confeiteira_id = any($1::uuid[])`, [ids]),
    exec<{
      confeiteira_id: string;
      referencia: string;
      emitida_em: string;
      valor: string;
      paga: boolean;
    }>(
      `select confeiteira_id, referencia, emitida_em, valor, paga from faturas
       where confeiteira_id = any($1::uuid[]) order by emitida_em desc`,
      [ids],
    ),
  ]);

  const pedidoIds = linhasPedidos.map((p) => p.id);
  const itens = pedidoIds.length
    ? await exec<{
        pedido_id: string;
        produto_nome: string;
        tamanho_nome: string;
        massa_nome: string;
        recheios: string[];
        decoracoes: string[];
        observacao: string | null;
        total: string;
      }>(
        `select * from pedido_itens where pedido_id = any($1::uuid[]) order by ordem`,
        [pedidoIds],
      )
    : [];

  const pedidosPor = agrupar(linhasPedidos, (p) => p.confeiteira_id);
  const itensPor = agrupar(itens, (i) => i.pedido_id);
  const mesesPor = agrupar(meses, (m) => m.confeiteira_id);
  const faturasPor = agrupar(faturas, (f) => f.confeiteira_id);
  const assinaturaPor = new Map(assinaturas.map((a) => [a.confeiteira_id, a]));

  const lojas: Loja[] = [];
  for (const c of confeiteiras) {
    const montra = mapaMontras.get(c.id);
    if (!montra) continue;

    const pedidos: Pedido[] = (pedidosPor.get(c.id) ?? []).map((ped) => ({
      id: ped.referencia,
      cliente: ped.cliente_nome,
      telefone: ped.telefone,
      criadoEm: diaMes(ped.criado_em),
      entregaEm: diaMes(ped.entrega_em),
      entrega: {
        id: ped.entrega_nome,
        tipo: ped.entrega_tipo ?? "retirada",
        nome: ped.entrega_nome,
        descricao: "",
        taxa: numero(ped.entrega_taxa),
      },
      status: ped.status,
      personalizado: ped.personalizado ?? undefined,
      itens: (itensPor.get(ped.id) ?? []).map((i) => ({
        produtoNome: i.produto_nome,
        tamanhoNome: i.tamanho_nome,
        massaNome: i.massa_nome,
        recheiosNomes: i.recheios,
        decoracoesNomes: i.decoracoes,
        observacao: i.observacao ?? undefined,
        total: numero(i.total),
      })),
    }));

    const historico: MesFechado[] = (mesesPor.get(c.id) ?? []).map((m) => ({
      mes: new Date(m.mes).toLocaleDateString("pt-PT", { month: "short" }),
      receita: numero(m.receita),
      encomendas: m.encomendas,
    }));

    const assinatura = assinaturaPor.get(c.id);

    lojas.push({
      confeiteira: montra.confeiteira,
      produtos: montra.produtos,
      colecoes: montra.colecoes,
      pedidos,
      historico,
      assinatura: {
        planoId: assinatura?.plano_id ?? "prova",
        estado: assinatura?.estado ?? "teste",
        origem: assinatura?.origem ?? "stripe",
        periodo: assinatura?.periodo ?? "mensal",
        renovaEm: assinatura?.renova_em ?? "—",
        cartao: assinatura?.cartao ?? undefined,
        codigo: assinatura?.codigo ?? undefined,
        faturas: (faturasPor.get(c.id) ?? []).map((f) => ({
          id: f.referencia,
          data: diaMes(f.emitida_em),
          valor: numero(f.valor),
          paga: f.paga,
        })),
      },
    });
  }

  return lojas;
}

/**
 * Resgata um código numa única instrução. O `usos < max_usos` dentro do
 * UPDATE é o que impede dois resgates simultâneos de passarem do tecto —
 * ler primeiro e escrever depois deixaria essa janela aberta.
 */
export async function resgatarNaBase(
  exec: Executor,
  codigo: string,
): Promise<{ planoId: string } | null> {
  const linhas = await exec<{ plano_id: string }>(
    `update codigos_vitalicios set usos = usos + 1
     where codigo = $1 and usos < max_usos
     returning plano_id`,
    [codigo],
  );
  return linhas[0] ? { planoId: linhas[0].plano_id } : null;
}
