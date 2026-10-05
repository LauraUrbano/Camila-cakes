import Link from "next/link";
import { notFound } from "next/navigation";
import { lojaDoSlug } from "@/lib/fonte";
import { dicionarioDaLoja } from "@/lib/i18n/servidor";
import { moeda, precoAPartirDe } from "@/lib/precos";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { avaliacoesPublicas } from "@/lib/bd/avaliacoes";
import { linguaActual } from "@/lib/i18n/servidor";
import Avaliacoes from "./avaliacoes";
import { url } from "@/lib/seo";
import { Capa, eModelo, larguraDoModelo, type Modelo } from "./modelos";
import Cardapio from "./cardapio";

export default async function PaginaDaConfeiteira({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = await lojaDoSlug(slug);
  if (!loja) notFound();
  const t = (await dicionarioDaLoja(loja.confeiteira.lingua)).loja;
  const { confeiteira } = loja;
  const codigo = confeiteira.moeda;
  const ativas = loja.colecoes.filter((colecao) => colecao.ativa);
  const modelo: Modelo = eModelo(confeiteira.modelo) ? confeiteira.modelo : "classico";
  // A capa dos modelos de fotografia usa a melhor imagem que a loja tiver.
  const capa = loja.produtos.find((p) => p.foto)?.foto ?? "";

  // Um produto pode estar em várias coleções; o cardápio precisa de saber em
  // quais para poder filtrar. Fora de coleção não aparece — é assim que ela
  // guarda um bolo sem o publicar.
  const produtosVisiveis = loja.produtos
    .map((produto) => ({
      ...produto,
      colecoes: ativas
        .filter((colecao) => colecao.produtoIds.includes(produto.id))
        .map((colecao) => colecao.id),
    }))
    .filter((produto) => produto.colecoes.length > 0);
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
    <main className={`mx-auto ${larguraDoModelo(modelo)} px-6`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
      />
      <Capa modelo={modelo} confeiteira={confeiteira} foto={capa} />

      <Cardapio
        modelo={modelo}
        slug={slug}
        codigo={codigo}
        colecoes={ativas.map((colecao) => ({
          id: colecao.id,
          nome: colecao.nome,
          descricao: colecao.descricao,
          periodo: colecao.periodo,
          destaque: colecao.destaque,
        }))}
        produtos={produtosVisiveis}
      />

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
