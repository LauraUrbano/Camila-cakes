import { neon } from "@neondatabase/serverless";

/**
 * Um executor de SQL. Tanto a semente como as consultas recebem um destes em
 * vez de abrirem a ligação elas próprias — assim o mesmo código corre contra
 * o Neon em produção e contra um Postgres em memória nos testes, sem ramos
 * `if (teste)` espalhados.
 */
export type Executor = <T = Record<string, unknown>>(
  texto: string,
  valores?: unknown[],
) => Promise<T[]>;

/**
 * Há duas ligações, e trocá-las dá problemas difíceis de diagnosticar:
 *
 * - DATABASE_URL passa pelo agrupador (PgBouncer) e é a da aplicação. Cada
 *   invocação sem servidor abre uma ligação nova; sem agrupador, esgota-se o
 *   limite do Neon assim que houver carga.
 * - DATABASE_URL_UNPOOLED é directa e serve às migrações, que precisam de
 *   sessão estável. Correr migrações pelo agrupador falha de forma
 *   intermitente, que é o pior tipo de falha.
 */
export function urlDaAplicacao(): string | undefined {
  return process.env.DATABASE_URL;
}

export function urlDasMigracoes(): string | undefined {
  return process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
}

export function temBaseDeDados(): boolean {
  return Boolean(urlDaAplicacao());
}

/** Executor ligado ao Neon por HTTP, que funciona em edge e em serverless. */
export function executorNeon(url = urlDaAplicacao()): Executor {
  if (!url) {
    throw new Error(
      "Falta DATABASE_URL. Sem ela a aplicação corre com os dados de exemplo.",
    );
  }
  // `no-store` não é um detalhe: o driver do Neon fala por fetch, e o Next.js
  // guarda respostas de fetch em cache. Sem isto, aceitar uma encomenda
  // gravava na base e o ecrã recarregado continuava a mostrar o estado
  // antigo — o pior tipo de erro, porque parece que o botão não funcionou.
  const sql = neon(url, { fetchOptions: { cache: "no-store" } });
  return (async (texto, valores = []) =>
    sql.query(texto, valores)) as Executor;
}
