import sharp from "sharp";
import type { Executor } from "./cliente";
import { paraSlug } from "@/lib/slug";

/**
 * Escrita do cardápio pela confeiteira.
 *
 * Tudo aqui é filtrado pelo endereço da loja dentro da própria consulta. Os
 * identificadores vêm do ecrã e não são de confiança: sem esse filtro,
 * bastava adivinhar um para mexer no cardápio de outra confeitaria.
 */

async function idDaLoja(exec: Executor, slug: string): Promise<string | null> {
  const [conta] = await exec<{ id: string }>(
    `select id from confeiteiras where slug = $1`,
    [slug],
  );
  return conta?.id ?? null;
}

/** Uma chave única dentro da loja, a partir do nome que ela escreveu. */
async function chaveLivre(
  exec: Executor,
  tabela: "produtos" | "colecoes" | "entregas",
  lojaId: string,
  nome: string,
): Promise<string> {
  const base = paraSlug(nome) || "item";
  for (let i = 0; i < 50; i += 1) {
    const tentativa = i === 0 ? base : `${base}-${i + 1}`;
    const linhas = await exec(
      `select 1 from ${tabela} where confeiteira_id = $1 and chave = $2`,
      [lojaId, tentativa],
    );
    if (linhas.length === 0) return tentativa;
  }
  return `${base}-${Date.now()}`;
}

// ------------------------------------------------------------- produtos

export type ProdutoEditavel = {
  nome: string;
  descricao: string;
  categoria: string;
  cor: string;
  maxDecoracoes: number;
  antecedenciaDias: number;
  /** Nulo = sem limite de produção. */
  limiteTotal: number | null;
  limiteVendidos: number;
  activo: boolean;
};

export async function criarProduto(
  exec: Executor,
  slug: string,
  nome: string,
): Promise<{ chave: string } | { erro: "semLoja" }> {
  const lojaId = await idDaLoja(exec, slug);
  if (!lojaId) return { erro: "semLoja" };

  const chave = await chaveLivre(exec, "produtos", lojaId, nome);
  const [{ ordem }] = await exec<{ ordem: number }>(
    `select coalesce(max(ordem), -1) + 1 as ordem from produtos where confeiteira_id = $1`,
    [lojaId],
  );

  const [produto] = await exec<{ id: string }>(
    `insert into produtos (confeiteira_id, chave, nome, ordem, activo)
     values ($1,$2,$3,$4,false)
     returning id`,
    [lojaId, chave, nome, ordem],
  );

  // Um produto sem tamanho não tem preço e o montador não o consegue
  // mostrar. Entra com um, para ela só ter de lhe pôr o valor.
  await exec(
    `insert into tamanhos (produto_id, chave, nome, porcoes, preco, max_recheios, ordem)
     values ($1,'unico','Tamanho único','',0,0,0)`,
    [produto.id],
  );

  // E entra numa coleção, senão não aparece em lado nenhum: a página pública
  // mostra coleções, não produtos soltos. Um produto guardado que não se vê
  // é o pior resultado possível para quem acabou de o criar.
  await ligarAColecaoPrincipal(exec, lojaId, produto.id);

  return { chave };
}

/**
 * Põe o produto na coleção de sempre, criando-a se a loja ainda não tiver
 * nenhuma. Quem quiser organizar por épocas mexe nas coleções depois.
 */
async function ligarAColecaoPrincipal(
  exec: Executor,
  lojaId: string,
  produtoId: string,
): Promise<void> {
  let [colecao] = await exec<{ id: string }>(
    `select id from colecoes where confeiteira_id = $1 order by ordem, nome limit 1`,
    [lojaId],
  );

  if (!colecao) {
    [colecao] = await exec<{ id: string }>(
      `insert into colecoes (confeiteira_id, chave, nome, descricao, periodo, ativa)
       values ($1,'sempre','Cardápio de sempre','','sem data de fim',true)
       returning id`,
      [lojaId],
    );
  }

  const [{ ordem }] = await exec<{ ordem: number }>(
    `select coalesce(max(ordem), -1) + 1 as ordem
     from colecao_produtos where colecao_id = $1`,
    [colecao.id],
  );

  await exec(
    `insert into colecao_produtos (colecao_id, produto_id, ordem)
     values ($1,$2,$3)
     on conflict (colecao_id, produto_id) do nothing`,
    [colecao.id, produtoId, ordem],
  );
}

