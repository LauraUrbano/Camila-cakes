/**
 * A conta da Bolos de Casa, a primeira confeitaria a entrar no Cakelyo.
 *
 * Corre-se com `npx tsx bd/contas/bolos-de-casa.mts` e pode correr-se as
 * vezes que forem precisas: tudo entra por chave natural e volta a escrever
 * por cima. Serve para pôr a conta de pé a partir do cardápio que ela
 * mandou — a partir daí é ela que manda no cardápio, e este ficheiro passa
 * a ser só história.
 *
 * Três decisões que vale a pena ficarem escritas:
 *
 * - Os caseirinhos tradicionais são um produto só, com o sabor a entrar
 *   como massa, porque custam todos 15 €. Os especiais são outro produto,
 *   com o sabor a somar o que o distingue do mais barato (pistache +6 €).
 *   Dezanove produtos soltos num cardápio sem fotos individuais liam-se
 *   pior do que dois cartões com a escolha lá dentro.
 * - Os empadões são três produtos e não três tamanhos de um: o que muda é
 *   o recheio, não o tamanho, e um ecrã que perguntasse "tamanho: camarão"
 *   estaria a mentir ao olho.
 * - Brigadeiros e bolos festivos não entram. Vieram sem preço, e um produto
 *   a 0 € no cardápio é pior do que um produto que ainda não está lá.
 */
import { executorNeon } from "@/lib/bd/cliente";
import { criarConta } from "@/lib/bd/admin";

const exec = executorNeon();
const SLUG = "bolos-de-casa";

// ------------------------------------------------------------------ a conta

const criada = await criarConta(exec, {
  slug: SLUG,
  nome: "Bolos de Casa",
  cidade: "Lisboa",
  pais: "PT",
  moeda: "EUR",
  planoId: "pastelaria",
  semCobranca: true,
  nota: "Primeira cliente do Cakelyo. Conta oferecida.",
});
console.log("erro" in criada ? "· conta já existia" : "✓ conta criada");

const [{ id: confeiteira }] = await exec<{ id: string }>(
  `select id from confeiteiras where slug = $1`,
  [SLUG],
);

await exec(
  `update confeiteiras set
     tagline = $2, bio = $3, aviso_pagamento = $4, tema = $5,
     aceita_personalizado = true
   where id = $1`,
  [
    confeiteira,
    "Bolos caseiros, naked cakes e empadões, feitos em Lisboa.",
    "Bolo de casa é aquele que sabe a casa de alguém. É isso que faço: " +
      "caseirinhos, naked cakes e empadões, por encomenda, um de cada vez.",
    "Encomendas com três dias de antecedência. A data fica reservada com " +
      "50% do valor; o resto paga-se no levantamento.",
    JSON.stringify({
      marca: "#7A1F1F",
      marcaSuave: "#F7E4E6",
      fundo: "#FCF8F5",
      texto: "#3B2A26",
    }),
  ],
);

// Só levantamento: ela não faz entregas, e deixar as opções no ecrã era
// prometer o que não existe.
await exec(`delete from entregas where confeiteira_id = $1 and chave <> 'levantamento'`, [
  confeiteira,
]);
await exec(
  `update entregas set nome = 'Levantamento', descricao = $2, taxa = 0
   where confeiteira_id = $1 and chave = 'levantamento'`,
  [confeiteira, "Combinamos a hora e levantas em Lisboa."],
);

// ---------------------------------------------------------------- cardápio

type Opcao = [chave: string, nome: string, acrescimo: number];
type Tamanho = [chave: string, nome: string, porcoes: string, preco: number, recheios: number];

type ProdutoNovo = {
  chave: string;
  nome: string;
  descricao: string;
  categoria: string;
  foto: string | null;
  cor: string;
  maxDecoracoes: number;
  tamanhos: Tamanho[];
  massas?: Opcao[];
  recheios?: Opcao[];
  decoracoes?: Opcao[];
};

const semRecheio = 0;

const tradicionais: Opcao[] = [
  ["chocolate-nido", "Chocolate com Nido", 0],
  ["amanteigado-nido", "Amanteigado com Nido", 0],
  ["laranja", "Laranja", 0],
  ["chocolate-doce-de-leite", "Chocolate com doce de leite", 0],
  ["maca", "Maçã", 0],
  ["cenoura-chocolate", "Cenoura com chocolate", 0],
  ["chocolate-brigadeiro", "Chocolate com brigadeiro", 0],
  ["branca-limao", "Massa branca com creme de limão", 0],
  ["milho", "Bolo de milho", 0],
  ["coco-beijinho", "Coco com beijinho de coco queimado", 0],
];

