import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_CONFEITEIRA = "cakelyo_sessao";
const DURACAO = 60 * 60 * 24 * 30;

/**
 * A sessão de uma confeiteira.
 *
 * O cookie leva o endereço da loja e uma assinatura por cima: sem a chave do
 * servidor ninguém consegue escrever um cookie que diga ser outra pessoa.
 * Não é uma sessão guardada na base porque não precisa de ser — não há nada
 * para revogar a meio, e uma consulta por pedido é um custo por nada.
 *
 * Sem SESSION_SECRET não há sessão nenhuma: mais vale o painel recusar
 * entrada do que aceitar cookies que qualquer pessoa pode forjar.
 */
function chave(): string | undefined {
  return process.env.SESSION_SECRET;
}

export function sessoesConfiguradas(): boolean {
  return Boolean(chave());
}

function assinar(corpo: string): string {
  return createHmac("sha256", chave() ?? "").update(corpo).digest("hex");
}

function igual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function abrirSessao(slug: string): Promise<void> {
  const expira = Date.now() + DURACAO * 1000;
  const corpo = `${slug}.${expira}`;
  (await cookies()).set(COOKIE_CONFEITEIRA, `${corpo}.${assinar(corpo)}`, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: DURACAO,
  });
}

export async function fecharSessao(): Promise<void> {
  (await cookies()).delete(COOKIE_CONFEITEIRA);
}

/** O endereço da loja de quem está autenticada, ou nulo. */
export async function slugDaSessao(): Promise<string | null> {
  if (!chave()) return null;
  const guardado = (await cookies()).get(COOKIE_CONFEITEIRA)?.value;
  if (!guardado) return null;

  const partes = guardado.split(".");
  if (partes.length !== 3) return null;
  const [slug, expira, assinatura] = partes;

  if (!igual(assinatura, assinar(`${slug}.${expira}`))) return null;
  if (Number(expira) < Date.now()) return null;
  return slug;
}
