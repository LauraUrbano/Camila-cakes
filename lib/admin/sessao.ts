import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_ADMIN = "cakelyo_admin";

/**
 * O painel de plataforma é de uma pessoa só, por isso não precisa de contas:
 * precisa de um segredo. Fica em ADMIN_TOKEN, no ambiente — não na base, não
 * no código.
 *
 * O cookie guarda um resumo do segredo, não o segredo: quem o vir não fica a
 * saber a senha. E a comparação é feita em tempo constante, porque comparar
 * strings com `===` revoga carácter a carácter e dá para adivinhar a senha a
 * medir o tempo das respostas.
 */
function segredo(): string | undefined {
  return process.env.ADMIN_TOKEN;
}

export function adminConfigurado(): boolean {
  return Boolean(segredo());
}

function resumo(valor: string): string {
  return createHash("sha256").update(valor).digest("hex");
}

function igualEmTempoConstante(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export function senhaCorrecta(tentativa: string): boolean {
  const esperado = segredo();
  if (!esperado) return false;
  // Compara os resumos para o tamanho não variar com a tentativa.
  return igualEmTempoConstante(resumo(tentativa), resumo(esperado));
}

export function valorDoCookie(): string {
  return resumo(`cakelyo-admin:${segredo() ?? ""}`);
}

export async function estaAutenticado(): Promise<boolean> {
  if (!adminConfigurado()) return false;
  const guardado = (await cookies()).get(COOKIE_ADMIN)?.value;
  if (!guardado) return false;
  return igualEmTempoConstante(guardado, valorDoCookie());
}
