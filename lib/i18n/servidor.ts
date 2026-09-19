import { cookies, headers } from "next/headers";
import type { Moeda } from "@/lib/tipos";
import {
  COOKIE_LINGUA,
  COOKIE_MOEDA,
  dicionario,
  eLingua,
  negociarLingua,
  negociarMoeda,
  type Dicionario,
  type Lingua,
} from "./index";

/**
 * Língua do pedido actual, para componentes de servidor.
 *
 * O cookie é posto pelo middleware, mas há casos em que ainda não chegou —
 * o primeiro pedido de uma sessão nova, ou um pedido que escapou ao matcher.
 * Nesses casos volta-se a negociar a partir do cabeçalho, para a página nunca
 * sair na língua errada só porque o cookie atrasou.
 */
export async function linguaActual(): Promise<Lingua> {
  const guardada = (await cookies()).get(COOKIE_LINGUA)?.value;
  if (eLingua(guardada)) return guardada;
  return negociarLingua((await headers()).get("accept-language"));
}

export async function dicionarioActual(): Promise<Dicionario> {
  return dicionario(await linguaActual());
}

export async function moedaActual(): Promise<Moeda> {
  const guardada = (await cookies()).get(COOKIE_MOEDA)?.value;
  if (guardada === "EUR" || guardada === "CHF" || guardada === "BRL") {
    return guardada;
  }
  return negociarMoeda((await headers()).get("accept-language"));
}
