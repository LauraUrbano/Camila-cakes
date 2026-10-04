import FotoProduto from "@/app/foto-produto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { produtosDaColecao } from "@/lib/dados";
import { lojaDoSlug } from "@/lib/fonte";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { moeda, precoAPartirDe, restam } from "@/lib/precos";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { avaliacoesPublicas } from "@/lib/bd/avaliacoes";
import { linguaActual } from "@/lib/i18n/servidor";
import Avaliacoes from "./avaliacoes";
import { url } from "@/lib/seo";
import type { Moeda, Produto } from "@/lib/tipos";

function CardProduto({
  produto,
  slug,
  codigo,
  t,
}: {
  produto: Produto;
  slug: string;
  codigo: Moeda;
  t: Awaited<ReturnType<typeof dicionarioActual>>["loja"];
}) {
  const sobrando = restam(produto);
  const esgotado = sobrando === 0;

  return (
    <Link
      href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
      aria-disabled={esgotado}
      className={`group block overflow-hidden rounded-3xl border border-borda bg-cartao transition ${
        esgotado ? "cursor-not-allowed opacity-55" : "hover:border-marca"
      }`}
    >
      <FotoProduto
        foto={produto.foto}
        nome={produto.nome}
        cor={produto.cor}
        className="h-44"
        sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-titulo text-lg">{produto.nome}</h3>
          {sobrando !== null && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                esgotado ? "bg-borda text-suave" : "bg-marca-suave text-marca"
              }`}
            >
              {esgotado ? t.esgotado : `${t.restam} ${sobrando}`}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-suave">
          {produto.descricao}
        </p>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-sm text-suave">
            {t.desde}{" "}
            <strong className="font-medium text-texto">
              {moeda(precoAPartirDe(produto), codigo)}
            </strong>
          </span>
          <span className="text-xs text-suave">
            {produto.antecedenciaDias} {t.diasAntes}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function PaginaDaConfeiteira({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = (await dicionarioActual()).loja;
  const loja = await lojaDoSlug(slug);
  if (!loja) notFound();

  const { confeiteira } = loja;
  const codigo = confeiteira.moeda;
  const ativas = loja.colecoes.filter((colecao) => colecao.ativa);
  const avaliacoes = temBaseDeDados()
    ? await avaliacoesPublicas(executorNeon(), slug)
    : { lista: [], resumo: { media: 0, quantas: 0, porNota: [0, 0, 0, 0, 0] } };

  /**
   * Dados estruturados: é assim que o Google percebe que isto é uma
   * confeitaria de uma cidade e não um artigo, e o que lhe permite mostrar
   * a morada e os produtos no resultado da busca.
   */
  const dados = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: confeiteira.nome,
    description: confeiteira.bio || confeiteira.tagline,
    url: url(`/${slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: confeiteira.cidade,
      addressCountry: confeiteira.pais,
    },
    currenciesAccepted: confeiteira.moeda,
    ...(avaliacoes.resumo.quantas > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avaliacoes.resumo.media.toFixed(1),
        reviewCount: avaliacoes.resumo.quantas,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    makesOffer: loja.produtos.slice(0, 20).map((produto) => ({
      "@type": "Offer",
      name: produto.nome,
      price: precoAPartirDe(produto),
      priceCurrency: confeiteira.moeda,
      url: url(`/${slug}/produto/${produto.id}`),
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
      />
      <section className="py-16">
        <h1 className="max-w-lg text-3xl leading-snug sm:text-[2.6rem]">
          {confeiteira.tagline}
        </h1>
        <p className="mt-6 max-w-xl leading-relaxed text-suave">
          {confeiteira.bio}
        </p>
      </section>

      {ativas.map((colecao) => {
        const itens = produtosDaColecao(loja, colecao);
        return (
          <section key={colecao.id} className="mb-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-titulo text-xl">{colecao.nome}</h2>
                  {colecao.destaque && (
                    <span className="rounded-full bg-marca-suave px-2.5 py-1 text-[11px] text-marca">
                      {t.porTempoLimitado}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-suave">{colecao.descricao}</p>
              </div>
              <span className="text-xs text-suave">{colecao.periodo}</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {itens.map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  slug={slug}
                  codigo={codigo}
                  t={t}
                />
              ))}
            </div>
          </section>
        );
      })}

      {confeiteira.aceitaPersonalizado && (
        <section className="mb-16 rounded-3xl bg-marca-suave p-9">
          <h2 className="font-titulo text-xl">{t.naoEncontrou}</h2>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-suave">
            {t.naoEncontrouTexto}
          </p>
          <Link
            href={`/${slug}/personalizado`}
            className="mt-6 inline-block rounded-full bg-marca px-5 py-2.5 text-sm text-white"
          >
            {t.pedirOrcamento}
          </Link>
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-borda bg-cartao p-7">
          <h3 className="font-titulo">{t.comoRecebe}</h3>
          <ul className="mt-5 space-y-3.5 text-sm">
            {confeiteira.entregas.map((entrega) => (
              <li key={entrega.id} className="flex justify-between gap-4">
                <span>
                  <span className="block">{entrega.nome}</span>
                  <span className="block text-xs text-suave">
                    {entrega.descricao}
                  </span>
                </span>
                <span className="shrink-0">
                  {entrega.taxa === 0
                    ? t.gratis
                    : moeda(entrega.taxa, codigo)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-borda bg-cartao p-7">
          <h3 className="font-titulo">{t.comoPaga}</h3>
          <p className="mt-5 text-sm leading-relaxed text-suave">
            {confeiteira.avisoPagamento}
          </p>
          <p className="mt-5 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
            {t.reservaAntes} <strong>{t.reservaForte}</strong>
            {t.reservaDepois}
          </p>
        </div>
      </section>

      <Avaliacoes
        slug={slug}
        nome={confeiteira.nome}
        lista={avaliacoes.lista}
        resumo={avaliacoes.resumo}
        lingua={await linguaActual()}
      />
    </main>
  );
}
