import type { Executor } from "./cliente";
import { guardarSenha, senhaBate } from "@/lib/auth/senha";

export type Credenciais = { email: string; senha: string };

/**
 * Confere quem entra.
 *
 * Aceita o email ou o endereço da página, porque é mais fácil lembrar-se de
 * "bolos-de-casa" do que de qual dos emails usou. Uma conta suspensa não
 * entra: se a página está fora do ar, o painel também está.
 */
export async function entrarComoConfeiteira(
  exec: Executor,
  { email, senha }: Credenciais,
): Promise<{ slug: string } | { erro: "credenciais" | "suspensa" }> {
  const [conta] = await exec<{
    slug: string;
    senha_hash: string | null;
    suspensa: boolean;
  }>(
    `select slug, senha_hash, suspensa from confeiteiras
     where lower(email) = lower($1) or slug = lower($1)`,
    [email.trim()],
  );

  // A senha é conferida mesmo quando a conta não existe, para o tempo de
  // resposta não dizer quais os emails que estão registados.
  const bate = senhaBate(senha, conta?.senha_hash ?? null);
  if (!conta || !bate) return { erro: "credenciais" };
  if (conta.suspensa) return { erro: "suspensa" };

  await exec(`update confeiteiras set entrou_em = now() where slug = $1`, [
    conta.slug,
  ]);
  return { slug: conta.slug };
}

/** Define (ou troca) o email e a senha de uma conta, a partir do painel. */
export async function definirAcesso(
  exec: Executor,
  slug: string,
  email: string,
  senha: string,
): Promise<{ ok: true } | { erro: "emailOcupado" }> {
  const [outra] = await exec<{ slug: string }>(
    `select slug from confeiteiras where lower(email) = lower($1) and slug <> $2`,
    [email, slug],
  );
  if (outra) return { erro: "emailOcupado" };

  await exec(
    `update confeiteiras set email = $2, senha_hash = $3 where slug = $1`,
    [slug, email.trim(), guardarSenha(senha)],
  );
  return { ok: true };
}

export type AcessoDaConta = {
  email: string | null;
  temSenha: boolean;
  entrouEm: string | null;
};

export async function acessoDasContas(
  exec: Executor,
): Promise<Record<string, AcessoDaConta>> {
  const linhas = await exec<{
    slug: string;
    email: string | null;
    tem_senha: boolean;
    entrou_em: string | null;
  }>(
    `select slug, email, senha_hash is not null as tem_senha, entrou_em
     from confeiteiras`,
  );
  return Object.fromEntries(
    linhas.map((l) => [
      l.slug,
      {
        email: l.email,
        temSenha: Boolean(l.tem_senha),
        entrouEm: l.entrou_em ? String(l.entrou_em) : null,
      },
    ]),
  );
}

/**
 * Troca da senha pela própria confeiteira.
 *
 * Exige a senha actual: sem isso, quem apanhasse uma sessão aberta num
 * computador emprestado mudava a senha e ficava com a conta.
 */
export async function trocarSenha(
  exec: Executor,
  slug: string,
  actual: string,
  nova: string,
): Promise<{ ok: true } | { erro: "actualErrada" }> {
  const [conta] = await exec<{ senha_hash: string | null }>(
    `select senha_hash from confeiteiras where slug = $1`,
    [slug],
  );
  if (!conta || !senhaBate(actual, conta.senha_hash)) {
    return { erro: "actualErrada" };
  }
  await exec(`update confeiteiras set senha_hash = $2 where slug = $1`, [
    slug,
    guardarSenha(nova),
  ]);
  return { ok: true };
}
