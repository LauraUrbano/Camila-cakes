"use server";

import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { criarInscricao } from "@/lib/bd/inscricoes";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { paraSlug } from "@/lib/slug";
import type { Moeda, Pais } from "@/lib/tipos";

export type EstadoPedido = { erro?: string; ok?: boolean };

/**
 * Recebe um pedido de acesso.
 *
 * As mensagens de erro saem do dicionário do servidor, e não do ecrã: quem
 * escreve em alemão tem de receber a resposta em alemão, e o formulário não
 * tem de carregar cinco versões de cada frase.
 */
export async function pedirAcesso(
  _anterior: EstadoPedido,
  dados: FormData,
): Promise<EstadoPedido> {
  const t = (await dicionarioActual()).assinar;

  const nome = String(dados.get("nome") ?? "").trim();
  const email = String(dados.get("email") ?? "").trim();
  const cidade = String(dados.get("cidade") ?? "").trim();

  if (nome.length < 2) return { erro: t.erroNome };
  // Validar email a sério é impossível do lado de cá; isto só apanha o que
  // está claramente errado, e quem se engana a sério descobre-o por não
  // receber a resposta.
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(email)) return { erro: t.erroEmail };
  if (!cidade) return { erro: t.erroCidade };

  if (!temBaseDeDados()) return { erro: t.erroGuardar };

  try {
    await criarInscricao(executorNeon(), {
      nome,
      email,
      telefone: String(dados.get("telefone") ?? "").trim(),
      cidade,
      pais: String(dados.get("pais") ?? "PT") as Pais,
      moeda: String(dados.get("moeda") ?? "EUR") as Moeda,
      planoId: String(dados.get("planoId") ?? "atelier"),
      periodo: String(dados.get("periodo") ?? "mensal") === "anual"
        ? "anual"
        : "mensal",
      slugDesejado: paraSlug(String(dados.get("slug") ?? "") || nome),
      mensagem: String(dados.get("mensagem") ?? "").trim().slice(0, 2000),
    });
  } catch {
    return { erro: t.erroGuardar };
  }

  return { ok: true };
}
