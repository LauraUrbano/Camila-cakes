import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { lojasDaBase } from "@/lib/bd/consultas";
import { lojas as lojasDeExemplo } from "@/lib/dados";
import type { Loja } from "@/lib/tipos";

/**
 * De onde vêm os dados.
 *
 * Com DATABASE_URL definida, lê do Neon. Sem ela, usa os dados de exemplo —
 * assim o protótipo continua a abrir para quem clona o repositório sem ter
 * base, e a passagem para a base a sério não é um salto no escuro: é a mesma
 * forma de dados, vinda de outro sítio.
 */
export async function todasAsLojas(): Promise<Loja[]> {
  if (!temBaseDeDados()) return lojasDeExemplo;
  return lojasDaBase(executorNeon());
}

export async function lojaDoSlug(slug: string): Promise<Loja | undefined> {
  const lojas = await todasAsLojas();
  return lojas.find((loja) => loja.confeiteira.slug === slug);
}

/** O painel do protótipo é sempre o da primeira confeiteira. */
export async function lojaDoPainel(): Promise<Loja> {
  const [primeira] = await todasAsLojas();
  return primeira;
}

export function origemDosDados(): "neon" | "exemplo" {
  return temBaseDeDados() ? "neon" : "exemplo";
}
