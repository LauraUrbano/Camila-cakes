"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { criarPedido, type ItemNovo } from "@/lib/bd/escritas";
import { emailDeNovaEncomenda } from "@/lib/email/mensagens";
import type { Moeda, Tema } from "@/lib/tipos";

export type ResultadoPedido =
  | { estado: "vazio" }
  | { estado: "ok"; referencia: string }
  | { estado: "erro"; erro: "campos" | "semBase" | "falhou" };

type Dados = {
  slug: string;
  cliente: string;
  telefone: string;
  email?: string;
  entregaEm?: string;
  entregaNome: string;
  entregaTipo: "retirada" | "entrega";
  entregaTaxa: number;
  itens: ItemNovo[];
  personalizado?: string;
};

/**
 * Grava a encomenda. Corre no servidor por duas razões: o preço não pode vir
 * só do browser sem passar por aqui, e a ligação à base nunca deve estar do
 * lado do cliente.
 */
export async function enviarPedido(dados: Dados): Promise<ResultadoPedido> {
  if (!dados.cliente.trim() || !dados.telefone.trim()) {
    return { estado: "erro", erro: "campos" };
  }
  if (!temBaseDeDados()) {
    // Sem base, a encomenda não tem onde ficar. Mais vale dizê-lo do que
    // mostrar "enviado" a quem contava com o bolo.
    return { estado: "erro", erro: "semBase" };
  }

  const exec = executorNeon();
  const criado = await criarPedido(exec, dados);
  if (!criado) return { estado: "erro", erro: "falhou" };

  // O aviso sai depois de a encomenda estar gravada, e nunca a faz falhar:
  // uma encomenda que existe não se perde porque o email não saiu.
  await avisarDaEncomenda(exec, dados, criado.referencia);

  revalidatePath("/dashboard/pedidos");
  revalidatePath("/dashboard");
  return { estado: "ok", referencia: criado.referencia };
}

async function avisarDaEncomenda(
  exec: ReturnType<typeof executorNeon>,
  dados: Dados,
  referencia: string,
) {
  try {
    const [conta] = await exec<{
      nome: string;
      email: string | null;
      tema: unknown;
      moeda: Moeda;
    }>(
      `select nome, email, tema, moeda from confeiteiras where slug = $1`,
      [dados.slug],
    );
    if (!conta?.email) return;

    const total =
      dados.itens.reduce((soma, item) => soma + item.total, 0) +
      dados.entregaTaxa;

    emailDeNovaEncomenda({
      para: conta.email,
      confeitaria: conta.nome,
      slug: dados.slug,
      tema: conta.tema as Tema,
      pedido: {
        referencia,
        cliente: dados.cliente,
        telefone: dados.telefone,
        entregaEm: dados.entregaEm ?? "",
        entregaNome: dados.entregaNome,
        total,
        moeda: conta.moeda,
        itens: dados.itens.map(
          (item) =>
            `<strong>${item.produtoNome}</strong> · ${item.tamanhoNome}` +
            (item.recheiosNomes.length ? ` · ${item.recheiosNomes.join(", ")}` : ""),
        ),
        personalizado: Boolean(dados.personalizado),
      },
    });
  } catch (erro) {
    console.error("[email] aviso de encomenda falhou:", erro);
  }
}
