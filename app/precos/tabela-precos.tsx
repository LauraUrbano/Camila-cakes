"use client";

import { useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { moeda } from "@/lib/precos";
import type { Moeda, Plano } from "@/lib/tipos";

export default function TabelaPrecos({ planos }: { planos: Plano[] }) {
  const [periodo, setPeriodo] = useState<"mensal" | "anual">("mensal");
  const [codigo, setCodigo] = useState<Moeda>("EUR");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-borda bg-cartao p-1">
          {(["mensal", "anual"] as const).map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setPeriodo(opcao)}
              aria-pressed={periodo === opcao}
              className={`rounded-full px-4 py-2 text-sm transition ${
                periodo === opcao ? "bg-marca text-white" : "text-suave"
              }`}
            >
              {opcao === "mensal" ? "Mensal" : "Anual"}
            </button>
          ))}
        </div>

        <div className="flex rounded-full border border-borda bg-cartao p-1">
          {(["EUR", "CHF"] as const).map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setCodigo(opcao)}
              aria-pressed={codigo === opcao}
              className={`rounded-full px-4 py-2 text-sm transition ${
                codigo === opcao ? "bg-marca text-white" : "text-suave"
              }`}
            >
              {opcao === "EUR" ? "€ Portugal" : "CHF Suíça"}
            </button>
          ))}
        </div>

        {periodo === "anual" && (
          <span className="entra-texto rounded-full bg-marca-suave px-3.5 py-1.5 text-xs text-marca">
            dois meses oferecidos
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {planos.map((plano) => {
          const valor = plano[periodo][codigo];
          const gratis = valor === 0;
          return (
            <section
              key={plano.id}
              className={`flex flex-col rounded-3xl border p-8 ${
                plano.destaque
                  ? "border-marca bg-cartao"
                  : "border-borda bg-cartao"
              }`}
            >
              {plano.destaque && (
                <span className="mb-4 self-start rounded-full bg-marca-suave px-3 py-1 text-[11px] text-marca">
                  o mais escolhido
                </span>
              )}

              <h2 className="font-titulo text-xl">{plano.nome}</h2>
              <p className="mt-2 text-sm leading-relaxed text-suave">
                {plano.promessa}
              </p>

              <p className="mt-7 flex items-baseline gap-2">
                <span className="font-titulo text-4xl">
                  {gratis ? "Grátis" : moeda(valor, codigo)}
                </span>
                {!gratis && (
                  <span className="text-sm text-suave">
                    /{periodo === "mensal" ? "mês" : "ano"}
                  </span>
                )}
              </p>
              {!gratis && periodo === "anual" && (
                <p className="mt-1.5 text-xs text-suave">
                  {moeda(valor / 12, codigo)} por mês, cobrados de uma vez
                </p>
              )}

              <ul className="mt-7 grow space-y-3 text-sm">
                {plano.inclui.map((linha) => (
                  <li key={linha} className="flex gap-2.5">
                    <Icone
                      nome="confirmado"
                      className="mt-0.5 h-4 w-4 shrink-0 text-marca"
                    />
                    <span className="leading-relaxed">{linha}</span>
                  </li>
                ))}
                {plano.naoInclui?.map((linha) => (
                  <li key={linha} className="flex gap-2.5 text-suave">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center">
                      —
                    </span>
                    <span className="leading-relaxed">{linha}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/plano"
                className={`mt-8 rounded-full px-6 py-3 text-center text-sm ${
                  plano.destaque
                    ? "bg-marca text-white"
                    : "border border-borda"
                }`}
              >
                {gratis ? "Começar sem pagar" : `Escolher ${plano.nome}`}
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
