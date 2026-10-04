"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { criarAvaliacao } from "@/lib/bd/avaliacoes";
import { dicionarioActual } from "@/lib/i18n/servidor";

export type EstadoAvaliacao = { erro?: string; ok?: boolean };

export async function deixarAvaliacao(
  _anterior: EstadoAvaliacao,
  dados: FormData,
): Promise<EstadoAvaliacao> {
  const t = (await dicionarioActual()).loja.avaliacoes;

  const slug = String(dados.get("slug") ?? "");
  const nome = String(dados.get("nome") ?? "").trim();
  const nota = Number(dados.get("nota") ?? 0);
  const comentario = String(dados.get("comentario") ?? "").trim().slice(0, 1500);

  if (nome.length < 2) return { erro: t.erroNome };
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) return { erro: t.erroNota };
  if (!temBaseDeDados()) return { erro: t.erroGuardar };

  try {
    const guardada = await criarAvaliacao(executorNeon(), slug, {
      nome,
      nota,
      comentario,
    });
    if ("erro" in guardada) return { erro: t.erroGuardar };
  } catch {
    return { erro: t.erroGuardar };
  }

  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard/avaliacoes");
  return { ok: true };
}
