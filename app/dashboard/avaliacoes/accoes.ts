"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { exigirLoja } from "@/lib/fonte";
import {
  mudarEstadoAvaliacao,
  responderAvaliacao,
  type EstadoAvaliacao,
} from "@/lib/bd/avaliacoes";

/**
 * Todas as acções daqui passam pela loja da sessão.
 *
 * O id da avaliação vem do ecrã e não é de confiança: é a condição pelo slug,
 * dentro da consulta, que impede alguém de mexer nas avaliações de outra
 * confeitaria adivinhando um identificador.
 */
async function lojaDaSessao() {
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) throw new Error("Sem base de dados.");
  return { slug: confeiteira.slug, exec: executorNeon() };
}

export async function mudarAvaliacao(id: string, estado: EstadoAvaliacao) {
  const { slug, exec } = await lojaDaSessao();
  await mudarEstadoAvaliacao(exec, slug, id, estado);
  revalidatePath("/dashboard/avaliacoes");
  revalidatePath(`/${slug}`);
}

export async function responder(
  _anterior: { erro?: string; ok?: string },
  dados: FormData,
): Promise<{ erro?: string; ok?: string }> {
  const { slug, exec } = await lojaDaSessao();
  await responderAvaliacao(
    exec,
    slug,
    String(dados.get("id") ?? ""),
    String(dados.get("resposta") ?? "").trim(),
  );
  revalidatePath("/dashboard/avaliacoes");
  revalidatePath(`/${slug}`);
  return { ok: "Resposta guardada." };
}
