import Link from "next/link";
import FotoProduto from "@/app/foto-produto";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { cardapioParaEditar } from "@/lib/bd/cardapio";
import { exigirLoja } from "@/lib/fonte";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { moeda } from "@/lib/precos";
import NovoProduto from "./novo";
import Ordenar from "./ordenar";

export default async function PaginaDoCardapio() {
  const t = await dicionarioActual();
  const c = t.painel.cardapio;
  const e = t.painel.editor;
  const { confeiteira } = await exigirLoja();

  const produtos = temBaseDeDados()
    ? await cardapioParaEditar(executorNeon(), confeiteira.slug)
    : [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">{c.titulo}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
            {c.subtitulo}
          </p>
        </div>
        <NovoProduto />
      </div>

      <div className="mt-8 space-y-3">
        {produtos.map((produto, i) => {
          const desde = produto.tamanhos.length
            ? Math.min(...produto.tamanhos.map((t) => t.preco))
            : null;
          const esgotado =
            produto.limiteTotal !== null &&
            produto.limiteVendidos >= produto.limiteTotal;

          return (
            <article
              key={produto.chave}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-cartao p-4 ${
                produto.activo ? "border-borda" : "border-dashed border-borda"
              }`}
            >
              <FotoProduto
                foto={produto.foto}
                nome={produto.nome}
                cor={produto.cor}
                className="h-16 w-16 shrink-0 rounded-xl"
                sizes="64px"
              />

              <div className="min-w-0 grow">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-titulo">{produto.nome}</h2>
                  {desde !== null && (
                    <span className="text-xs text-suave">
                      {moeda(desde, confeiteira.moeda)}
                    </span>
                  )}
                  {!produto.activo && (
                    <span className="rounded-full border border-borda px-2.5 py-1 text-[11px] text-suave">
                      {e.rascunho}
                    </span>
                  )}
                  {esgotado && (
                    <span className="rounded-full bg-borda px-2.5 py-1 text-[11px] text-suave">
                      {e.esgotado}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-suave">
                  {produto.categoria}
                  {produto.categoria && produto.descricao && " · "}
                  {produto.descricao}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Ordenar
                  chave={produto.chave}
                  indice={i}
                  total={produtos.length}
                  rotulos={{ subir: e.subir, descer: e.descer }}
                />
                <Link
                  href={`/dashboard/cardapio/${produto.chave}`}
                  className="rounded-full border border-borda px-4 py-2 text-xs transition hover:border-marca"
                >
                  {e.editar}
                </Link>
              </div>
            </article>
          );
        })}

        {produtos.length === 0 && (
          <p className="rounded-3xl border border-borda bg-cartao p-10 text-center text-sm leading-relaxed text-suave">
            {e.semProdutos}
          </p>
        )}
      </div>
    </div>
  );
}
