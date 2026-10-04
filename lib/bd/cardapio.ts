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

  return { chave };
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
       limite_total = $9, limite_vendidos = least($10, coalesce($9, $10)),
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
       foto = '/' || c.slug || '/foto/' || p.chave || '?v=' || (p.foto_versao + 1)
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
