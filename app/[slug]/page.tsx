import Link from "next/link";
import { notFound } from "next/navigation";
import { lojaPorSlug, produtosDaColecao } from "@/lib/dados";
import { moeda, precoAPartirDe, restam } from "@/lib/precos";
import type { Moeda, Produto } from "@/lib/tipos";

function CardProduto({
  produto,
  slug,
  codigo,
}: {
  produto: Produto;
  slug: string;
  codigo: Moeda;
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
      <div
        className="grid h-40 place-items-center text-5xl"
        style={{ background: produto.cor }}
      >
        {produto.emoji}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-titulo text-lg">{produto.nome}</h3>
          {sobrando !== null && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                esgotado ? "bg-borda text-suave" : "bg-marca-suave text-marca"
              }`}
            >
              {esgotado ? "esgotado" : `restam ${sobrando}`}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-suave">
          {produto.descricao}
        </p>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-sm text-suave">
            desde{" "}
            <strong className="font-medium text-texto">
              {moeda(precoAPartirDe(produto), codigo)}
            </strong>
          </span>
          <span className="text-xs text-suave">
            {produto.antecedenciaDias} dias antes
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
  const loja = lojaPorSlug(slug);
  if (!loja) notFound();

  const { confeiteira } = loja;
  const codigo = confeiteira.moeda;
  const ativas = loja.colecoes.filter((colecao) => colecao.ativa);

  return (
    <main className="mx-auto max-w-4xl px-6">
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
                      por tempo limitado
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
                />
              ))}
            </div>
          </section>
        );
      })}

      {confeiteira.aceitaPersonalizado && (
        <section className="mb-16 rounded-3xl bg-marca-suave p-9">
          <h2 className="font-titulo text-xl">Não encontrou o que queria?</h2>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-suave">
            Bolo de casamento, tema específico, restrição alimentar. Conte-me a
            ideia que eu faço um orçamento.
          </p>
          <Link
            href={`/${slug}/personalizado`}
            className="mt-6 inline-block rounded-full bg-marca px-5 py-2.5 text-sm text-white"
          >
            Pedir orçamento
          </Link>
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-borda bg-cartao p-7">
          <h3 className="font-titulo">Como recebe</h3>
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
                  {entrega.taxa === 0 ? "grátis" : moeda(entrega.taxa, codigo)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-borda bg-cartao p-7">
          <h3 className="font-titulo">Como paga</h3>
          <p className="mt-5 text-sm leading-relaxed text-suave">
            {confeiteira.avisoPagamento}
          </p>
          <p className="mt-5 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
            O pedido feito pelo site é um <strong>pedido de reserva</strong>.
            Só entra na agenda depois de eu confirmar consigo e aceitar.
          </p>
        </div>
      </section>
    </main>
  );
}
