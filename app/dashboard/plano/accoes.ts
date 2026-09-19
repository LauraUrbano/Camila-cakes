"use server";

import { codigoPorTexto } from "@/lib/dados";

export type ErroResgate = "vazio" | "desconhecido" | "esgotado";

export type ResultadoResgate =
  | { estado: "vazio" }
  | { estado: "ok"; planoId: string; codigo: string }
  | { estado: "erro"; erro: ErroResgate };

/**
 * Valida o código no servidor, de propósito: se a validação fosse no browser,
 * a lista de códigos vitalícios ia dentro do JavaScript da página e qualquer
 * pessoa a leria.
 *
 * Devolve a chave do erro em vez da frase: a frase depende da língua de quem
 * está do outro lado, e isso é assunto do componente, não da validação.
 *
 * No protótipo isto só devolve o resultado. Com base de dados, é aqui que se
 * marca o código como usado e se grava a concessão na conta — numa transacção,
 * para dois resgates ao mesmo tempo não passarem do tecto de utilizações.
 */
export async function resgatarCodigo(
  _anterior: ResultadoResgate,
  dados: FormData,
): Promise<ResultadoResgate> {
  const texto = String(dados.get("codigo") ?? "");
  if (texto.trim() === "") {
    return { estado: "erro", erro: "vazio" };
  }

  const codigo = codigoPorTexto(texto);
  if (!codigo) {
    return { estado: "erro", erro: "desconhecido" };
  }
  if (codigo.usos >= codigo.maxUsos) {
    return { estado: "erro", erro: "esgotado" };
  }

  return { estado: "ok", planoId: codigo.planoId, codigo: codigo.codigo };
}
