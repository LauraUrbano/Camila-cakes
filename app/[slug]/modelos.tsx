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
  // Uma conta acabada de abrir ainda não tem frase nem apresentação escritas.
  // Sem isto a capa ficava um rectângulo vazio e a página não dizia em lado
  // nenhum de quem era — o nome da confeitaria serve de título até ela
  // escrever o seu.
  const titulo = confeiteira.tagline.trim() || confeiteira.nome;
  const apresentacao = confeiteira.bio.trim();

  if (modelo === "vitrine") {
    return (
      <section className="relative -mx-6 mb-6 h-[25rem] overflow-hidden sm:h-[28rem] sm:rounded-b-[2.5rem]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundColor: confeiteira.tema.marcaSuave,
            backgroundImage: foto ? `url(${foto})` : undefined,
          }}
        />
        {/* O véu existe para o texto se ler sobre qualquer fotografia, clara
            ou escura — sem ele, metade das fotos tornava o nome ilegível. */}
        {/* No telemóvel o texto ocupa quase toda a capa, por isso o véu
            precisa de ir mais acima e mais escuro do que no ecrã grande —
            senão o nome cai em cima da parte clara da fotografia. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10 sm:from-black/70 sm:via-black/25 sm:to-black/5" />
        <div className="relative flex h-full flex-col justify-end p-6 sm:p-12">
          <h1 className="max-w-xl text-[1.75rem] leading-tight font-semibold text-balance text-white sm:text-[2.8rem]">
            {titulo}
          </h1>
          {apresentacao && (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base">
              {apresentacao}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (modelo === "revista") {
    return (
      <section className="grid items-end gap-7 py-10 sm:grid-cols-[1.15fr_1fr] sm:gap-12 sm:py-14">
        <div>
          {confeiteira.cidade && (
            <p className="text-xs tracking-[0.22em] text-marca uppercase">
              {confeiteira.cidade}
            </p>
          )}
          <h1
            className={`text-[2rem] leading-[1.08] font-semibold text-balance sm:text-[3.2rem] ${
              confeiteira.cidade ? "mt-4 sm:mt-5" : ""
            }`}
          >
            {titulo}
          </h1>
          {apresentacao && (
            <p className="mt-5 max-w-md leading-relaxed text-suave sm:mt-6">
              {apresentacao}
            </p>
          )}
        </div>
        <div
          className="h-52 overflow-hidden rounded-[1.5rem] bg-cover bg-center sm:h-80 sm:rounded-[2rem]"
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
      <h1 className="max-w-lg text-3xl leading-snug sm:text-[2.6rem]">{titulo}</h1>
      {apresentacao && (
        <p className="mt-6 max-w-xl leading-relaxed text-suave">{apresentacao}</p>
      )}
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
  if (modelo === "classico") {
    return (
      <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {itens.map((produto) => {
          const sobrando = restam(produto);
          const esgotado = sobrando === 0;
          return (
            <li key={produto.id}>
              <Link
                href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
                aria-disabled={esgotado}
                className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-borda bg-cartao transition ${
                  esgotado ? "cursor-not-allowed opacity-55" : "hover:border-marca"
                }`}
              >
                <FotoProduto
                  foto={produto.foto}
                  nome={produto.nome}
                  cor={produto.cor}
                  className="h-40 shrink-0 sm:h-44"
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
                />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-titulo text-lg">{produto.nome}</h3>
                    <Etiqueta sobrando={sobrando} t={t} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-suave">
                    {produto.descricao}
                  </p>
                  {/* O preço encosta ao fundo do cartão: as descrições têm
                      comprimentos diferentes e, sem isto, o preço de cada
                      cartão da mesma fila ficava a uma altura diferente. */}
                  <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-5 text-sm">
                    <span>
                      <span className="text-suave">{t.desde} </span>
                      <span className="font-medium">
                        {moeda(precoAPartirDe(produto), codigo)}
                      </span>
                    </span>
                    {produto.antecedenciaDias > 0 && (
                      <span className="text-xs text-suave">
                        {produto.antecedenciaDias} {t.diasAntes}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  if (modelo === "revista") {
    // Linhas alternadas: a fotografia troca de lado a cada produto, que é o
    // que dá o ritmo de catálogo em vez de grelha.
    return (
      <ul className="space-y-8 sm:space-y-10">
        {itens.map((produto, i) => {
          const sobrando = restam(produto);
          const esgotado = sobrando === 0;
          return (
            <li key={produto.id}>
              <Link
                href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
                aria-disabled={esgotado}
                className={`group grid items-center gap-4 sm:grid-cols-2 sm:gap-7 ${
                  esgotado ? "cursor-not-allowed opacity-55" : ""
                }`}
              >
                <FotoProduto
                  foto={produto.foto}
                  nome={produto.nome}
                  cor={produto.cor}
                  className={`h-48 rounded-[1.5rem] sm:h-72 sm:rounded-[1.75rem] ${
                    i % 2 ? "sm:order-2" : ""
                  }`}
                  sizes="(min-width: 640px) 24rem, 100vw"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-titulo text-xl sm:text-2xl">{produto.nome}</h3>
                    <Etiqueta sobrando={sobrando} t={t} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-suave sm:mt-3 sm:text-base">
                    {produto.descricao}
                  </p>
                  <p className="mt-4 flex flex-wrap items-baseline gap-3 sm:mt-5">
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
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {itens.map((produto) => {
          const sobrando = restam(produto);
          const esgotado = sobrando === 0;
          // Sem fotografia não há nada escuro por baixo, e texto branco
          // sobre a cor clara do produto não se lê. Nesse caso o cartão
          // volta às cores normais em vez de fingir que tem imagem.
          const sobreFoto = Boolean(produto.foto);

          return (
            <li key={produto.id}>
              <Link
                href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
                aria-disabled={esgotado}
                className={`group relative block h-64 overflow-hidden rounded-[1.5rem] sm:h-72 sm:rounded-[1.75rem] ${
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
                {/* O véu cobre a metade de baixo do cartão, que é onde o
                    texto vive. Quando era um gradiente do cartão inteiro, o
                    título ficava já na parte clara e um bolo fotografado em
                    neve ou em mármore deixava de se ler. */}
                {sobreFoto && (
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/92 via-black/75 to-transparent" />
                )}
                <div
                  className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 ${
                    sobreFoto ? "" : "bg-cartao/92 backdrop-blur-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3
                      className={`font-titulo text-lg ${
                        sobreFoto ? "text-white" : "text-texto"
                      }`}
                    >
                      {produto.nome}
                    </h3>
                    <Etiqueta sobrando={sobrando} t={t} />
                  </div>
                  <p
                    className={`mt-1.5 line-clamp-2 text-sm ${
                      sobreFoto ? "text-white/80" : "text-suave"
                    }`}
                  >
                    {produto.descricao}
                  </p>
                  <p
                    className={`mt-3 flex flex-wrap items-baseline gap-2 text-sm ${
                      sobreFoto ? "text-white" : "text-texto"
                    }`}
                  >
                    <span className={sobreFoto ? "text-white/70" : "text-suave"}>
                      {t.desde}
                    </span>
                    <span className="font-medium">
                      {moeda(precoAPartirDe(produto), codigo)}
                    </span>
                    {produto.antecedenciaDias > 0 && (
                      <span
                        className={`text-xs ${
                          sobreFoto ? "text-white/70" : "text-suave"
                        }`}
                      >
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

  return null;
}
