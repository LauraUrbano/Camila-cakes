"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { exigirLoja } from "@/lib/fonte";
import { trocarSenha } from "@/lib/bd/acesso";
import { dicionarioActual } from "@/lib/i18n/servidor";

export type EstadoSenha = { erro?: string; ok?: string };

export async function mudarSenha(
  _anterior: EstadoSenha,
  dados: FormData,
): Promise<EstadoSenha> {
  const t = (await dicionarioActual()).painel.conta;
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) return { erro: t.erroGuardar };

  const actual = String(dados.get("actual") ?? "");
  const nova = String(dados.get("nova") ?? "");
  const repetida = String(dados.get("repetida") ?? "");

  if (nova.length < 8) return { erro: t.erroCurta };
  if (nova !== repetida) return { erro: t.erroDiferentes };

  const trocada = await trocarSenha(
    executorNeon(),
    confeiteira.slug,
    actual,
    nova,
  );
  if ("erro" in trocada) return { erro: t.erroActual };

  revalidatePath("/dashboard/conta");
  return { ok: t.trocada };
}