/** O especial mais barato custa 16 €; cada sabor soma o que o distingue. */
const especiais: Opcao[] = [
  ["churros", "Churros", 0],
  ["suico-cenoura", "Suíço de cenoura com chocolate e pepitas", 0],
  ["nozes-doce-de-leite", "Nozes com doce de leite", 1],
  ["redvelvet-nido", "Red velvet com creme de Nido", 2],
  ["limao-creme", "Limão com creme de limão", 2],
  ["pacoca", "Paçoca com doce de leite e creme de amendoim", 2],
  ["redvelvet-avela", "Red velvet com chocolate e avelã", 3],
  ["goiabada-nido", "Goiabada com Nido", 4],
  ["pistache", "Pistache", 6],
];

const produtos: ProdutoNovo[] = [
  {
    chave: "caseirinho-tradicional",
    nome: "Caseirinho tradicional",
    descricao: "O bolo de todos os dias, inteiro e para levar. Escolhe o sabor.",
    categoria: "Caseirinhos",
    foto: null,
    cor: "#F3E3D7",
    maxDecoracoes: 0,
    tamanhos: [["p", "Tamanho P", "serve 8 a 10 fatias", 15, semRecheio]],
    massas: tradicionais,
  },
  {
    chave: "caseirinho-especial",
    nome: "Caseirinho especial",
    descricao:
      "Os sabores que levam mais tempo e mais ingrediente. O preço muda com o sabor.",
    categoria: "Caseirinhos",
    foto: "/bolos-de-casa/caseirinho-red-velvet.jpeg",
    cor: "#E8CBCB",
    maxDecoracoes: 0,
    tamanhos: [["p", "Tamanho P", "serve 8 a 10 fatias", 16, semRecheio]],
    massas: especiais,
  },
  {
    chave: "naked-cake",
    nome: "Naked cake no acetato",
    descricao:
      "Bolo de festa com dois recheios à escolha. O aro define o preço e quantas pessoas serve.",
    categoria: "Bolos de festa",
    foto: null,
    cor: "#EFD9C9",
    maxDecoracoes: 1,
    tamanhos: [
      ["aro-12", "Aro 12 cm", "até 5 pessoas", 32, 2],
      ["aro-15", "Aro 15 cm", "até 10 pessoas", 38, 2],
      ["aro-18", "Aro 18 cm", "até 20 pessoas", 50, 2],
      ["aro-22", "Aro 22 cm", "até 30 pessoas", 65, 2],
    ],
    massas: [
      ["branca", "Branca", 0],
      ["chocolate", "Chocolate", 0],
      ["redvelvet", "Red velvet", 0],
    ],
    recheios: [
      ["brigadeiro", "Brigadeiro tradicional", 0],
      ["creme-nido", "Creme de leite Nido", 0],
      ["beijinho", "Beijinho de coco", 0],
      ["doce-de-leite", "Doce de leite", 0],
      ["creme-amendoim", "Creme de amendoim", 0],
      ["mousse-limao", "Mousse de limão", 0],
      ["pistache", "Pistache", 5],
      ["creme-avela", "Creme de avelã", 5],
    ],
    decoracoes: [
      ["sem-fruta", "Sem fruta", 0],
      ["abacaxi", "Abacaxi", 3],
      ["ameixa", "Ameixa", 3],
      ["frutas-vermelhas", "Geleia de frutas vermelhas caseira", 3],
      ["morango", "Morango", 3],
      ["maracuja", "Maracujá", 3],
    ],
  },
  {
    chave: "charlotte",
    nome: "Charlotte",
    descricao: "Em dois tamanhos. Leva frutos vermelhos se quiseres.",
    categoria: "Bolos de festa",
    foto: null,
    cor: "#E9D5DA",
    maxDecoracoes: 1,
    tamanhos: [
      ["p", "Tamanho P", "", 27, semRecheio],
      ["m", "Tamanho M", "", 32, semRecheio],
    ],
    decoracoes: [
      ["sem-frutos", "Sem frutos vermelhos", 0],
      ["frutos-vermelhos", "Com frutos vermelhos", 4],
    ],
  },
  {
    chave: "empadao-frango",
    nome: "Empadão de frango",
    descricao: "Serve até 12 fatias.",
    categoria: "Salgados",
    foto: "/bolos-de-casa/empadao-embalado.jpg",
    cor: "#EADFC8",
    maxDecoracoes: 0,
    tamanhos: [["unico", "Inteiro", "até 12 fatias", 35, semRecheio]],
  },
  {
    chave: "empadao-costela",
    nome: "Empadão de costela",
    descricao: "Serve até 12 fatias.",
    categoria: "Salgados",
    foto: "/bolos-de-casa/empadao-embalado.jpg",
    cor: "#E3D3BC",
    maxDecoracoes: 0,
    tamanhos: [["unico", "Inteiro", "até 12 fatias", 46, semRecheio]],
  },
  {
    chave: "empadao-camarao",
    nome: "Empadão de camarão",
    descricao: "Serve até 12 fatias.",
    categoria: "Salgados",
    foto: "/bolos-de-casa/empadao-embalado.jpg",
    cor: "#EFD8C6",
    maxDecoracoes: 0,
    tamanhos: [["unico", "Inteiro", "até 12 fatias", 57, semRecheio]],
  },
];

