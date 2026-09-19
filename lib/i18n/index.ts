import type { Moeda } from "@/lib/tipos";
import { ptPT, type Dicionario } from "./pt-PT";
import { ptBR } from "./pt-BR";
import { en } from "./en";
import { fr } from "./fr";
import { de } from "./de";

export type { Dicionario };

export const LINGUAS = {
  "pt-PT": ptPT,
  "pt-BR": ptBR,
  en,
  fr,
  de,
} satisfies Record<string, Dicionario>;

export type Lingua = keyof typeof LINGUAS;

export const LINGUA_PADRAO: Lingua = "pt-PT";
export const COOKIE_LINGUA = "cakelyo_lingua";
export const COOKIE_MOEDA = "cakelyo_moeda";

export function eLingua(valor: string | undefined | null): valor is Lingua {
  return valor != null && valor in LINGUAS;
}

export function dicionario(lingua: Lingua): Dicionario {
  return LINGUAS[lingua];
}

/** Para o seletor: código e nome na própria língua. */
export const LISTA_LINGUAS = (Object.keys(LINGUAS) as Lingua[]).map(
  (codigo) => ({ codigo, nome: LINGUAS[codigo].meta.nome }),
);

type Preferencia = { base: string; regiao?: string; peso: number };

/**
 * Lê o cabeçalho Accept-Language, que vem como
 * "pt-BR,pt;q=0.9,en-US;q=0.8" — em ordem de preferência, com um peso
 * opcional. Devolve as preferências ordenadas, da mais forte para a mais
 * fraca.
 */
function preferencias(accept: string | null): Preferencia[] {
  if (!accept) return [];
  return accept
    .split(",")
    .map((parte) => {
      const [etiqueta, ...params] = parte.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const [base, regiao] = etiqueta.trim().split("-");
      return {
        base: base.toLowerCase(),
        regiao: regiao?.toUpperCase(),
        peso: q ? Number(q) : 1,
      };
    })
    .filter((p) => p.base !== "" && !Number.isNaN(p.peso))
    .sort((a, b) => b.peso - a.peso);
}

/**
 * Escolhe a língua a partir do navegador.
 *
 * O português é o caso com mais nuance: "pt-BR" é o Brasil, "pt-PT" é
 * Portugal, e "pt" sozinho fica em Portugal — é o mercado de origem e a
 * língua em que o produto foi escrito.
 */
export function negociarLingua(accept: string | null): Lingua {
  for (const { base, regiao } of preferencias(accept)) {
    if (base === "pt") return regiao === "BR" ? "pt-BR" : "pt-PT";
    if (base === "en") return "en";
    if (base === "fr") return "fr";
    if (base === "de") return "de";
  }
  return LINGUA_PADRAO;
}

/**
 * Moeda sugerida pela região de quem chega, não pela língua: um suíço que
 * navega em inglês continua a ver francos, e um brasileiro que navega em
 * inglês continua a ver reais.
 */
export function negociarMoeda(accept: string | null): Moeda {
  for (const { base, regiao } of preferencias(accept)) {
    if (regiao === "BR") return "BRL";
    if (regiao === "CH") return "CHF";
    if (regiao) return "EUR";
    if (base === "pt") return "EUR";
  }
  return "EUR";
}
