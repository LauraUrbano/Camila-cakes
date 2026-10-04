"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import {
  COOKIE_ADMIN,
  estaAutenticado,
  senhaCorrecta,
  valorDoCookie,
} from "@/lib/admin/sessao";
import {
  criarCodigo,
  guardarDefinicao,
  mudarPlano,
  suspenderConta,
} from "@/lib/bd/admin";

/** Todas as acções daqui exigem sessão; nenhuma confia no que vem do ecrã. */
async function exigirSessao() {
  if (!(await estaAutenticado())) redirect("/admin/entrar");
  if (!temBaseDeDados()) throw new Error("Sem base de dados.");
  return executorNeon();
}

export async function entrar(
  _anterior: { erro?: string },
  dados: FormData,
): Promise<{ erro?: string }> {
  const senha = String(dados.get("senha") ?? "");
  if (!senhaCorrecta(senha)) {
    // Uma pausa curta torna a força bruta cara sem incomodar quem acerta.
    await new Promise((r) => setTimeout(r, 600));
    return { erro: "Senha errada." };
  }
  (await cookies()).set(COOKIE_ADMIN, valorDoCookie(), {
    path: "/admin",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function sair() {
  (await cookies()).delete(COOKIE_ADMIN);
  redirect("/admin/entrar");
}

export async function alternarSuspensao(slug: string, suspensa: boolean) {
  const exec = await exigirSessao();
  await suspenderConta(exec, slug, suspensa, suspensa ? "Suspensa no painel" : undefined);
  revalidatePath("/admin/contas");
  revalidatePath(`/${slug}`);
}

export async function trocarPlano(slug: string, planoId: string) {
  const exec = await exigirSessao();
  await mudarPlano(exec, slug, planoId);
  revalidatePath("/admin/contas");
}

export async function guardarChave(chave: string, valor: string) {
  const exec = await exigirSessao();
  await guardarDefinicao(exec, chave, valor.trim());
  revalidatePath("/admin/stripe");
}

export async function novoCodigo(
  _anterior: { erro?: string; ok?: string },
  dados: FormData,
): Promise<{ erro?: string; ok?: string }> {
  const exec = await exigirSessao();
  const codigo = String(dados.get("codigo") ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, "");
  const maxUsos = Number(dados.get("maxUsos") ?? 1);

  if (codigo.length < 6) return { erro: "O código precisa de 6 caracteres ou mais." };
  if (!Number.isInteger(maxUsos) || maxUsos < 1) {
    return { erro: "O número de utilizações tem de ser 1 ou mais." };
  }

  const criado = await criarCodigo(exec, {
    codigo,
    planoId: String(dados.get("planoId") ?? "pastelaria"),
    maxUsos,
    nota: String(dados.get("nota") ?? ""),
  });

  revalidatePath("/admin/codigos");
  return criado
    ? { ok: `Código ${codigo} criado.` }
    : { erro: "Já existe um código com esse nome." };
}
