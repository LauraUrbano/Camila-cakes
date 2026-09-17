"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type Vitrine = {
  slug: string;
  nome: string;
  iniciais: string;
  cidade: string;
  tagline: string;
  moedaNome: string;
  tema: { marca: string; marcaSuave: string; fundo: string; texto: string };
  entrega: string;
  produtos: { nome: string; foto: string; preco: string }[];
};

/**
 * Em vez de dois cartões lado a lado, um quadro só que troca de dono.
 * Ao alternar, as cores, o nome, o endereço e a moeda mudam à vista — que é
 * exactamente o que a plataforma promete a cada pasteleira.
 */
export default function VitrineTema({ vitrines }: { vitrines: Vitrine[] }) {
  const [activa, setActiva] = useState(0);
  const v = vitrines[activa];

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {vitrines.map((vitrine, i) => {
          const ligada = i === activa;
          return (
            <button
              key={vitrine.slug}
              type="button"
              onClick={() => setActiva(i)}
              aria-pressed={ligada}
              className="flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition duration-500"
              style={{
                borderColor: ligada ? vitrine.tema.marca : "var(--borda)",
                background: ligada ? vitrine.tema.marcaSuave : "var(--cartao)",
                color: ligada ? vitrine.tema.marca : "var(--suave)",
              }}
            >
              <span
                className="grid h-7 w-7 place-items-center rounded-full font-titulo text-[11px] transition duration-500"
                style={{
                  background: ligada ? vitrine.tema.marca : "var(--borda)",
                  color: ligada ? "#fff" : "var(--suave)",
                }}
              >
                {vitrine.iniciais}
              </span>
              {vitrine.nome}
            </button>
          );
        })}
      </div>

      {/* A moldura leva a cor da marca: é a área grande que muda de tom e
          torna a troca de dono visível de longe. */}
      <div
        className="mt-8 rounded-[2.75rem] p-4 transition-colors duration-700 sm:p-7"
        style={{ background: v.tema.marcaSuave }}
      >
      <div
        className="overflow-hidden rounded-[2rem] border shadow-sm transition-colors duration-700"
        style={{ borderColor: v.tema.marcaSuave, background: v.tema.fundo }}
      >
        {/* barra de endereço */}
        <div
          className="flex items-center gap-3 border-b px-5 py-3.5 transition-colors duration-700"
          style={{ borderColor: v.tema.marcaSuave }}
        >
          <span className="flex gap-1.5">
            {[0, 1, 2].map((ponto) => (
              <span
                key={ponto}
                className="h-2 w-2 rounded-full transition-colors duration-700"
                style={{ background: v.tema.marcaSuave }}
              />
            ))}
          </span>
          <span
            key={`url-${v.slug}`}
            className="entra-texto font-mono text-xs"
            style={{ color: v.tema.marca }}
          >
            cakelyo.app/{v.slug}
          </span>
        </div>

        <div className="p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-full font-titulo text-xs transition-colors duration-700"
              style={{ background: v.tema.marcaSuave, color: v.tema.marca }}
            >
              {v.iniciais}
            </span>
            <span key={`nome-${v.slug}`} className="entra-texto">
              <span
                className="block font-titulo transition-colors duration-700"
                style={{ color: v.tema.texto }}
              >
                {v.nome}
              </span>
              <span className="block text-xs text-suave">
                {v.cidade} · preços em {v.moedaNome}
              </span>
            </span>
          </div>

          <p
            key={`tag-${v.slug}`}
            className="entra-texto mt-7 max-w-md font-titulo text-2xl transition-colors duration-700 sm:text-3xl"
            style={{ color: v.tema.texto, animationDelay: "60ms" }}
          >
            {v.tagline}
          </p>

          {/* Lista flexível em vez de três colunas: quem tem dois produtos
              preenche a linha em vez de deixar um vão. */}
          <div className="mt-8 flex flex-wrap gap-4">
            {v.produtos.map((produto, i) => (
              <div
                key={`${v.slug}-${produto.nome}`}
                className="entra-cartao min-w-[9rem] flex-1 overflow-hidden rounded-2xl bg-cartao"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <div className="relative h-28">
                  <Image
                    src={produto.foto}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 12rem, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p
                    className="text-sm"
                    style={{ color: v.tema.texto }}
                  >
                    {produto.nome}
                  </p>
                  <p
                    className="mt-1 text-xs transition-colors duration-700"
                    style={{ color: v.tema.marca }}
                  >
                    desde {produto.preco}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p key={`ent-${v.slug}`} className="entra-texto text-xs text-suave">
              {v.entrega}
            </p>
            <Link
              href={`/${v.slug}`}
              className="rounded-full px-5 py-2.5 text-sm text-white transition-colors duration-700"
              style={{ background: v.tema.marca }}
            >
              Abrir esta página →
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
