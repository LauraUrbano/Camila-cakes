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
import { criarConta, emitirFatura, faturas, marcarFatura } from "@/lib/bd/admin";
import {
  criarInscricao,
  inscricaoAtendida,
  inscricoes,
  mudarEstadoInscricao,
} from "@/lib/bd/inscricoes";
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

// Todas as migrações, por ordem: o teste tem de correr contra o esquema que
// está em produção, e não só contra o primeiro ficheiro.
const migracoes = fs
  .readdirSync("bd")
  .filter((f) => /^\d{4}_.*\.sql$/.test(f))
  .sort();
for (const ficheiro of migracoes) {
  await bd.exec(fs.readFileSync(`bd/${ficheiro}`, "utf8"));
}
console.log(`✓ esquema aplicado (${migracoes.length} migrações)`);

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

// --- Contas abertas no painel da plataforma ---
console.log("\ncriar conta");
const criada = await criarConta(exec, {
  slug: "bolos-da-ana",
  nome: "Bolos da Ana",
  cidade: "Porto",
  pais: "PT",
  moeda: "EUR",
  planoId: "pastelaria",
  semCobranca: true,
  nota: "Primeira cliente.",
});
confere("devolve o endereço", "erro" in criada ? criada.erro : criada.slug, "bolos-da-ana");

const repetida = await criarConta(exec, {
  slug: "bolos-da-ana",
  nome: "Outra qualquer",
  cidade: "Braga",
  pais: "PT",
  moeda: "EUR",
  planoId: "prova",
  semCobranca: false,
  nota: "",
});
confere("endereço ocupado é recusado", "erro" in repetida && repetida.erro, "slugOcupado");

const [entregasDaAna] = await exec<{ quantas: string }>(
  `select count(*)::text as quantas from entregas e
   join confeiteiras c on c.id = e.confeiteira_id where c.slug = 'bolos-da-ana'`,
);
confere("entra com três formas de entrega", entregasDaAna.quantas, "3");

const [assinaturaDaAna] = await exec<{ estado: string; origem: string; codigo: string }>(
  `select a.estado, a.origem, a.codigo from assinaturas a
   join confeiteiras c on c.id = a.confeiteira_id where c.slug = 'bolos-da-ana'`,
);
confere(
  "quem não paga fica vitalícia e fora do Stripe",
  [assinaturaDaAna.estado, assinaturaDaAna.origem],
  ["vitalicia", "codigo"],
);
const [resgateDaAna] = await exec<{ quantas: string }>(
  `select count(*)::text as quantas from resgates r
   join confeiteiras c on c.id = r.confeiteira_id where c.slug = 'bolos-da-ana'`,
);
confere("o código da concessão fica registado", resgateDaAna.quantas, "1");

// --- Faturas lançadas à mão ---
console.log("\nfaturação");
const ano = "2026-03-01".slice(0, 4);
const primeira = await emitirFatura(exec, {
  slug: "bolos-da-ana",
  valor: 29.9,
  moeda: "EUR",
  emitidaEm: "2026-03-01",
  paga: false,
});
const segunda = await emitirFatura(exec, {
  slug: "bolos-da-ana",
  valor: 29.9,
  moeda: "EUR",
  emitidaEm: "2026-04-01",
  paga: true,
});
confere(
  "numera por conta e por ano",
  [
    "erro" in primeira ? primeira.erro : primeira.referencia,
    "erro" in segunda ? segunda.erro : segunda.referencia,
  ],
  [`FT-${ano}-0001`, `FT-${ano}-0002`],
);
confere(
  "conta inexistente não gera fatura",
  await emitirFatura(exec, {
    slug: "nao-existe",
    valor: 1,
    moeda: "EUR",
    emitidaEm: "2026-04-01",
    paga: false,
  }),
  { erro: "semConta" },
);

const daAna = (await faturas(exec)).filter((f) => f.slug === "bolos-da-ana");
confere("em dívida e paga", daAna.map((f) => f.paga).sort(), [false, true]);
await marcarFatura(exec, daAna.find((f) => !f.paga)!.id, true);
confere(
  "marcar paga",
  (await faturas(exec))
    .filter((f) => f.slug === "bolos-da-ana")
    .every((f) => f.paga),
  true,
);

// --- Pedidos de acesso ---
console.log("\ninscrições");
const pedido = {
  nome: "Bolos da Rita",
  email: "Rita@exemplo.pt",
  telefone: "",
  cidade: "Faro",
  pais: "PT" as const,
  moeda: "EUR" as const,
  planoId: "atelier",
  periodo: "mensal" as const,
  slugDesejado: "bolos-da-rita",
  mensagem: "",
};
await criarInscricao(exec, pedido);
await criarInscricao(exec, { ...pedido, email: "rita@exemplo.pt", cidade: "Tavira" });
let abertas = await inscricoes(exec);
confere("dois envios do mesmo email dão um pedido", abertas.length, 1);
confere("fica o que escreveu por último", abertas[0].cidade, "Tavira");

await mudarEstadoInscricao(exec, abertas[0].id, "contactada");
await criarInscricao(exec, pedido);
abertas = await inscricoes(exec);
confere("depois de atendida, pode pedir outra vez", abertas.length, 2);

await inscricaoAtendida(exec, "rita@exemplo.pt", "bolos-da-ana");
const atendida = (await inscricoes(exec)).find((i) => i.estado === "aberta");
confere("o pedido atendido aponta para a conta", atendida?.contaAberta, "bolos-da-ana");

console.log(falhas === 0 ? "\n✓ tudo bate certo" : `\n✗ ${falhas} diferenças`);
process.exit(falhas === 0 ? 0 : 1);
