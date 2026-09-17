import Link from "next/link";
import { notFound } from "next/navigation";
import { colecoes, confeiteira, produtosDaColecao } from "@/lib/dados";
import { moeda, precoAPartirDe, restam } from "@/lib/precos";
import type { Produto } from "@/lib/tipos";

function CardProduto({ produto, slug }: { produto: Produto; slug: string }) {
  const sobrando = restam(produto);
  const esgotado = sobrando === 0;

  return (
    <Link
      href={esgotado ? `/${slug}` : `/${slug}/produto/${produto.id}`}
      aria-disabled={esgotado}
      className={`group block overflow-hidden rounded-2xl border border-borda bg-cartao transition ${
        esgotado ? "cursor-not-allowed opacity-55" : "hover:border-marca"
      }`}
    >
      <div
        className="grid h-40 place-items-center text-5xl"
        style={{ background: produto.cor }}
      >
        {produto.emoji}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-titulo text-lg font-semibold">{produto.nome}</h3>
          {sobrando !== null && (
            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                esgotado
                  ? "bg-borda text-suave"
                  : "bg-marca-suave text-marca"
              }`}
            >
              {esgotado ? "esgotado" : `restam ${sobrando}`}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-suave">
          {produto.descricao}
        </p>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm text-suave">
            a partir de{" "}
            <strong className="text-base text-texto">
              {moeda(precoAPartirDe(produto))}
            </strong>
          </span>
          <span className="text-xs text-suave">
            {produto.antecedenciaDias} dias de antecedência
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
  if (slug !== confeiteira.slug) notFound();

  const ativas = colecoes.filter((colecao) => colecao.ativa);

  return (
    <main className="mx-auto max-w-4xl px-6">
      <section className="py-14">
        <h1 className="max-w-lg text-3xl leading-tight font-semibold sm:text-4xl">
          {confeiteira.tagline}
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-suave">
          {confeiteira.bio}
        </p>
      </section>

      {ativas.map((colecao) => {
        const itens = produtosDaColecao(colecao);
        return (
          <section key={colecao.id} className="mb-14">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-titulo text-xl font-semibold">
                    {colecao.nome}
                  </h2>
                  {colecao.destaque && (
                    <span className="rounded-full bg-marca px-2 py-0.5 text-[11px] font-medium text-white">
                      por tempo limitado
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-suave">{colecao.descricao}</p>
              </div>
              <span className="text-xs text-suave">{colecao.periodo}</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {itens.map((produto) => (
                <CardProduto key={produto.id} produto={produto} slug={slug} />
              ))}
            </div>
          </section>
        );
      })}

      {confeiteira.aceitaPersonalizado && (
        <section className="mb-14 rounded-3xl bg-marca-suave p-8">
          <h2 className="font-titulo text-xl font-semibold">
            Não achou o que queria?
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-suave">
            Bolo de casamento, tema específico, restrição alimentar. Me conta a
            ideia que eu faço um orçamento.
          </p>
          <Link
            href={`/${slug}/personalizado`}
            className="mt-5 inline-block rounded-full bg-marca px-5 py-2.5 text-sm font-medium text-white"
          >
            Pedir orçamento personalizado
          </Link>
        </section>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-borda bg-cartao p-6">
          <h3 className="font-titulo font-semibold">Como recebo</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {confeiteira.entregas.map((entrega) => (
              <li key={entrega.id} className="flex justify-between gap-4">
                <span>
                  <span className="block">{entrega.nome}</span>
                  <span className="block text-xs text-suave">
                    {entrega.descricao}
                  </span>
                </span>
                <span className="shrink-0 font-medium">
                  {entrega.taxa === 0 ? "grátis" : moeda(entrega.taxa)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-borda bg-cartao p-6">
          <h3 className="font-titulo font-semibold">Como pago</h3>
          <p className="mt-4 text-sm leading-relaxed text-suave">
            {confeiteira.avisoPagamento}
          </p>
          <p className="mt-4 rounded-xl bg-marca-suave p-4 text-sm leading-relaxed">
            O pedido feito pelo site é um <strong>pedido de reserva</strong>.
            Ele só entra na agenda depois que eu confirmar com você e aceitar.
          </p>
        </div>
      </section>
    </main>
  );
}
