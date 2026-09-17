"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icone, { type Nome } from "@/app/icones";

const DURACAO = 7000;

export type Slide = {
  id: string;
  icone: Nome;
  titulo: string;
  texto: string;
  href: string;
  accao: string;
  fotos: { src: string; alt: string }[];
};

/**
 * Carrossel das áreas do produto. O painel da esquerda fica fixo e só o
 * conteúdo troca; à direita a tira de fotos entra escalonada e sangra para
 * fora da margem, para dar a entender que há mais por ver.
 */
export default function Carrossel({ slides }: { slides: Slide[] }) {
  const [activo, setActivo] = useState(0);
  const [parado, setParado] = useState(false);
  const regiao = useRef<HTMLDivElement>(null);

  const ir = useCallback(
    (passo: number) =>
      setActivo((atual) => (atual + passo + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (parado) return;
    const relogio = setTimeout(() => ir(1), DURACAO);
    return () => clearTimeout(relogio);
  }, [activo, parado, ir]);

  const slide = slides[activo];

  return (
    <div
      ref={regiao}
      onMouseEnter={() => setParado(true)}
      onMouseLeave={() => setParado(false)}
      onFocusCapture={() => setParado(true)}
      onBlurCapture={() => setParado(false)}
      onKeyDown={(evento) => {
        if (evento.key === "ArrowRight") ir(1);
        if (evento.key === "ArrowLeft") ir(-1);
      }}
      role="group"
      aria-roledescription="carrossel"
      aria-label="Áreas do Cake Form"
      className="grid gap-12 lg:grid-cols-[19rem_1fr] lg:gap-16"
    >
      {/* ------------------------------------------------ painel da esquerda */}
      <div className="lg:pt-4">
        <span
          key={`icone-${slide.id}`}
          className="entra-texto grid h-12 w-12 place-items-center rounded-2xl bg-texto text-fundo"
        >
          <Icone nome={slide.icone} className="h-[22px] w-[22px]" />
        </span>

        <h3
          key={`titulo-${slide.id}`}
          className="entra-texto mt-6 font-titulo text-2xl"
          style={{ animationDelay: "60ms" }}
        >
          {slide.titulo}
        </h3>

        <p
          key={`texto-${slide.id}`}
          className="entra-texto mt-3 max-w-xs leading-relaxed text-suave"
          style={{ animationDelay: "110ms" }}
        >
          {slide.texto}
        </p>

        <Link
          key={`accao-${slide.id}`}
          href={slide.href}
          className="entra-texto mt-7 inline-flex items-center gap-2 rounded-full bg-texto px-6 py-3 text-xs tracking-[0.12em] text-fundo uppercase"
          style={{ animationDelay: "160ms" }}
        >
          {slide.accao}
          <span aria-hidden="true">↗</span>
        </Link>

        <div className="mt-10 h-px w-full max-w-[13rem] bg-borda">
          <div
            key={`barra-${slide.id}-${parado}`}
            className={parado ? "h-px bg-texto" : "barra-tempo h-px bg-texto"}
            style={{
              animationDuration: `${DURACAO}ms`,
              width: `${100 / slides.length}%`,
              marginLeft: `${(activo * 100) / slides.length}%`,
              transform: parado ? "scaleX(1)" : undefined,
            }}
          />
        </div>

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label="Área anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-borda transition hover:border-texto"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => ir(1)}
            aria-label="Área seguinte"
            className="grid h-11 w-11 place-items-center rounded-full border border-borda transition hover:border-texto"
          >
            →
          </button>
          <span className="ml-2 text-xs text-suave tabular-nums">
            {String(activo + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* -------------------------------------------------- tira de imagens */}
      <div
        aria-live="polite"
        className="-mr-6 flex gap-5 overflow-x-auto pb-2 lg:-mr-[calc((100vw-72rem)/2+1.5rem)] lg:overflow-visible"
      >
        {slide.fotos.map((foto, i) => (
          <figure
            key={`${slide.id}-${foto.src}`}
            className="entra-cartao group relative h-[19rem] w-[14rem] shrink-0 overflow-hidden sm:h-[23rem] sm:w-[17rem]"
            style={{
              animationDelay: `${i * 90}ms`,
              // Recorte em folha. Fica no estilo porque o Tailwind não aceita
              // um raio de quatro valores como classe arbitrária.
              borderRadius:
                i % 2 === 0
                  ? "5rem 1.25rem 5rem 1.25rem"
                  : "1.25rem 5rem 1.25rem 5rem",
            }}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes="(min-width: 640px) 17rem, 14rem"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
