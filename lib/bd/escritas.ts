import type { Executor } from "./cliente";
import type { StatusPedido } from "@/lib/tipos";

export type ItemNovo = {
  produtoNome: string;
  tamanhoNome: string;
  massaNome: string;
  recheiosNomes: string[];
  decoracoesNomes: string[];
  observacao?: string;
  total: number;
};

export type PedidoNovo = {
  slug: string;
  cliente: string;
  telefone: string;
  /** ISO (AAAA-MM-DD). Vazio quando a cliente não escolheu data. */
  entregaEm?: string;
  entregaNome: string;
  entregaTipo: "retirada" | "entrega";
  entregaTaxa: number;
  itens: ItemNovo[];
  personalizado?: string;
};

/**
 * Grava uma encomenda nova.
 *
 * Entra sempre como "aguardando": é uma reserva, não um compromisso, e só o
 * aceite da confeiteira a põe na agenda. A regra do produto está também no
 * esquema, numa restrição — um pedido aceite tem de ter data de aceite.
 *
 * A numeração é por confeiteira e é calculada dentro do próprio INSERT. Duas
 * encomendas ao mesmo segundo podem escolher o mesmo número; nesse caso a
 * restrição de unicidade rejeita uma, e tentamos de novo em vez de gravar
 * duas com a mesma referência.
 */
export async function criarPedido(
  exec: Executor,
  pedido: PedidoNovo,
): Promise<{ referencia: string } | null> {
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    try {
      const [confeiteira] = await exec<{ id: string }>(
        `select id from confeiteiras where slug = $1`,
        [pedido.slug],
      );
      if (!confeiteira) return null;

      const [cliente] = await exec<{ id: string }>(
        `insert into clientes (confeiteira_id, nome, telefone)
         values ($1,$2,$3)
         on conflict (confeiteira_id, telefone)
           do update set nome = excluded.nome
         returning id`,
        [confeiteira.id, pedido.cliente, pedido.telefone],
      );

      const [criado] = await exec<{ referencia: string; id: string }>(
        `insert into pedidos
           (confeiteira_id, numero, referencia, cliente_id, cliente_nome,
            telefone, entrega_em, entrega_nome, entrega_tipo, entrega_taxa,
            status, personalizado)
         select $1, proximo, 'ENC-' || proximo, $2, $3, $4, $5, $6, $7, $8,
                'aguardando', $9
         from (
           select coalesce(max(numero), 100) + 1 as proximo
           from pedidos where confeiteira_id = $1
         ) as seguinte
         returning id, referencia`,
        [
          confeiteira.id,
          cliente.id,
          pedido.cliente,
          pedido.telefone,
          pedido.entregaEm || null,
          pedido.entregaNome,
          pedido.entregaTipo,
          pedido.entregaTaxa,
          pedido.personalizado ?? null,
        ],
      );

      for (const [i, item] of pedido.itens.entries()) {
        await exec(
          `insert into pedido_itens
             (pedido_id, produto_nome, tamanho_nome, massa_nome, recheios,
              decoracoes, observacao, total, ordem)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            criado.id,
            item.produtoNome,
            item.tamanhoNome,
            item.massaNome,
            item.recheiosNomes,
            item.decoracoesNomes,
            item.observacao ?? null,
            item.total,
            i,
          ],
        );
      }

      return { referencia: criado.referencia };
    } catch (erro) {
      const mensagem = String(erro);
      const colisao =
        mensagem.includes("numero_unico_por_confeiteira") ||
        mensagem.includes("pedidos_confeiteira_id_referencia_key");
      if (!colisao || tentativa === 2) throw erro;
    }
  }
  return null;
}

/**
 * Muda o estado de uma encomenda.
 *
 * A data de aceite acompanha o estado porque o esquema exige coerência entre
 * os dois: aceite guarda quando a confeiteira disse que sim, e recusar ou
 * voltar a pendente limpa-a.
 */
export async function mudarEstadoPedido(
  exec: Executor,
  slug: string,
  referencia: string,
  status: StatusPedido,
): Promise<boolean> {
  const semAceite = status === "aguardando" || status === "recusado";
  const linhas = await exec<{ id: string }>(
    `update pedidos set
       status = $3,
       aceite_em = case
         when $4::boolean then null
         else coalesce(aceite_em, now())
       end
     where referencia = $2
       and confeiteira_id = (select id from confeiteiras where slug = $1)
     returning id`,
    [slug, referencia, status, semAceite],
  );
  return linhas.length > 0;
}