export async function guardarProduto(
  exec: Executor,
  slug: string,
  chave: string,
  dados: ProdutoEditavel,
): Promise<void> {
  await exec(
    `update produtos p set
       nome = $3, descricao = $4, categoria = $5, cor = $6,
       max_decoracoes = $7, antecedencia_dias = $8,
       -- Os moldes precisam de tipo explícito: o mesmo $9 aparece duas vezes,
       -- uma delas dentro de coalesce, e sem a marca o Postgres não consegue
       -- deduzir o tipo e recusa a instrução inteira.
       limite_total = $9::integer,
       limite_vendidos = least($10::integer, coalesce($9::integer, $10::integer)),
       activo = $11
     from confeiteiras c
     where c.id = p.confeiteira_id and c.slug = $1 and p.chave = $2`,
    [
      slug,
      chave,
      dados.nome,
      dados.descricao,
      dados.categoria,
      dados.cor,
      dados.maxDecoracoes,
      dados.antecedenciaDias,
      dados.limiteTotal,
      dados.limiteVendidos,
      dados.activo,
    ],
  );
}

export async function apagarProduto(
  exec: Executor,
  slug: string,
  chave: string,
): Promise<void> {
  await exec(
    `delete from produtos p
      using confeiteiras c
      where c.id = p.confeiteira_id and c.slug = $1 and p.chave = $2`,
    [slug, chave],
  );
}

export async function moverProduto(
  exec: Executor,
  slug: string,
  chave: string,
  direccao: -1 | 1,
): Promise<void> {
  const lojaId = await idDaLoja(exec, slug);
  if (!lojaId) return;

  const lista = await exec<{ chave: string }>(
    `select chave from produtos where confeiteira_id = $1 order by ordem, nome`,
    [lojaId],
  );
  const i = lista.findIndex((p) => p.chave === chave);
  const j = i + direccao;
  if (i < 0 || j < 0 || j >= lista.length) return;

  [lista[i], lista[j]] = [lista[j], lista[i]];
  for (const [ordem, p] of lista.entries()) {
    await exec(
      `update produtos set ordem = $3 where confeiteira_id = $1 and chave = $2`,
      [lojaId, p.chave, ordem],
    );
  }
}

/**
 * Guarda a fotografia de um produto.
 *
 * Fica quadrada porque é assim que aparece no cartão do cardápio; cortar
 * aqui é a única forma de saber o que vai aparecer. O endereço guardado em
 * `foto` aponta para a rota que serve estes bytes, e leva a versão para o
 * browser não continuar a mostrar a antiga.
 */
