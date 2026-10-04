import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Guardar e conferir senhas.
 *
 * scrypt e não sha256: um resumo simples é rápido de calcular, e rápido é
 * exactamente o que não se quer aqui — quem levar a base consegue
 * experimentar milhões de senhas por segundo contra um sha256. O scrypt é
 * lento e pede memória de propósito, e cada senha leva o seu próprio sal,
 * para duas pessoas com a mesma senha não terem o mesmo resumo.
 */
const CUSTO = 16384;
const TAMANHO = 64;

export function guardarSenha(senha: string): string {
  const sal = randomBytes(16).toString("hex");
  const chave = scryptSync(senha, sal, TAMANHO, { N: CUSTO }).toString("hex");
  return `scrypt:${CUSTO}:${sal}:${chave}`;
}

export function senhaBate(senha: string, guardada: string | null): boolean {
  if (!guardada) return false;
  const [algoritmo, custo, sal, chave] = guardada.split(":");
  if (algoritmo !== "scrypt" || !sal || !chave) return false;

  const tentativa = scryptSync(senha, sal, chave.length / 2, {
    N: Number(custo) || CUSTO,
  });
  const esperada = Buffer.from(chave, "hex");
  if (tentativa.length !== esperada.length) return false;
  return timingSafeEqual(tentativa, esperada);
}

/** Uma senha que se dita ao telefone sem enganos e ainda assim não se adivinha. */
export function senhaSugerida(): string {
  const letras = "abcdefghijkmnopqrstuvwxyz23456789";
  return [...randomBytes(12)].map((b) => letras[b % letras.length]).join("");
}
