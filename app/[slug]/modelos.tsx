import Link from "next/link";
import FotoProduto from "@/app/foto-produto";
import { moeda, precoAPartirDe, restam } from "@/lib/precos";
import type { Confeiteira, Moeda, Produto } from "@/lib/tipos";

/**
 * Três maneiras de arrumar a mesma página.
 *
 * Não são temas em cima das cores — isso já existe. São disposições
 * diferentes, porque uma confeitaria que vive de fotografia precisa de uma
 * página diferente de uma que vive de uma lista de sabores, e a terceira
 * precisa de uma que se leia como um catálogo.
 *
 * Os dados são exactamente os mesmos nas três. Trocar de modelo nunca pode
 * fazer desaparecer nada do que ela escreveu.
 */
export type Modelo = "classico" | "vitrine" | "revista";

export function eModelo(valor: string | undefined): valor is Modelo {
  return valor === "classico" || valor === "vitrine" || valor === "revista";
}

type TextosDaLoja = {
  esgotado: string;
  restam: string;
  diasAntes: string;
  desde: string;
};

/** A largura do conteúdo muda com o modelo: o editorial respira mais. */
export function larguraDoModelo(modelo: Modelo): string {
  return modelo === "classico" ? "max-w-4xl" : "max-w-5xl";
}

// ------------------------------------------------------------------ capa

export function Capa({
  modelo,
  confeiteira,
  foto,
}: {
  modelo: Modelo;
  confeiteira: Confeiteira;
  /** A melhor imagem que a loja tiver, para os modelos que vivem de foto. */
  foto: string;
}) {
  if (modelo === "vitrine") {
    return (
      <section className="relative -mx-6 mb-4 h-[22rem] overflow-hidden sm:h-[26rem] sm:rounded-b-[2.5rem]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundColor: confeiteira.tema.marcaSuave,
            backgroundImage: foto ? `url(${foto})` : undefined,
          }}
        />
        {/* O véu existe para o texto se ler sobre qualquer fotografia, clara
            ou escura — sem ele, metade das fotos tornava o nome ilegível. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
        <div className="relative flex h-full flex-col justify-end p-8 sm:p-12">
          <h1 className="max-w-xl text-3xl leading-tight font-semibold text-white sm:text-[2.8rem]">
            {confeiteira.tagline}
          </h1>
          <p className="mt-4 max-w-lg leading-relaxed text-white/85">
            {confeiteira.bio}
          </p>
        </div>
      </section>
    );
  }

  if (modelo === "revista") {
    return (
      <section className="grid items-end gap-8 py-14 sm:grid-cols-[1.15fr_1fr] sm:gap-12">
        <div>
          <p className="text-xs tracking-[0.22em] text-marca uppercase">
            {confeiteira.cidade}
          </p>
          <h1 className="mt-5 text-[2.4rem] leading-[1.05] font-semibold sm:text-[3.2rem]">
            {confeiteira.tagline}
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-suave">
            {confeiteira.bio}
          </p>
        </div>
        <div
          className="h-64 overflow-hidden rounded-[2rem] bg-cover bg-center sm:h-80"
          style={{
            backgroundColor: confeiteira.tema.marcaSuave,
            backgroundImage: foto ? `url(${foto})` : undefined,
          }}
        />
      </section>
    );
  }

  return (
    <section className="py-16">
      <h1 className="max-w-lg text-3xl leading-snug sm:text-[2.6rem]">
        {confeiteira.tagline}
      </h1>
      <p className="mt-6 max-w-xl leading-relaxed text-suave">
        {confeiteira.bio}
      </p>
    </section>
  );
}

// --------------------------------------------------------------- produtos

function Etiqueta({ sobrando, t }: { sobrando: number | null; t: TextosDaLoja }) {
  if (sobrando === null) return null;
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] ${
        sobrando === 0 ? "bg-borda text-suave" : "bg-marca-suave text-marca"
      }`}
    >
      {sobrando === 0 ? t.esgotado : `${t.restam} ${sobrando}`}
    </span>
  );
}

export function Produtos({
  modelo,
  itens,
  slug,
  codigo,
  t,
}: {
  modelo: Modelo;
  itens: Produto[];
  slug: string;
  codigo: Moeda;
  t: TextosDaLoja;
}) {
  if (modelo === "revista") {
    // Linhas alternadas: a fotografia troca de lado a cada produto, que é o
    // que dá o ritmo de catálogo em vez de grelha.
    return (
      <ul className="space-y-10">
        {itens.map((produto, i) => {
          const sobrando = restam(produto);
          const esgotado = sobrando === 0;
          return (
            <li key={produto.id}>
              <Link
                href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
                aria-disabled={esgotado}
                className={`group grid items-center gap-7 sm:grid-cols-2 ${
                  esgotado ? "cursor-not-allowed opacity-55" : ""
                }`}
              >
                <FotoProduto
                  foto={produto.foto}
                  nome={produto.nome}
                  cor={produto.cor}
                  className={`h-60 rounded-[1.75rem] sm:h-72 ${
                    i % 2 ? "sm:order-2" : ""
                  }`}
                  sizes="(min-width: 640px) 24rem, 100vw"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-titulo text-2xl">{produto.nome}</h3>
                    <Etiqueta sobrando={sobrando} t={t} />
                  </div>
                  <p className="mt-3 leading-relaxed text-suave">
                    {produto.descricao}
                  </p>
                  <p className="mt-5 flex flex-wrap items-baseline gap-3">
                    <span className="text-xs text-suave">{t.desde}</span>
                    <span className="font-titulo text-xl">
                      {moeda(precoAPartirDe(produto), codigo)}
                    </span>
                    {produto.antecedenciaDias > 0 && (
                      <span className="text-xs text-suave">
                        {produto.antecedenciaDias} {t.diasAntes}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  if (modelo === "vitrine") {
    // Fotografia grande e o texto por cima, no fundo do cartão.
    return (
      <ul className="grid gap-5 sm:grid-cols-2">
        {itens.map((produto) => {
          const sobrando = restam(produto);
          const esgotado = sobrando === 0;
          return (
            <li key={produto.id}>
              <Link
                href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
                aria-disabled={esgotado}
                className={`group relative block h-72 overflow-hidden rounded-[1.75rem] ${
                  esgotado ? "cursor-not-allowed opacity-55" : ""
                }`}
              >
                <FotoProduto
                  foto={produto.foto}
                  nome={produto.nome}
                  cor={produto.cor}
                  className="absolute inset-0 h-full"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-titulo text-lg text-white">
                      {produto.nome}
                    </h3>
                    <Etiqueta sobrando={sobrando} t={t} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-white/80">
                    {produto.descricao}
                  </p>
                  <p className="mt-3 text-sm text-white">
                    <span className="text-white/70">{t.desde} </span>
                    {moeda(precoAPartirDe(produto), codigo)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
}
