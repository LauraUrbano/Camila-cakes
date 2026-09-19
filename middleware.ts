import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_LINGUA,
  COOKIE_MOEDA,
  eLingua,
  negociarLingua,
  negociarMoeda,
} from "@/lib/i18n";

const UM_ANO = 60 * 60 * 24 * 365;

/**
 * Decide a língua uma vez, à entrada, e guarda-a num cookie.
 *
 * A língua não vai no endereço de propósito: a promessa do produto é um link
 * limpo, cakelyo.app/o-teu-nome, e metê-la lá dentro dava
 * cakelyo.app/pt-PT/o-teu-nome. Quem escolher outra língua no rodapé
 * sobrepõe-se ao que o navegador pediu, e a escolha fica guardada.
 */
export function middleware(pedido: NextRequest) {
  const resposta = NextResponse.next();
  const accept = pedido.headers.get("accept-language");

  if (!eLingua(pedido.cookies.get(COOKIE_LINGUA)?.value)) {
    resposta.cookies.set(COOKIE_LINGUA, negociarLingua(accept), {
      path: "/",
      maxAge: UM_ANO,
      sameSite: "lax",
    });
  }

  if (!pedido.cookies.get(COOKIE_MOEDA)) {
    resposta.cookies.set(COOKIE_MOEDA, negociarMoeda(accept), {
      path: "/",
      maxAge: UM_ANO,
      sameSite: "lax",
    });
  }

  return resposta;
}

export const config = {
  // Tudo menos ficheiros estáticos e imagens, que não têm língua.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|produtos|atelier).*)"],
};
