"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { exigirLoja } from "@/lib/fonte";
import {
  apagarFotoDoProduto,
  apagarProduto,
  criarProduto,
  guardarFotoDoProduto,
  guardarOpcoes,
  guardarProduto,
  guardarTamanhos,
  moverProduto,
  type GrupoDeOpcao,
  type OpcaoEditavel,
  type TamanhoEditavel,
} from "@/lib/bd/cardapio";
import { dicionarioActual } from "@/lib/i18n/servidor";

/** Tudo aqui corre na loja de quem tem sessão, nunca numa que venha do ecrã. */
async function minhaLoja() {
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) throw new Error("Sem base de dados.");
  return { slug: confeiteira.slug, exec: executorNeon() };
}

function refrescar(slug: string, chave?: string) {
  revalidatePath("/dashboard/cardapio");
  if (chave) revalidatePath(`/dashboard/cardapio/${chave}`);
  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard");
}

export type EstadoEditor = { erro?: string; ok?: string };

// -------------------------------------------------------- criar e mover

export async function novoProduto(
  _anterior: EstadoEditor,
  dados: FormData,
): Promise<EstadoEditor> {
  const t = (await dicionarioActual()).painel.editor;
  const { slug, exec } = await minhaLoja();

  const nome = String(dados.get("nome") ?? "").trim();
  if (nome.length < 2) return { erro: t.erroNome };

  const criado = await criarProduto(exec, slug, nome);
  if ("erro" in criado) return { erro: t.erroGuardar };

  refrescar(slug);
  redirect(`/dashboard/cardapio/${criado.chave}`);
}

export async function mover(chave: string, direccao: -1 | 1) {
  const { slug, exec } = await minhaLoja();
  await moverProduto(exec, slug, chave, direccao);
  refrescar(slug);
}

export async function remover(chave: string) {
  const { slug, exec } = await minhaLoja();
  await apagarProduto(exec, slug, chave);
  refrescar(slug);
  redirect("/dashboard/cardapio");
}

// ------------------------------------------------------ guardar a ficha

/** Lê uma lista do formulário: os campos vêm numerados, linha a linha. */
function lerLinhas(dados: FormData, prefixo: string): Record<string, string>[] {
  const linhas = new Map<string, Record<string, string>>();
  for (const [campo, valor] of dados.entries()) {
    const partes = campo.match(new RegExp(`^${prefixo}\\[(\\d+)\\]\\[(\\w+)\\]$`));
    if (!partes) continue;
    const [, i, nome] = partes;
    const linha = linhas.get(i) ?? {};
    linha[nome] = String(valor);
    linhas.set(i, linha);
  }
  return [...linhas.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([, linha]) => linha);
}

/** Aceita "12,50" e "12.50" — ninguém escreve preços com ponto em Portugal. */
function valor(texto: string | undefined): number {
  const n = Number(String(texto ?? "0").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function guardarFicha(
  _anterior: EstadoEditor,
  dados: FormData,
): Promise<EstadoEditor> {
  const t = (await dicionarioActual()).painel.editor;
  const { slug, exec } = await minhaLoja();
  const chave = String(dados.get("chave") ?? "");

  const nome = String(dados.get("nome") ?? "").trim();
  if (nome.length < 2) return { erro: t.erroNome };

  const temLimite = dados.get("temLimite") === "on";

  await guardarProduto(exec, slug, chave, {
    nome,
    descricao: String(dados.get("descricao") ?? "").trim(),
    categoria: String(dados.get("categoria") ?? "").trim(),
    cor: String(dados.get("cor") ?? "#F3E3D7"),
    maxDecoracoes: Math.max(0, Number(dados.get("maxDecoracoes") ?? 0)),
    antecedenciaDias: Math.max(0, Number(dados.get("antecedenciaDias") ?? 0)),
    limiteTotal: temLimite
      ? Math.max(1, Number(dados.get("limiteTotal") ?? 1))
      : null,
    limiteVendidos: Math.max(0, Number(dados.get("limiteVendidos") ?? 0)),
    activo: dados.get("activo") === "on",
  });

  const tamanhos: TamanhoEditavel[] = lerLinhas(dados, "tamanho")
    .filter((l) => l.nome?.trim())
    .map((l) => ({
      id: l.id || undefined,
      nome: l.nome.trim(),
      porcoes: (l.porcoes ?? "").trim(),
      preco: valor(l.preco),
      maxRecheios: Math.max(0, Number(l.maxRecheios ?? 0)),
    }));

  if (tamanhos.length === 0) return { erro: t.erroSemTamanho };
  await guardarTamanhos(exec, slug, chave, tamanhos);

  for (const grupo of ["massa", "recheio", "decoracao"] as GrupoDeOpcao[]) {
    const opcoes: OpcaoEditavel[] = lerLinhas(dados, grupo)
      .filter((l) => l.nome?.trim())
      .map((l) => ({
        id: l.id || undefined,
        nome: l.nome.trim(),
        acrescimo: valor(l.acrescimo),
        disponivel: l.disponivel !== "nao",
      }));
    await guardarOpcoes(exec, slug, chave, grupo, opcoes);
  }

  const ficheiro = dados.get("foto");
  if (ficheiro instanceof File && ficheiro.size > 0) {
    if (ficheiro.size > 12 * 1024 * 1024) return { erro: t.erroGrande };
    const guardada = await guardarFotoDoProduto(
      exec,
      slug,
      chave,
      await ficheiro.arrayBuffer(),
    );
    if ("erro" in guardada) return { erro: t.erroImagem };
  }

  refrescar(slug, chave);
  return { ok: t.guardado };
}

export async function removerFoto(chave: string) {
  const { slug, exec } = await minhaLoja();
  await apagarFotoDoProduto(exec, slug, chave);
  refrescar(slug, chave);
}
