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
  apagarFatura,
  criarCodigo,
  criarConta,
  emitirFatura,
  guardarDefinicao,
  marcarFatura,
  mudarPlano,
  suspenderConta,
} from "@/lib/bd/admin";
import type { Moeda } from "@/lib/tipos";
import { paraSlug } from "@/lib/slug";

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

export async function novaConta(
  _anterior: { erro?: string; ok?: string; slug?: string },
  dados: FormData,
): Promise<{ erro?: string; ok?: string; slug?: string }> {
  const exec = await exigirSessao();

  const nome = String(dados.get("nome") ?? "").trim();
  const slug = paraSlug(String(dados.get("slug") ?? "") || nome);
  const cidade = String(dados.get("cidade") ?? "").trim();
  const pais = String(dados.get("pais") ?? "PT") as "PT" | "CH" | "BR";
  const moeda = String(dados.get("moeda") ?? "EUR") as Moeda;

  if (nome.length < 2) return { erro: "Falta o nome da confeitaria." };
  if (slug.length < 3) return { erro: "O endereço precisa de 3 letras ou mais." };
  if (!cidade) return { erro: "Falta a cidade." };

  const criada = await criarConta(exec, {
    slug,
    nome,
    cidade,
    pais,
    moeda,
    planoId: String(dados.get("planoId") ?? "pastelaria"),
    semCobranca: dados.get("semCobranca") === "on",
    nota: String(dados.get("nota") ?? "").trim(),
  });

  if ("erro" in criada) {
    return { erro: `Já existe uma conta em /${slug}.` };
  }

  revalidatePath("/admin/contas");
  revalidatePath("/admin");
  return { ok: `Conta criada em /${criada.slug}.`, slug: criada.slug };
}

export async function alternarFatura(id: string, paga: boolean) {
  const exec = await exigirSessao();
  await marcarFatura(exec, id, paga);
  revalidatePath("/admin/faturacao");
}

export async function removerFatura(id: string) {
  const exec = await exigirSessao();
  await apagarFatura(exec, id);
  revalidatePath("/admin/faturacao");
}

export async function novaFatura(
  _anterior: { erro?: string; ok?: string },
  dados: FormData,
): Promise<{ erro?: string; ok?: string }> {
  const exec = await exigirSessao();

  const slug = String(dados.get("slug") ?? "");
  const valor = Number(String(dados.get("valor") ?? "").replace(",", "."));
  const emitidaEm = String(dados.get("emitidaEm") ?? "");

  if (!slug) return { erro: "Escolhe a conta." };
  if (!Number.isFinite(valor) || valor < 0) return { erro: "Valor inválido." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(emitidaEm)) return { erro: "Falta a data." };

  const lancada = await emitirFatura(exec, {
    slug,
    valor,
    moeda: String(dados.get("moeda") ?? "EUR") as Moeda,
    emitidaEm,
    paga: dados.get("paga") === "on",
  });

  revalidatePath("/admin/faturacao");
  return "erro" in lancada
    ? { erro: "Essa conta já não existe." }
    : { ok: `Fatura ${lancada.referencia} lançada.` };
}
