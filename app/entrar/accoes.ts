"use server";

import { redirect } from "next/navigation";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { entrarComoConfeiteira } from "@/lib/bd/acesso";
import { abrirSessao, fecharSessao, sessoesConfiguradas } from "@/lib/auth/sessao";
import { dicionarioActual } from "@/lib/i18n/servidor";

export type EstadoEntrada = { erro?: string };

export async function entrar(
  _anterior: EstadoEntrada,
  dados: FormData,
): Promise<EstadoEntrada> {
  const t = (await dicionarioActual()).entrar;

  if (!temBaseDeDados() || !sessoesConfiguradas()) return { erro: t.erroFechado };

  const email = String(dados.get("email") ?? "").trim();
  const senha = String(dados.get("senha") ?? "");
  if (!email || !senha) return { erro: t.erroVazio };

  const resposta = await entrarComoConfeiteira(executorNeon(), { email, senha });

  if ("erro" in resposta) {
    // Uma pausa curta torna a força bruta cara sem incomodar quem acerta.
    await new Promise((r) => setTimeout(r, 600));
    return { erro: resposta.erro === "suspensa" ? t.erroSuspensa : t.erroErrado };
  }

  await abrirSessao(resposta.slug);
  redirect("/dashboard");
}

export async function sair() {
  await fecharSessao();
  redirect("/entrar");
}
