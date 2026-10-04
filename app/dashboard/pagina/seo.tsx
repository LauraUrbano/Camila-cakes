"use client";

import { useActionState, useState, useTransition } from "react";
import { useT } from "@/app/lingua";
import { guardarSeoDaPagina, removerImagem } from "./accoes";

export default function SeccaoSeo({
  slug,
  nome,
  cidade,
  inicial,
}: {
  slug: string;
  nome: string;
  cidade: string;
  inicial: { titulo: string; descricao: string; versaoDaImagem: number };
}) {
  const t = useT().painel.pagina.seo;
  const [estado, accao, aGuardar] = useActionState(guardarSeoDaPagina, {});
  const [aRemover, remover] = useTransition();

  const [titulo, setTitulo] = useState(inicial.titulo);
  const [descricao, setDescricao] = useState(inicial.descricao);
  const [previa, setPrevia] = useState<string | null>(null);

  const tituloVisto = titulo || `${nome} — bolos por encomenda em ${cidade}`;
  const descricaoVista = descricao || t.semDescricao;
  const imagemActual = inicial.versaoDaImagem
    ? `/${slug}/imagem-partilha?v=${inicial.versaoDaImagem}`
    : null;

  return (
    <section className="rounded-3xl border border-borda bg-cartao p-7">
      <h2 className="font-titulo text-lg">{t.titulo}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {t.ajuda}
      </p>

      <form action={accao} className="mt-6">
        <label className="block text-xs">
          <span className="flex justify-between text-suave">
            <span>{t.campoTitulo}</span>
            <span className={titulo.length > 60 ? "text-marca" : ""}>
              {titulo.length}/60
            </span>
          </span>
          <input
            name="titulo"
            value={titulo}
            maxLength={70}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder={`${nome} — bolos por encomenda em ${cidade}`}
            className="mt-1 w-full rounded-xl border border-borda bg-fundo px-3.5 py-2.5 text-sm outline-none focus:border-marca"
          />
          <span className="mt-1.5 block text-suave">{t.ajudaTitulo}</span>
        </label>

        <label className="mt-5 block text-xs">
          <span className="flex justify-between text-suave">
            <span>{t.campoDescricao}</span>
            <span className={descricao.length > 155 ? "text-marca" : ""}>
              {descricao.length}/155
            </span>
          </span>
          <textarea
            name="descricao"
            value={descricao}
            maxLength={200}
            rows={3}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder={t.exemploDescricao}
            className="mt-1 w-full rounded-xl border border-borda bg-fundo px-3.5 py-2.5 text-sm outline-none focus:border-marca"
          />
          <span className="mt-1.5 block text-suave">{t.ajudaDescricao}</span>
        </label>

        {/* O que se vê no Google, com a largura e as cores a sério. */}
        <div className="mt-6 rounded-2xl border border-borda bg-fundo p-5">
          <p className="text-[11px] tracking-wide text-suave uppercase">
            {t.previaBusca}
          </p>
          <p className="mt-3 text-xs text-suave">cakelyo.app/{slug}</p>
          <p className="mt-1 max-w-[36rem] truncate text-[17px] text-[#1a0dab]">
            {tituloVisto}
          </p>
          <p className="mt-0.5 max-w-[36rem] text-[13px] leading-snug text-suave">
            {descricaoVista.slice(0, 160)}
            {descricaoVista.length > 160 && "…"}
          </p>
        </div>

        <div className="mt-7 border-t border-borda pt-6">
          <p className="text-sm font-medium">{t.imagem}</p>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-suave">
            {t.ajudaImagem}
          </p>

          {(previa || imagemActual) && (
            <div className="mt-4 max-w-md overflow-hidden rounded-2xl border border-borda">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previa ?? imagemActual ?? ""}
                alt=""
                className="block aspect-[1200/630] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-full border border-borda px-5 py-2.5 text-sm transition hover:border-marca">
              {imagemActual ? t.trocarImagem : t.escolherImagem}
              <input
                name="imagem"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPrevia(f ? URL.createObjectURL(f) : null);
                }}
              />
            </label>
            {imagemActual && (
              <button
                type="button"
                disabled={aRemover}
                onClick={() => remover(() => removerImagem())}
                className="text-sm text-suave underline underline-offset-2 disabled:opacity-50"
              >
                {t.removerImagem}
              </button>
            )}
          </div>
        </div>

        {estado.erro && <p className="mt-5 text-sm text-marca">{estado.erro}</p>}
        {estado.ok && <p className="mt-5 text-sm text-marca">{estado.ok}</p>}

        <button
          type="submit"
          disabled={aGuardar}
          className="mt-6 rounded-full bg-marca px-6 py-3 text-sm text-white disabled:opacity-50"
        >
          {aGuardar ? t.aGuardar : t.guardar}
        </button>
      </form>
    </section>
  );
}
