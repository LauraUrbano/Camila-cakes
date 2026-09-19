"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { useT } from "@/app/lingua";
import { moeda } from "@/lib/precos";
import type {
  Assinatura,
  EstadoAssinatura,
  Moeda,
  Plano,
} from "@/lib/tipos";
import { resgatarCodigo, type ResultadoResgate } from "./accoes";

export default function PainelPlano({
  planos,
  inicial,
  codigo: codigoMoeda,
  consumo,
}: {
  planos: Plano[];
  inicial: Assinatura;
  codigo: Moeda;
  consumo: { rotulo: string; usado: number }[];
}) {
  const t = useT();
  const pl = t.painel.plano;
  const estados: Record<EstadoAssinatura, string> = pl.estados;
  const [assinatura, setAssinatura] = useState(inicial);
  const [resultado, accao, aPedir] = useActionState<ResultadoResgate, FormData>(
    async (anterior, dados) => {
      const r = await resgatarCodigo(anterior, dados);
      if (r.estado === "ok") {
        // O acesso vitalício não passa pelo Stripe: não renova, não tem
        // cartão e não gera faturas.
        setAssinatura({
          planoId: r.planoId,
          estado: "vitalicia",
          origem: "codigo",
          periodo: "mensal",
          renovaEm: "—",
          codigo: r.codigo,
          faturas: [],
        });
      }
      return r;
    },
    { estado: "vazio" },
  );

  const plano = planos.find((item) => item.id === assinatura.planoId)!;
  const vitalicia = assinatura.estado === "vitalicia";
  const valor = plano[assinatura.periodo][codigoMoeda];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl">{pl.titulo}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {pl.subtitulo}
      </p>

      <section className="mt-8 rounded-3xl border border-marca bg-cartao p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-titulo text-xl">
                {pl.plano} {plano.nome}
              </h2>
              <span className="rounded-full bg-marca-suave px-3 py-1 text-[11px] text-marca">
                {estados[assinatura.estado]}
              </span>
            </div>
            <p className="mt-2 text-sm text-suave">{t.planos[plano.id].promessa}</p>
          </div>
          <p className="text-right">
            <span className="font-titulo text-3xl">
              {vitalicia ? pl.semCusto : moeda(valor, codigoMoeda)}
            </span>
            <span className="block text-xs text-suave">
              {vitalicia
                ? pl.paraSempre
                : `${pl.por} ${
                    assinatura.periodo === "mensal"
                      ? t.precos.porMes
                      : t.precos.porAno
                  }, ${pl.porSemIva}`}
            </span>
          </p>
        </div>

        {vitalicia ? (
          <div className="mt-8 flex gap-3 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
            <Icone nome="confirmado" className="mt-0.5 h-5 w-5 shrink-0 text-marca" />
            <span>
              {pl.vitaliciaAntes} {plano.nome}{" "}
              <strong>{pl.vitaliciaForte}</strong>, {pl.vitaliciaDepois}{" "}
              <span className="font-mono">{assinatura.codigo}</span>.{" "}
              {pl.vitaliciaNota}
            </span>
          </div>
        ) : (
          <>
            <dl className="mt-8 grid gap-6 border-t border-borda pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-suave">{pl.proximaCobranca}</dt>
                <dd className="mt-1">{assinatura.renovaEm}</dd>
              </div>
              <div>
                <dt className="text-xs text-suave">{pl.cartao}</dt>
                <dd className="mt-1">
                  {assinatura.cartao
                    ? `•••• ${assinatura.cartao}`
                    : pl.nenhum}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-suave">{pl.cobranca}</dt>
                <dd className="mt-1">
                  {assinatura.periodo === "mensal"
                    ? t.precos.mensal
                    : t.precos.anual}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-marca px-5 py-2.5 text-sm text-white"
              >
                {pl.gerirStripe}
              </button>
              <Link
                href="/precos"
                className="rounded-full border border-borda px-5 py-2.5 text-sm"
              >
                {pl.verPlanos}
              </Link>
            </div>
          </>
        )}
      </section>

      {!vitalicia && (
        <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">{pl.temCodigo}</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-suave">
            {pl.temCodigoTexto}
          </p>

          <form action={accao} className="mt-6 flex flex-wrap gap-3">
            <input
              name="codigo"
              placeholder={pl.codigoCampo}
              autoComplete="off"
              className="w-full rounded-full border border-borda px-5 py-3 font-mono text-sm tracking-wider uppercase outline-none focus:border-marca sm:w-72"
            />
            <button
              type="submit"
              disabled={aPedir}
              className="rounded-full bg-marca px-6 py-3 text-sm text-white disabled:opacity-50"
            >
              {aPedir ? pl.aVerificar : pl.resgatar}
            </button>
          </form>

          {resultado.estado === "erro" && (
            <p className="mt-4 text-sm text-marca">{pl.erros[resultado.erro]}</p>
          )}
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">{pl.estasAUsar}</h2>
        <ul className="mt-6 space-y-5 text-sm">
          {consumo.map((linha) => (
            <li key={linha.rotulo} className="flex justify-between gap-4">
              <span>{linha.rotulo}</span>
              <span className="text-suave">
                {linha.usado}{" "}
                <span className="text-xs">{pl.semLimite}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {!vitalicia && (
        <>
          <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
            <h2 className="font-titulo text-lg">{pl.faturas}</h2>
            {assinatura.faturas.length === 0 ? (
              <p className="mt-4 text-sm text-suave">
                {pl.semFaturas}
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-borda text-sm">
                {assinatura.faturas.map((fatura) => (
                  <li
                    key={fatura.id}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <span>
                      <span className="block">{fatura.id}</span>
                      <span className="block text-xs text-suave">
                        {fatura.data}
                      </span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="tabular-nums">
                        {moeda(fatura.valor, codigoMoeda)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-suave">
                        <Icone nome="confirmado" className="h-4 w-4" />
                        {fatura.paga ? pl.paga : pl.porPagar}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
            <h2 className="font-titulo text-lg">{pl.mudarPlano}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {planos.map((outro) => {
                const actual = outro.id === plano.id;
                return (
                  <div
                    key={outro.id}
                    className={`rounded-2xl border p-5 ${
                      actual ? "border-marca bg-marca-suave" : "border-borda"
                    }`}
                  >
                    <p className="font-titulo">{outro.nome}</p>
                    <p className="mt-1 text-sm text-suave">
                      {outro.mensal[codigoMoeda] === 0
                        ? t.precos.gratis.toLowerCase()
                        : `${moeda(outro.mensal[codigoMoeda], codigoMoeda)}/mês`}
                    </p>
                    <p className="mt-4 text-xs text-suave">
                      {actual ? pl.eOTeuPlano : pl.trocarPara}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-suave">
              {pl.mudarNota}
            </p>
          </section>
        </>
      )}

      <p className="mt-6 rounded-2xl border border-borda bg-marca-suave p-5 text-sm leading-relaxed">
        <strong>{pl.prototipoForte}</strong> {pl.prototipoTexto}
      </p>
    </div>
  );
}