const ids: string[] = [];

for (const [ordem, p] of produtos.entries()) {
  const [{ id }] = await exec<{ id: string }>(
    `insert into produtos
       (confeiteira_id, chave, nome, descricao, categoria, foto, cor,
        max_decoracoes, antecedencia_dias, ordem)
     values ($1,$2,$3,$4,$5,$6,$7,$8,3,$9)
     on conflict (confeiteira_id, chave) do update set
       nome = excluded.nome, descricao = excluded.descricao,
       categoria = excluded.categoria, foto = excluded.foto,
       cor = excluded.cor, max_decoracoes = excluded.max_decoracoes,
       antecedencia_dias = excluded.antecedencia_dias, ordem = excluded.ordem
     returning id`,
    [confeiteira, p.chave, p.nome, p.descricao, p.categoria, p.foto, p.cor,
     p.maxDecoracoes, ordem],
  );
  ids.push(id);

  for (const [i, [chave, nome, porcoes, preco, recheios]] of p.tamanhos.entries()) {
    await exec(
      `insert into tamanhos (produto_id, chave, nome, porcoes, preco, max_recheios, ordem)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (produto_id, chave) do update set
         nome = excluded.nome, porcoes = excluded.porcoes,
         preco = excluded.preco, max_recheios = excluded.max_recheios,
         ordem = excluded.ordem`,
      [id, chave, nome, porcoes, preco, recheios, i],
    );
  }

  for (const grupo of ["massa", "recheio", "decoracao"] as const) {
    const lista =
      grupo === "massa" ? p.massas : grupo === "recheio" ? p.recheios : p.decoracoes;
    for (const [i, [chave, nome, acrescimo]] of (lista ?? []).entries()) {
      await exec(
        `insert into opcoes (produto_id, grupo, chave, nome, acrescimo, ordem)
         values ($1,$2,$3,$4,$5,$6)
         on conflict (produto_id, grupo, chave) do update set
           nome = excluded.nome, acrescimo = excluded.acrescimo,
           ordem = excluded.ordem`,
        [id, grupo, chave, nome, acrescimo, i],
      );
    }
  }
}
console.log(`✓ ${produtos.length} produtos`);

// ---------------------------------------------------------------- coleção

const [{ id: colecao }] = await exec<{ id: string }>(
  `insert into colecoes (confeiteira_id, chave, nome, descricao, periodo, ativa, destaque)
   values ($1,'sempre','Cardápio de sempre',$2,'sem data de fim',true,false)
   on conflict (confeiteira_id, chave) do update set
     nome = excluded.nome, descricao = excluded.descricao,
     ativa = true, destaque = false
   returning id`,
  [confeiteira, "O que há sempre, todo o ano."],
);

for (const [ordem, produto] of ids.entries()) {
  await exec(
    `insert into colecao_produtos (colecao_id, produto_id, ordem)
     values ($1,$2,$3)
     on conflict (colecao_id, produto_id) do update set ordem = excluded.ordem`,
    [colecao, produto, ordem],
  );
}
console.log("✓ cardápio de sempre");
console.log(`\nA página está em /${SLUG}`);
