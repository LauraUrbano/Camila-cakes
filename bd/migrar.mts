/**
 * Aplica as migrações por HTTP, com o driver serverless do Neon.
 *
 * Não usa psql de propósito: o protocolo nativo do Postgres fala na porta
 * 5432, que está fechada em muitos contentores de CI e de agentes — este
 * incluído. O driver do Neon vai por HTTPS e passa onde o psql não passa.
 *
 * Cada ficheiro aplicado fica registado, por isso correr isto duas vezes não
 * volta a aplicar nada.
 */
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";
import { urlDasMigracoes } from "@/lib/bd/cliente";

const url = urlDasMigracoes();
if (!url) {
  console.error("Falta DATABASE_URL_UNPOOLED (ou DATABASE_URL).");
  process.exit(1);
}
const sql = neon(url);

/**
 * Parte o ficheiro em instruções. Tem de respeitar aspas e dollar-quoting,
 * senão um ponto e vírgula dentro de um texto parte a instrução ao meio.
 */
function instrucoes(fonte: string): string[] {
  const partes: string[] = [];
  let actual = "";
  let emTexto = false;
  let emComentario = false;
  let marcaDollar: string | null = null;

  for (let i = 0; i < fonte.length; i++) {
    const c = fonte[i];
    const resto = fonte.slice(i);

    if (emComentario) {
      actual += c;
      if (c === "\n") emComentario = false;
      continue;
    }
    if (!emTexto && !marcaDollar && resto.startsWith("--")) {
      emComentario = true;
      actual += c;
      continue;
    }
    if (marcaDollar) {
      actual += c;
      if (resto.startsWith(marcaDollar)) {
        actual += marcaDollar.slice(1);
        i += marcaDollar.length - 1;
        marcaDollar = null;
      }
      continue;
    }
    if (!emTexto) {
      const dollar = resto.match(/^\$[A-Za-z_]*\$/);
      if (dollar) {
        marcaDollar = dollar[0];
        actual += marcaDollar;
        i += marcaDollar.length - 1;
        continue;
      }
    }
    if (c === "'") emTexto = !emTexto;
    if (c === ";" && !emTexto) {
      partes.push(actual.trim());
      actual = "";
      continue;
    }
    actual += c;
  }
  if (actual.trim()) partes.push(actual.trim());

  return partes.filter((p) => p.replace(/--[^\n]*/g, "").trim() !== "");
}

await sql`
  create table if not exists migracoes (
    ficheiro    text primary key,
    aplicada_em timestamptz not null default now()
  )`;

const pasta = "bd";
const ficheiros = fs
  .readdirSync(pasta)
  .filter((f) => /^\d+.*\.sql$/.test(f))
  .sort();

const jaFeitas = new Set(
  (await sql`select ficheiro from migracoes`).map(
    (linha) => (linha as { ficheiro: string }).ficheiro,
  ),
);

let aplicadas = 0;
for (const ficheiro of ficheiros) {
  if (jaFeitas.has(ficheiro)) {
    console.log(`· ${ficheiro} (já aplicada)`);
    continue;
  }
  const partes = instrucoes(fs.readFileSync(path.join(pasta, ficheiro), "utf8"));
  console.log(`→ ${ficheiro} (${partes.length} instruções)`);
  for (const parte of partes) {
    await sql.query(parte);
  }
  await sql`insert into migracoes (ficheiro) values (${ficheiro})`;
  aplicadas++;
}

console.log(
  aplicadas === 0 ? "✓ nada por aplicar" : `✓ ${aplicadas} migração(ões) aplicadas`,
);
