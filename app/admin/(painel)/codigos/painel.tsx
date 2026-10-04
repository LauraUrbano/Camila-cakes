"use client";

import { useActionState } from "react";
import type { CodigoResumo } from "@/lib/bd/admin";
import { novoCodigo } from "@/app/admin/accoes";

export default function PainelCodigos({ lista }: { lista: CodigoResumo[] }) {
  const [estado, accao, aCriar] = useActionState(novoCodigo, {});

  return (
    <div>
      <h1 className="text-2xl">Códigos de acesso vitalício</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        Dão o plano para sempre, sem passar pelo Stripe. Servem para
        fundadoras, parcerias e para oferecer acesso a quem quiseres.
      </p>

      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">Criar código</h2>
        <form action={accao} className="mt-6 grid gap-4 sm:grid-cols-[1fr_10rem_8rem_auto]">
          <label className="block text-xs">
            <span className="text-suave">Código</span>
            <input
              name="codigo"
              placeholder="FUNDADORAS2027"
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 font-mono text-sm uppercase outline-none focus:border-marca"
            />
          </label>
          <label className="block text-xs">
            <span className="text-suave">Plano</span>
            <select
              name="planoId"
              defaultValue="pastelaria"
              className="mt-1 w-full rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
            >
              <option value="prova">Prova</option>
              <option value="atelier">Atelier</option>
              <option value="pastelaria">Pastelaria</option>
            </select>
          </label>
          <label className="block text-xs">
            <span className="text-suave">Utilizações</span>
            <input
              name="maxUsos"
              type="number"
              min={1}
              defaultValue={1}
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>
          <button
            type="submit"
            disabled={aCriar}
            className="self-end rounded-full bg-marca px-6 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {aCriar ? "A criar…" : "Criar"}
          </button>
          <label className="block text-xs sm:col-span-4">
            <span className="text-suave">Nota (para te lembrares porquê)</span>
            <input
              name="nota"
              placeholder="As primeiras cinquenta pasteleiras a entrar."
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>
        </form>
        {estado.erro && <p className="mt-4 text-sm text-marca">{estado.erro}</p>}
        {estado.ok && <p className="mt-4 text-sm text-marca">{estado.ok}</p>}
      </section>

      <div className="mt-6 space-y-4">
        {lista.map((c) => {
          const esgotado = c.usos >= c.maxUsos;
          return (
            <article
              key={c.codigo}
              className="rounded-3xl border border-borda bg-cartao p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-lg">{c.codigo}</p>
                  <p className="mt-1 text-xs text-suave">{c.nota}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {c.usos} de {c.maxUsos}
                  </p>
                  <p className="text-xs text-suave">
                    {esgotado ? "esgotado" : "ainda dá"} · plano {c.planoId}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-borda">
                <div
                  className="h-full rounded-full bg-marca"
                  style={{ width: `${Math.min(100, (c.usos / c.maxUsos) * 100)}%` }}
                />
              </div>

              {c.resgatadoPor.length > 0 && (
                <p className="mt-4 text-xs text-suave">
                  Usado por: {c.resgatadoPor.join(", ")}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
