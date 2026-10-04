"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { mudarEstadoPedido } from "@/lib/bd/escritas";
import { exigirLoja } from "@/lib/fonte";
import { emailDeRespostaAoCliente } from "@/lib/email/mensagens";
import type { Moeda, StatusPedido, Tema } from "@/lib/tipos";

/**
 * Muda o estado de uma encomenda e grava-o. Antes isto era só estado do
 * React: aceitar um pedido e recarregar a página punha-o outra vez pendente.
 */
export async function mudarEstado(
  referencia: string,
  status: StatusPedido,
): Promise<{ ok: boolean }> {
  if (!temBaseDeDados()) return { ok: false };

  const { confeiteira } = await exigirLoja();
  const ok = await mudarEstadoPedido(
    executorNeon(),
    confeiteira.slug,
    referencia,
    status,
  );

  if (ok) {
    // A cliente só é avisada no que lhe muda a vida: aceite ou recusa. Um
    // email a dizer "está em produção" é ruído na caixa de entrada dela.
    if (status === "aceito" || status === "recusado") {
      await avisarACliente(confeiteira.slug, referencia, status === "aceito");
    }
    revalidatePath("/dashboard/pedidos");
    revalidatePath("/dashboard");
  }
  return { ok };
}

async function avisarACliente(
  slug: string,
  referencia: string,
  aceite: boolean,
) {
  try {
    const exec = executorNeon();
    const [linha] = await exec<{
      email: string;
      cliente_nome: string;
      entrega_em: string | null;
      entrega_nome: string;
      personalizado: string | null;
      total: string;
      confeitaria: string;
      email_confeitaria: string | null;
      tema: unknown;
      moeda: Moeda;
    }>(
      `select p.email, p.cliente_nome, p.entrega_em, p.entrega_nome,
              p.personalizado,
              coalesce((select sum(i.total) from pedido_itens i
                        where i.pedido_id = p.id), 0) + p.entrega_taxa as total,
              c.nome as confeitaria, c.email as email_confeitaria,
              c.tema, c.moeda
         from pedidos p
         join confeiteiras c on c.id = p.confeiteira_id
        where p.referencia = $2 and c.slug = $1`,
      [slug, referencia],
    );
    if (!linha?.email) return;

    emailDeRespostaAoCliente({
      para: linha.email,
      confeitaria: linha.confeitaria,
      slug,
      tema: linha.tema as Tema,
      emailDaConfeitaria: linha.email_confeitaria ?? undefined,
      aceite,
      pedido: {
        referencia,
        cliente: linha.cliente_nome,
        telefone: "",
        entregaEm: linha.entrega_em
          ? new Date(linha.entrega_em).toLocaleDateString("pt-PT")
          : "",
        entregaNome: linha.entrega_nome,
        total: Number(linha.total ?? 0),
        moeda: linha.moeda,
        itens: [],
        personalizado: Boolean(linha.personalizado),
      },
    });
  } catch (erro) {
    console.error("[email] aviso à cliente falhou:", erro);
  }
}
