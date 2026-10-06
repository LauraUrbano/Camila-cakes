import { cache } from "react";
import { redirect } from "next/navigation";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import {
  lojaDaBase,
  lojasDaBase,
  montraDaBase,
  montrasDaBase,
  vitrinesDaBase,
} from "@/lib/bd/consultas";
import { lojas as lojasDeExemplo } from "@/lib/dados";
import { slugDaSessao } from "@/lib/auth/sessao";
import type { Confeiteira, Loja } from "@/lib/tipos";

/** O cardápio e a montra de uma confeitaria — sem encomendas nem contas. */
export type Montra = Pick<Loja, "confeiteira" | "produtos" | "colecoes">;

/**
 * De onde vêm os dados.
 *
 * Com DATABASE_URL definida, lê do Neon. Sem ela, usa os dados de exemplo —
 * assim o protótipo continua a abrir para quem clona o repositório sem ter
 * base, e a passagem para a base a sério não é um salto no escuro: é a mesma
 * forma de dados, vinda de outro sítio.
 */
export const todasAsLojas = cache(async (): Promise<Loja[]> => {
  if (!temBaseDeDados()) return lojasDeExemplo;
  return lojasDaBase(executorNeon());
});

/**
 * A montra de uma confeitaria, para a página pública dela.
 *
 * O `cache` do React não é um pormenor de desempenho: uma única página
 * pergunta por esta loja três vezes — o layout, o `generateMetadata` e o
 * corpo —, e sem isto cada uma delas ia à base outra vez. Com ele, as três
 * chamadas do mesmo pedido partilham a mesma leitura.
 */
export const montraDoSlug = cache(
  async (slug: string): Promise<Montra | undefined> => {
    if (!temBaseDeDados()) {
      return lojasDeExemplo.find((loja) => loja.confeiteira.slug === slug);
    }
    return montraDaBase(executorNeon(), slug);
  },
);

/** A loja inteira de uma confeitaria, cardápio e contas. É do painel dela. */
export const lojaDoSlug = cache(
  async (slug: string): Promise<Loja | undefined> => {
    if (!temBaseDeDados()) {
      return lojasDeExemplo.find((loja) => loja.confeiteira.slug === slug);
    }
    return lojaDaBase(executorNeon(), slug);
  },
);

/** A montra de todas as confeitarias: o índice e o mapa do sítio. */
export const todasAsMontras = cache(async (): Promise<Montra[]> => {
  if (!temBaseDeDados()) return lojasDeExemplo;
  return montrasDaBase(executorNeon());
});

/**
 * Nome, endereço e frase de cada confeitaria. É o que o índice e o mapa do
 * sítio mostram — ler a loja inteira de todas elas para escrever um nome
 * numa lista era o que punha a página de entrada a demorar oito segundos.
 */
export const vitrines = cache(
  async (): Promise<
    Pick<Confeiteira, "slug" | "nome" | "tagline" | "cidade">[]
  > => {
    if (!temBaseDeDados()) {
      return lojasDeExemplo.map(({ confeiteira }) => ({
        slug: confeiteira.slug,
        nome: confeiteira.nome,
        tagline: confeiteira.tagline,
        cidade: confeiteira.cidade,
      }));
    }
    return vitrinesDaBase(executorNeon());
  },
);

/**
 * A loja de quem está no painel.
 *
 * Sem base de dados não há sessão nem com quem entrar: fica a primeira loja
 * de exemplo, para quem clona o repositório ver o painel a funcionar. Com
 * base, só entra quem iniciou sessão — e devolver nulo em vez de a primeira
 * loja é o que evita o pior erro possível, que era mostrar as encomendas de
 * uma confeitaria a outra.
 */
export const lojaDoPainel = cache(async (): Promise<Loja | undefined> => {
  if (!temBaseDeDados()) return lojasDeExemplo[0];
  const slug = await slugDaSessao();
  if (!slug) return undefined;
  return lojaDoSlug(slug);
});

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
