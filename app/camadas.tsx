"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icone, { type Nome } from "@/app/icones";

export type Camada = {
  id: string;
  icone: Nome;
  titulo: string;
  resumo: string;
  texto: string;
  href: string;
  accao: string;
  foto: string;
  cor: string;
};

/**
 * As áreas do produto empilhadas como as camadas de um bolo: barras coladas
 * umas às outras, cada uma com a sua cor, que abrem no lugar em vez de
 * deslizarem de lado. A que está aberta mostra a foto a sangrar pela direita.
 *
 * A altura anima com grid-template-rows de 0fr para 1fr — assim o conteúdo
 * decide a altura e não é preciso adivinhar um max-height.
 */
export default function Camadas({ camadas }: { camadas: Camada[] }) {
  const [aberta, setAberta] = useState(0);

  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-borda">
      {camadas.map((camada, i) => {
        const activa = i === aberta;
        return (
          <section
            key={camada.id}
            className="border-b border-borda last:border-b-0"
            style={{ background: activa ? camada.cor : "var(--cartao)" }}
          >
            <h3>
              <button
                type="button"
                onClick={() => setAberta(i)}
                aria-expanded={activa}
                aria-controls={`camada-${camada.id}`}
                className="flex w-full items-center gap-5 px-6 py-6 text-left transition-colors duration-500 sm:px-10"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors duration-500"
                  style={{
                    background: activa ? "var(--texto)" : camada.cor,
                    color: activa ? camada.cor : "var(--texto)",
                  }}
                >
                  <Icone nome={camada.icone} className="h-[21px] w-[21px]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-titulo text-lg font-semibold sm:text-xl">
                    {camada.titulo}
                  </span>
                  <span
                    className={`block truncate text-sm font-normal text-suave transition-opacity duration-300 ${
                      activa ? "opacity-0 sm:h-0" : "opacity-100"
                    }`}
                  >
                    {camada.resumo}
                  </span>
                </span>

                <span
                  className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border transition duration-500"
                  style={{
                    borderColor: activa ? "transparent" : "var(--borda)",
                    background: activa ? "var(--texto)" : "transparent",
                    color: activa ? camada.cor : "var(--suave)",
                    transform: activa ? "rotate(90deg)" : "none",
                  }}
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            </h3>

            <div
              id={`camada-${camada.id}`}
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: activa ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid items-end gap-8 pb-8 sm:grid-cols-[1fr_auto] sm:pb-0">
                  <div className="px-6 sm:px-10 sm:pb-10">
                    <p className="max-w-md leading-relaxed font-normal text-suave">
                      {camada.texto}
                    </p>
                    <Link
                      href={camada.href}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-texto px-6 py-3 text-xs tracking-[0.12em] text-fundo uppercase"
                    >
                      {camada.accao}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>

                  {/* A foto entra pela direita e encosta ao fundo da camada. */}
                  <div className="relative mr-6 h-40 w-[calc(100%-1.5rem)] justify-self-end overflow-hidden rounded-t-[4rem] sm:mr-0 sm:h-48 sm:w-72 sm:rounded-tl-[5rem] sm:rounded-tr-none">
                    <Image
                      src={camada.foto}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 18rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
