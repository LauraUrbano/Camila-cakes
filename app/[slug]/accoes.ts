"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { criarPedido, type ItemNovo } from "@/lib/bd/escritas";

export type ResultadoPedido =
  | { estado: "vazio" }
  | { estado: "ok"; referencia: string }
  | { estado: "erro"; erro: "campos" | "semBase" | "falhou" };

type Dados = {
  slug: string;
  cliente: string;
  telefone: string;
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

  const criado = await criarPedido(executorNeon(), dados);
  if (!criado) return { estado: "erro", erro: "falhou" };

  revalidatePath("/dashboard/pedidos");
  revalidatePath("/dashboard");
  return { estado: "ok", referencia: criado.referencia };
}
