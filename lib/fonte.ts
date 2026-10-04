import { redirect } from "next/navigation";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { lojasDaBase } from "@/lib/bd/consultas";
import { lojas as lojasDeExemplo } from "@/lib/dados";
import { slugDaSessao } from "@/lib/auth/sessao";
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

/**
 * A loja de quem está no painel.
 *
 * Sem base de dados não há sessão nem com quem entrar: fica a primeira loja
 * de exemplo, para quem clona o repositório ver o painel a funcionar. Com
 * base, só entra quem iniciou sessão — e devolver nulo em vez de a primeira
 * loja é o que evita o pior erro possível, que era mostrar as encomendas de
 * uma confeitaria a outra.
 */
export async function lojaDoPainel(): Promise<Loja | undefined> {
  if (!temBaseDeDados()) return lojasDeExemplo[0];
  const slug = await slugDaSessao();
  if (!slug) return undefined;
  return lojaDoSlug(slug);
}

export function origemDosDados(): "neon" | "exemplo" {
  return temBaseDeDados() ? "neon" : "exemplo";
}

/**
 * A loja do painel, ou a porta de entrada.
 *
 * Cada página do painel chama isto em vez de `lojaDoPainel`: os ecrãs do
 * Next.js desenham-se em paralelo, por isso não basta o layout verificar a
 * sessão — qualquer um deles pode ser o primeiro a ler dados.
 */
export async function exigirLoja(): Promise<Loja> {
  const loja = await lojaDoPainel();
  if (!loja) redirect("/entrar");
  return loja;
}
