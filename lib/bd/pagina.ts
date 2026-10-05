import sharp from "sharp";
import type { Executor } from "./cliente";

export type SeoDaPagina = {
  titulo: string;
  descricao: string;
  versaoDaImagem: number;
};

export async function seoDaPagina(
  exec: Executor,
  slug: string,
): Promise<SeoDaPagina> {
  const [linha] = await exec<{
    seo_titulo: string;
    seo_descricao: string;
    imagem_partilha_versao: number;
  }>(
    `select seo_titulo, seo_descricao, imagem_partilha_versao
     from confeiteiras where slug = $1`,
    [slug],
  );
  return {
    titulo: String(linha?.seo_titulo ?? ""),
    descricao: String(linha?.seo_descricao ?? ""),
    versaoDaImagem: Number(linha?.imagem_partilha_versao ?? 0),
  };
}

export async function guardarSeo(
  exec: Executor,
  slug: string,
  dados: { titulo: string; descricao: string },
): Promise<void> {
  await exec(
    `update confeiteiras set seo_titulo = $2, seo_descricao = $3 where slug = $1`,
    [slug, dados.titulo.slice(0, 70), dados.descricao.slice(0, 200)],
  );
}

/**
 * Guarda a imagem de partilha, já no tamanho certo.
 *
 * 1200 por 630 é o que o Facebook, o WhatsApp e o LinkedIn esperam; uma
 * imagem de outro formato é cortada por eles de maneiras diferentes e
 * raramente pelo sítio certo. Cortar aqui é a única forma de saber o que
 * vai aparecer.
 *
 * Sai em JPEG mesmo que entre PNG: uma fotografia de bolo em PNG ocupa dez
 * vezes mais sem ficar melhor, e isto vai para dentro da base de dados.
 */
export async function guardarImagemPartilha(
  exec: Executor,
  slug: string,
  ficheiro: ArrayBuffer,
): Promise<{ bytes: number } | { erro: "naoEImagem" }> {
  let reduzida: Buffer;
  try {
    reduzida = await sharp(Buffer.from(ficheiro))
      .rotate() // respeita a orientação da câmara, senão sai deitada
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch {
    return { erro: "naoEImagem" };
  }

  await exec(
    `update confeiteiras set
       imagem_partilha = $2,
       imagem_partilha_tipo = 'image/jpeg',
       imagem_partilha_versao = imagem_partilha_versao + 1
     where slug = $1`,
    [slug, reduzida],
  );
  return { bytes: reduzida.length };
}

export async function apagarImagemPartilha(
  exec: Executor,
  slug: string,
): Promise<void> {
  await exec(
    `update confeiteiras set
       imagem_partilha = null,
       imagem_partilha_tipo = null,
       imagem_partilha_versao = imagem_partilha_versao + 1
     where slug = $1`,
    [slug],
  );
}

export async function imagemPartilha(
  exec: Executor,
  slug: string,
): Promise<{ bytes: Buffer; tipo: string } | null> {
  const [linha] = await exec<{
    imagem_partilha: unknown;
    imagem_partilha_tipo: string | null;
  }>(
    `select imagem_partilha, imagem_partilha_tipo from confeiteiras where slug = $1`,
    [slug],
  );
  if (!linha?.imagem_partilha) return null;

  // O driver do Neon devolve bytea como string hexadecimal com prefixo \x.
  const cru = linha.imagem_partilha;
  const bytes =
    typeof cru === "string"
      ? Buffer.from(cru.replace(/^\\x/, ""), "hex")
      : Buffer.from(cru as Uint8Array);

  return { bytes, tipo: linha.imagem_partilha_tipo ?? "image/jpeg" };
}

export type Aparencia = { lingua: string; modelo: string };

export async function aparenciaDaPagina(
  exec: Executor,
  slug: string,
): Promise<Aparencia> {
  const [linha] = await exec<{ lingua: string | null; modelo: string | null }>(
    `select lingua, modelo from confeiteiras where slug = $1`,
    [slug],
  );
  return {
    lingua: linha?.lingua ?? "",
    modelo: linha?.modelo ?? "classico",
  };
}

export async function guardarAparencia(
  exec: Executor,
  slug: string,
  dados: Aparencia,
): Promise<void> {
  await exec(
    `update confeiteiras set
       lingua = nullif($2, ''),
       modelo = $3
     where slug = $1`,
    [slug, dados.lingua, dados.modelo],
  );
}
