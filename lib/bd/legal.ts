import { executorNeon, temBaseDeDados } from "./cliente";

export type Prestador = {
  nome: string;
  nif: string;
  morada: string;
  email: string;
  telefone: string;
  livroReclamacoes: string;
};

/** O que fica nas páginas legais quando ainda não foi preenchido no painel. */
const EM_FALTA = "—";

/**
 * Quem presta o serviço, para as páginas legais.
 *
 * Vem das definições e não do código: a morada e o contacto mudam, e nenhuma
 * dessas mudanças devia obrigar a publicar o site outra vez. O que falta
 * aparece como traço — uma morada inventada numa página legal é pior do que
 * uma morada em falta, porque esta vê-se que falta.
 */
export async function prestador(): Promise<Prestador> {
  const vazio: Prestador = {
    nome: EM_FALTA,
    nif: EM_FALTA,
    morada: EM_FALTA,
    email: EM_FALTA,
    telefone: EM_FALTA,
    livroReclamacoes: "https://www.livroreclamacoes.pt/inicio",
  };
  if (!temBaseDeDados()) return vazio;

  try {
    const linhas = await executorNeon()<{ chave: string; valor: string }>(
      `select chave, valor from definicoes where chave like 'empresa_%' or chave = 'livro_reclamacoes'`,
    );
    const mapa = Object.fromEntries(
      linhas.map((l) => [l.chave, String(l.valor ?? "").trim()]),
    );
    const ou = (chave: string, alternativa = EM_FALTA) =>
      mapa[chave] || alternativa;

    return {
      nome: ou("empresa_nome"),
      nif: ou("empresa_nif"),
      morada: ou("empresa_morada"),
      email: ou("empresa_email"),
      telefone: ou("empresa_telefone"),
      livroReclamacoes: ou("livro_reclamacoes", vazio.livroReclamacoes),
    };
  } catch {
    return vazio;
  }
}

/** Falta alguma coisa que a lei obriga a mostrar? */
export function prestadorIncompleto(p: Prestador): string[] {
  const nomes: Record<string, string> = {
    nome: "nome ou denominação social",
    nif: "número de contribuinte",
    morada: "morada da sede",
    email: "email de contacto",
  };
  return Object.entries(nomes)
    .filter(([chave]) => p[chave as keyof Prestador] === EM_FALTA)
    .map(([, nome]) => nome);
}
