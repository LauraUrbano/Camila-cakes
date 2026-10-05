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

export async function lojasDaBase(exec: Executor): Promise<Loja[]> {
  const confeiteiras = await exec<{
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
  }>(`select * from confeiteiras order by criada_em, slug`);

  const lojas: Loja[] = [];

  for (const c of confeiteiras) {
    const entregas = await exec<{
      chave: string;
      tipo: "retirada" | "entrega";
      nome: string;
      descricao: string;
      taxa: string;
    }>(
      `select chave, tipo, nome, descricao, taxa from entregas
       where confeiteira_id = $1 order by ordem, nome`,
      [c.id],
    );

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
      entregas: entregas.map((e) => ({
        id: e.chave,
        tipo: e.tipo,
        nome: e.nome,
        descricao: e.descricao,
        taxa: numero(e.taxa),
      })),
    };

    const linhas = await exec<LinhaProduto>(
      `select * from produtos where confeiteira_id = $1 and activo
       order by ordem, nome`,
      [c.id],
    );

    const produtos: Produto[] = [];
    const chavePorId = new Map<string, string>();

    for (const p of linhas) {
      chavePorId.set(p.id, p.chave);
      const tamanhos = await exec<{
        chave: string;
        nome: string;
        porcoes: string;
        preco: string;
        max_recheios: number;
      }>(
        `select chave, nome, porcoes, preco, max_recheios from tamanhos
         where produto_id = $1 order by ordem, preco`,
        [p.id],
      );
      const opcoes = await exec<{
        grupo: "massa" | "recheio" | "decoracao";
        chave: string;
        nome: string;
        acrescimo: string;
        disponivel: boolean;
      }>(
        `select grupo, chave, nome, acrescimo, disponivel from opcoes
         where produto_id = $1 order by grupo, ordem, nome`,
        [p.id],
      );

      const doGrupo = (grupo: string): Opcao[] =>
        opcoes
          .filter((o) => o.grupo === grupo)
          .map((o) => ({
            id: o.chave,
            nome: o.nome,
            acrescimo: numero(o.acrescimo),
            disponivel: o.disponivel,
          }));

      produtos.push({
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
        tamanhos: tamanhos.map((t) => ({
          id: t.chave,
          nome: t.nome,
          porcoes: t.porcoes,
          preco: numero(t.preco),
          maxRecheios: t.max_recheios,
        })),
        massas: doGrupo("massa"),
        recheios: doGrupo("recheio"),
        decoracoes: doGrupo("decoracao"),
      });
    }

    const linhasColecoes = await exec<{
      id: string;
      chave: string;
      nome: string;
      descricao: string;
      periodo: string;
      ativa: boolean;
      destaque: boolean;
    }>(
      `select id, chave, nome, descricao, periodo, ativa, destaque
       from colecoes where confeiteira_id = $1 order by ordem, nome`,
      [c.id],
    );

    const colecoes: Colecao[] = [];
    for (const col of linhasColecoes) {
      const ligacoes = await exec<{ produto_id: string }>(
        `select produto_id from colecao_produtos
         where colecao_id = $1 order by ordem`,
        [col.id],
      );
      colecoes.push({
        id: col.chave,
        nome: col.nome,
        descricao: col.descricao,
        periodo: col.periodo,
        ativa: col.ativa,
        destaque: col.destaque,
        produtoIds: ligacoes
          .map((l) => chavePorId.get(l.produto_id))
          .filter((chave): chave is string => Boolean(chave)),
      });
    }

    const linhasPedidos = await exec<{
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
      `select * from pedidos where confeiteira_id = $1
       order by criado_em desc, referencia desc`,
      [c.id],
    );

    const diaMes = (valor: string | null) =>
      valor ? new Date(valor).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }) : "";

    const pedidos: Pedido[] = [];
    for (const ped of linhasPedidos) {
      const itens = await exec<{
        produto_nome: string;
        tamanho_nome: string;
        massa_nome: string;
        recheios: string[];
        decoracoes: string[];
        observacao: string | null;
        total: string;
      }>(
        `select * from pedido_itens where pedido_id = $1 order by ordem`,
        [ped.id],
      );
      pedidos.push({
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
        itens: itens.map((i) => ({
          produtoNome: i.produto_nome,
          tamanhoNome: i.tamanho_nome,
          massaNome: i.massa_nome,
          recheiosNomes: i.recheios,
          decoracoesNomes: i.decoracoes,
          observacao: i.observacao ?? undefined,
          total: numero(i.total),
        })),
      });
    }

    const meses = await exec<{
      mes: string;
      receita: string;
      encomendas: number;
    }>(
      `select mes, receita, encomendas from historico_mensal
       where confeiteira_id = $1 order by mes`,
      [c.id],
    );
    const historico: MesFechado[] = meses.map((m) => ({
      mes: new Date(m.mes).toLocaleDateString("pt-PT", { month: "short" }),
      receita: numero(m.receita),
      encomendas: m.encomendas,
    }));

    const [assinatura] = await exec<{
      plano_id: string;
      estado: Loja["assinatura"]["estado"];
      origem: Loja["assinatura"]["origem"];
      periodo: "mensal" | "anual";
      renova_em: string | null;
      cartao: string | null;
      codigo: string | null;
    }>(`select * from assinaturas where confeiteira_id = $1`, [c.id]);

    const faturas = await exec<{
      referencia: string;
      emitida_em: string;
      valor: string;
      paga: boolean;
    }>(
      `select referencia, emitida_em, valor, paga from faturas
       where confeiteira_id = $1 order by emitida_em desc`,
      [c.id],
    );

    lojas.push({
      confeiteira,
      produtos,
      colecoes,
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
        faturas: faturas.map((f) => ({
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
