/**
 * Esquema + semente + consultas, contra um Postgres a sério (em memória).
 * O que se verifica é o circuito fechado: o que entra pela semente tem de
 * sair igual pelas consultas, na forma que as telas esperam.
 */
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
import type { Executor } from "@/lib/bd/cliente";
import { semear } from "@/lib/bd/semente";
import { lojasDaBase, resgatarNaBase } from "@/lib/bd/consultas";
import { lojas as exemplo } from "@/lib/dados";

let falhas = 0;
/** jsonb devolve as chaves por outra ordem; comparar sem depender disso. */
function estavel(valor: unknown): string {
  return JSON.stringify(valor, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([x], [y]) => x.localeCompare(y)))
      : v,
  );
}

function confere(rotulo: string, obtido: unknown, esperado: unknown) {
  const a = estavel(obtido);
  const b = estavel(esperado);
  if (a === b) console.log("  ✓", rotulo);
  else {
    falhas++;
    console.log("  ✗", rotulo, "\n      obtido:  ", a, "\n      esperado:", b);
  }
}

const bd = await new PGlite();
const exec: Executor = async (texto, valores = []) =>
  (await bd.query(texto, valores as never[])).rows as never;

await bd.exec(fs.readFileSync("bd/0001_esquema.sql", "utf8"));
console.log("✓ esquema aplicado");

await semear(exec);
console.log("✓ semeado");

// Semear de novo não pode duplicar nada.
await semear(exec);
const [{ quantas }] = await exec<{ quantas: string }>(
  "select count(*)::text as quantas from confeiteiras",
);
confere("semear duas vezes não duplica confeiteiras", quantas, String(exemplo.length));

const lidas = await lojasDaBase(exec);
console.log(`\nlojas lidas: ${lidas.length}`);

for (const esperada of exemplo) {
  const obtida = lidas.find(
    (l) => l.confeiteira.slug === esperada.confeiteira.slug,
  );
  console.log(`\n${esperada.confeiteira.nome}`);
  if (!obtida) { falhas++; console.log("  ✗ não veio da base"); continue; }

  confere("moeda", obtida.confeiteira.moeda, esperada.confeiteira.moeda);
  confere("tema", obtida.confeiteira.tema, esperada.confeiteira.tema);
  confere("entregas", obtida.confeiteira.entregas, esperada.confeiteira.entregas);
  confere(
    "produtos (chaves)",
    obtida.produtos.map((p) => p.id),
    esperada.produtos.map((p) => p.id),
  );
  confere(
    "tamanhos do primeiro produto",
    obtida.produtos[0]?.tamanhos,
    esperada.produtos[0]?.tamanhos,
  );
  confere(
    "recheios do primeiro produto",
    obtida.produtos[0]?.recheios,
    esperada.produtos[0]?.recheios,
  );
  confere("limite de produção", obtida.produtos.map((p) => p.limite), esperada.produtos.map((p) => p.limite));
  confere(
    "coleções e os seus produtos",
    obtida.colecoes.map((c) => [c.id, c.ativa, c.produtoIds]),
    esperada.colecoes.map((c) => [c.id, c.ativa, c.produtoIds]),
  );
  confere(
    "pedidos (referência e estado)",
    obtida.pedidos.map((p) => [p.id, p.status]).sort(),
    esperada.pedidos.map((p) => [p.id, p.status]).sort(),
  );
  const refComItens = esperada.pedidos.find((p) => p.itens.length)!.id;
  confere(
    `itens de ${refComItens}`,
    obtida.pedidos.find((p) => p.id === refComItens)?.itens,
    esperada.pedidos.find((p) => p.id === refComItens)?.itens,
  );
  confere(
    "ordem dos pedidos (mais recente primeiro)",
    obtida.pedidos.map((p) => p.id),
    esperada.pedidos.map((p) => p.id),
  );
  confere(
    "receita do histórico",
    obtida.historico.map((m) => m.receita),
    esperada.historico.map((m) => m.receita),
  );
  confere("plano", obtida.assinatura.planoId, esperada.assinatura.planoId);
  confere(
    "faturas",
    obtida.assinatura.faturas.map((f) => [f.id, f.valor, f.paga]),
    esperada.assinatura.faturas.map((f) => [f.id, f.valor, f.paga]),
  );
}

// --- Resgate de código ---
console.log("\nresgate de código");
const antes = await resgatarNaBase(exec, "CAKELYOPARAMIM");
confere("código válido devolve o plano", antes?.planoId, "pastelaria");
confere("código inexistente devolve nulo", await resgatarNaBase(exec, "NAOEXISTE"), null);

await exec("update codigos_vitalicios set usos = max_usos where codigo = 'CAKELYOPARAMIM'");
confere("código esgotado devolve nulo", await resgatarNaBase(exec, "CAKELYOPARAMIM"), null);

console.log(falhas === 0 ? "\n✓ tudo bate certo" : `\n✗ ${falhas} diferenças`);
process.exit(falhas === 0 ? 0 : 1);