export async function guardarFotoDoProduto(
  exec: Executor,
  slug: string,
  chave: string,
  ficheiro: ArrayBuffer,
): Promise<{ bytes: number } | { erro: "naoEImagem" }> {
  let reduzida: Buffer;
  try {
    reduzida = await sharp(Buffer.from(ficheiro))
      .rotate()
      .resize(1000, 1000, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch {
    return { erro: "naoEImagem" };
  }

  await exec(
    `update produtos p set
       foto_bytes = $3,
       foto_tipo = 'image/jpeg',
       foto_versao = p.foto_versao + 1,
       -- A versão entra no caminho e não numa interrogação: o next/image
       -- recusa endereços locais com query string.
       foto = '/' || c.slug || '/foto/' || p.chave || '/' || (p.foto_versao + 1)
     from confeiteiras c
     where c.id = p.confeiteira_id and c.slug = $1 and p.chave = $2`,
    [slug, chave, reduzida],
  );
  return { bytes: reduzida.length };
}

export async function apagarFotoDoProduto(
  exec: Executor,
  slug: string,
  chave: string,
): Promise<void> {
  await exec(
    `update produtos p set foto_bytes = null, foto_tipo = null, foto = null
     from confeiteiras c
     where c.id = p.confeiteira_id and c.slug = $1 and p.chave = $2`,
    [slug, chave],
  );
}

export async function fotoDoProduto(
  exec: Executor,
  slug: string,
  chave: string,
): Promise<{ bytes: Buffer; tipo: string } | null> {
  const [linha] = await exec<{ foto_bytes: unknown; foto_tipo: string | null }>(
    `select p.foto_bytes, p.foto_tipo from produtos p
     join confeiteiras c on c.id = p.confeiteira_id
     where c.slug = $1 and p.chave = $2`,
    [slug, chave],
  );
  if (!linha?.foto_bytes) return null;

  const cru = linha.foto_bytes;
  const bytes =
    typeof cru === "string"
      ? Buffer.from(cru.replace(/^\\x/, ""), "hex")
      : Buffer.from(cru as Uint8Array);
  return { bytes, tipo: linha.foto_tipo ?? "image/jpeg" };
}

// ------------------------------------------------------------- tamanhos

export type TamanhoEditavel = {
  id?: string;
  nome: string;
  porcoes: string;
  preco: number;
  maxRecheios: number;
};

/**
 * Grava os tamanhos todos de uma vez.
 *
 * Substituir a lista inteira é mais simples do que acertar diferenças linha
 * a linha, e os tamanhos são poucos. O que já existe é actualizado pelo id,
 * para não perder a chave natural; o que desapareceu do ecrã é apagado.
 */
export async function guardarTamanhos(
  exec: Executor,
  slug: string,
  chaveProduto: string,
  lista: TamanhoEditavel[],
): Promise<void> {
  const [produto] = await exec<{ id: string }>(
    `select p.id from produtos p
     join confeiteiras c on c.id = p.confeiteira_id
     where c.slug = $1 and p.chave = $2`,
    [slug, chaveProduto],
  );
  if (!produto) return;

  const guardados: string[] = [];
  for (const [ordem, t] of lista.entries()) {
    if (t.id) {
      await exec(
        `update tamanhos set nome = $3, porcoes = $4, preco = $5,
                             max_recheios = $6, ordem = $7
         where id = $1 and produto_id = $2`,
        [t.id, produto.id, t.nome, t.porcoes, t.preco, t.maxRecheios, ordem],
      );
      guardados.push(t.id);
    } else {
      const [novo] = await exec<{ id: string }>(
        `insert into tamanhos (produto_id, chave, nome, porcoes, preco, max_recheios, ordem)
         values ($1,$2,$3,$4,$5,$6,$7)
         returning id`,
        [
          produto.id,
          `${paraSlug(t.nome) || "tamanho"}-${ordem}`,
          t.nome,
          t.porcoes,
          t.preco,
          t.maxRecheios,
          ordem,
        ],
      );
      guardados.push(novo.id);
    }
  }

  await exec(
    `delete from tamanhos where produto_id = $1 and not (id = any($2::uuid[]))`,
    [produto.id, guardados],
  );
}

// -------------------------------------------------------------- opções

export type GrupoDeOpcao = "massa" | "recheio" | "decoracao";

export type OpcaoEditavel = {
  id?: string;
  nome: string;
  acrescimo: number;
  disponivel: boolean;
};

export async function guardarOpcoes(
  exec: Executor,
  slug: string,
  chaveProduto: string,
  grupo: GrupoDeOpcao,
  lista: OpcaoEditavel[],
): Promise<void> {
  const [produto] = await exec<{ id: string }>(
    `select p.id from produtos p
     join confeiteiras c on c.id = p.confeiteira_id
     where c.slug = $1 and p.chave = $2`,
    [slug, chaveProduto],
  );
  if (!produto) return;

  const guardados: string[] = [];
  for (const [ordem, o] of lista.entries()) {
    if (o.id) {
      await exec(
        `update opcoes set nome = $3, acrescimo = $4, disponivel = $5, ordem = $6
         where id = $1 and produto_id = $2`,
        [o.id, produto.id, o.nome, o.acrescimo, o.disponivel, ordem],
      );
      guardados.push(o.id);
    } else {
      const [nova] = await exec<{ id: string }>(
        `insert into opcoes (produto_id, grupo, chave, nome, acrescimo, disponivel, ordem)
         values ($1,$2,$3,$4,$5,$6,$7)
         returning id`,
        [
          produto.id,
          grupo,
          `${paraSlug(o.nome) || grupo}-${ordem}`,
          o.nome,
          o.acrescimo,
          o.disponivel,
          ordem,
        ],
      );
      guardados.push(nova.id);
    }
  }

  await exec(
    `delete from opcoes
      where produto_id = $1 and grupo = $2 and not (id = any($3::uuid[]))`,
    [produto.id, grupo, guardados],
  );
}

// --------------------------------------------------------- para o editor

export type LinhaDeTamanho = TamanhoEditavel & { id: string };
export type LinhaDeOpcao = OpcaoEditavel & { id: string };

export type ProdutoParaEditar = ProdutoEditavel & {
  chave: string;
  foto: string;
  tamanhos: LinhaDeTamanho[];
  massas: LinhaDeOpcao[];
  recheios: LinhaDeOpcao[];
  decoracoes: LinhaDeOpcao[];
};

/**
 * O cardápio como ela o vê para editar.
 *
 * Diferente do que vai para a página pública em duas coisas: traz também os
 * produtos desligados, que são os rascunhos dela, e traz os identificadores
 * das linhas, para o formulário saber o que actualizar e o que criar.
 */
export async function cardapioParaEditar(
  exec: Executor,
  slug: string,
): Promise<ProdutoParaEditar[]> {
  const lojaId = await idDaLoja(exec, slug);
  if (!lojaId) return [];

  const linhas = await exec<Record<string, unknown>>(
    `select * from produtos where confeiteira_id = $1 order by ordem, nome`,
    [lojaId],
  );

  const produtos: ProdutoParaEditar[] = [];
  for (const p of linhas) {
    const tamanhos = await exec<Record<string, unknown>>(
      `select id, nome, porcoes, preco, max_recheios from tamanhos
       where produto_id = $1 order by ordem, preco`,
      [p.id],
    );
    const opcoes = await exec<Record<string, unknown>>(
      `select id, grupo, nome, acrescimo, disponivel from opcoes
       where produto_id = $1 order by ordem, nome`,
      [p.id],
    );
    const doGrupo = (grupo: string): LinhaDeOpcao[] =>
      opcoes
        .filter((o) => o.grupo === grupo)
        .map((o) => ({
          id: String(o.id),
          nome: String(o.nome),
          acrescimo: Number(o.acrescimo ?? 0),
          disponivel: Boolean(o.disponivel),
        }));

    produtos.push({
      chave: String(p.chave),
      nome: String(p.nome),
      descricao: String(p.descricao ?? ""),
      categoria: String(p.categoria ?? ""),
      foto: p.foto ? String(p.foto) : "",
      cor: String(p.cor ?? "#F3E3D7"),
      maxDecoracoes: Number(p.max_decoracoes ?? 0),
      antecedenciaDias: Number(p.antecedencia_dias ?? 0),
      limiteTotal: p.limite_total === null ? null : Number(p.limite_total),
      limiteVendidos: Number(p.limite_vendidos ?? 0),
      activo: Boolean(p.activo),
      tamanhos: tamanhos.map((t) => ({
        id: String(t.id),
        nome: String(t.nome),
        porcoes: String(t.porcoes ?? ""),
        preco: Number(t.preco ?? 0),
        maxRecheios: Number(t.max_recheios ?? 0),
      })),
      massas: doGrupo("massa"),
      recheios: doGrupo("recheio"),
      decoracoes: doGrupo("decoracao"),
    });
  }
  return produtos;
}

export async function produtoParaEditar(
  exec: Executor,
  slug: string,
  chave: string,
): Promise<ProdutoParaEditar | undefined> {
  const todos = await cardapioParaEditar(exec, slug);
  return todos.find((p) => p.chave === chave);
}
