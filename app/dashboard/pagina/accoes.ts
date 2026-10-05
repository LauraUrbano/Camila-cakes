"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { exigirLoja } from "@/lib/fonte";
import {
  apagarImagemPartilha,
  guardarImagemPartilha,
  guardarSeo,
  guardarAparencia,
} from "@/lib/bd/pagina";
import { dicionarioActual } from "@/lib/i18n/servidor";

export type EstadoSeo = { erro?: string; ok?: string };

/** Oito megabytes é o que uma fotografia de telemóvel costuma pesar. */
const MAXIMO = 12 * 1024 * 1024;

export async function guardarSeoDaPagina(
  _anterior: EstadoSeo,
  dados: FormData,
): Promise<EstadoSeo> {
  const t = (await dicionarioActual()).painel.pagina.seo;
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) return { erro: t.erroGuardar };

  const exec = executorNeon();

  await guardarSeo(exec, confeiteira.slug, {
    titulo: String(dados.get("titulo") ?? "").trim(),
    descricao: String(dados.get("descricao") ?? "").trim(),
  });

  const ficheiro = dados.get("imagem");
  if (ficheiro instanceof File && ficheiro.size > 0) {
    if (ficheiro.size > MAXIMO) return { erro: t.erroGrande };
    const guardada = await guardarImagemPartilha(
      exec,
      confeiteira.slug,
      await ficheiro.arrayBuffer(),
    );
    if ("erro" in guardada) return { erro: t.erroImagem };
  }

  revalidatePath("/dashboard/pagina");
  revalidatePath(`/${confeiteira.slug}`);
  return { ok: t.guardado };
}

export async function removerImagem() {
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) return;
  await apagarImagemPartilha(executorNeon(), confeiteira.slug);
  revalidatePath("/dashboard/pagina");
  revalidatePath(`/${confeiteira.slug}`);
}

export async function guardarAparenciaDaPagina(
  _anterior: EstadoSeo,
  dados: FormData,
): Promise<EstadoSeo> {
  const t = (await dicionarioActual()).painel.pagina.aparencia;
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) return { erro: t.erroGuardar };

  await guardarAparencia(executorNeon(), confeiteira.slug, {
    lingua: String(dados.get("lingua") ?? ""),
    modelo: String(dados.get("modelo") ?? "classico"),
  });

  revalidatePath("/dashboard/pagina");
  revalidatePath(`/${confeiteira.slug}`);
  return { ok: t.guardado };
}
