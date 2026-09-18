"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { moeda } from "@/lib/precos";
import type {
  Assinatura,
  EstadoAssinatura,
  Moeda,
  Plano,
} from "@/lib/tipos";
import { resgatarCodigo, type ResultadoResgate } from "./accoes";

const estados: Record<EstadoAssinatura, string> = {
  teste: "em experimentação",
  activa: "activa",
  vitalicia: "vitalícia",
  pagamento_falhou: "pagamento falhou",
  cancelada: "cancelada",
};

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
      <h1 className="text-2xl">Plano e faturação</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        O que pagas pela plataforma. Não se confunde com o que recebes das
        tuas clientes — esse dinheiro nunca passa por aqui.
      </p>

      <section className="mt-8 rounded-3xl border border-marca bg-cartao p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-titulo text-xl">Plano {plano.nome}</h2>
              <span className="rounded-full bg-marca-suave px-3 py-1 text-[11px] text-marca">
                {estados[assinatura.estado]}
              </span>
            </div>
            <p className="mt-2 text-sm text-suave">{plano.promessa}</p>
          </div>
          <p className="text-right">
            <span className="font-titulo text-3xl">
              {vitalicia ? "Sem custo" : moeda(valor, codigoMoeda)}
            </span>
            <span className="block text-xs text-suave">
              {vitalicia
                ? "para sempre"
                : `por ${assinatura.periodo === "mensal" ? "mês" : "ano"}, sem IVA`}
            </span>
          </p>
        </div>

        {vitalicia ? (
          <div className="mt-8 flex gap-3 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
            <Icone nome="confirmado" className="mt-0.5 h-5 w-5 shrink-0 text-marca" />
            <span>
              Tens o plano {plano.nome} <strong>para sempre</strong>, pelo
              código <span className="font-mono">{assinatura.codigo}</span>.
              Não há renovação, não há cartão e nunca te vai ser cobrado nada.
            </span>
          </div>
        ) : (
          <>
            <dl className="mt-8 grid gap-6 border-t border-borda pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-suave">Próxima cobrança</dt>
                <dd className="mt-1">{assinatura.renovaEm}</dd>
              </div>
              <div>
                <dt className="text-xs text-suave">Cartão</dt>
                <dd className="mt-1">
                  {assinatura.cartao ? `•••• ${assinatura.cartao}` : "nenhum"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-suave">Cobrança</dt>
                <dd className="mt-1 capitalize">{assinatura.periodo}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-marca px-5 py-2.5 text-sm text-white"
              >
                Gerir no Stripe
              </button>
              <Link
                href="/precos"
                className="rounded-full border border-borda px-5 py-2.5 text-sm"
              >
                Ver os planos
              </Link>
            </div>
          </>
        )}
      </section>

      {!vitalicia && (
        <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">Tenho um código</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-suave">
            Se recebeste um código de acesso vitalício, escreve-o aqui. Ficas
            com o plano para sempre, sem pagar nada e sem cartão.
          </p>

          <form action={accao} className="mt-6 flex flex-wrap gap-3">
            <input
              name="codigo"
              placeholder="O teu código"
              autoComplete="off"
              className="w-full rounded-full border border-borda px-5 py-3 font-mono text-sm tracking-wider uppercase outline-none focus:border-marca sm:w-72"
            />
            <button
              type="submit"
              disabled={aPedir}
              className="rounded-full bg-marca px-6 py-3 text-sm text-white disabled:opacity-50"
            >
              {aPedir ? "A verificar…" : "Resgatar"}
            </button>
          </form>

          {resultado.estado === "erro" && (
            <p className="mt-4 text-sm text-marca">{resultado.mensagem}</p>
          )}
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">O que estás a usar</h2>
        <ul className="mt-6 space-y-5 text-sm">
          {consumo.map((linha) => (
            <li key={linha.rotulo} className="flex justify-between gap-4">
              <span>{linha.rotulo}</span>
              <span className="text-suave">
                {linha.usado}{" "}
                <span className="text-xs">· sem limite neste plano</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {!vitalicia && (
        <>
          <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
            <h2 className="font-titulo text-lg">Faturas</h2>
            {assinatura.faturas.length === 0 ? (
              <p className="mt-4 text-sm text-suave">
                Ainda não há faturas — o plano Prova não cobra nada.
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
                        {fatura.paga ? "paga" : "por pagar"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
            <h2 className="font-titulo text-lg">Mudar de plano</h2>
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
                        ? "grátis"
                        : `${moeda(outro.mensal[codigoMoeda], codigoMoeda)}/mês`}
                    </p>
                    <p className="mt-4 text-xs text-suave">
                      {actual ? "é o teu plano" : "trocar para este"}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-suave">
              Ao subir de plano pagas só a diferença do que falta do período.
              Ao descer ou cancelar, a tua página fica no ar até ao fim do
              período já pago.
            </p>
          </section>
        </>
      )}

      <p className="mt-6 rounded-2xl border border-borda bg-marca-suave p-5 text-sm leading-relaxed">
        <strong>Nada aqui cobra de verdade.</strong> É protótipo: os botões não
        falam com o Stripe e as faturas são de exemplo. O resgate de código já
        valida no servidor, mas ainda não grava nada.
      </p>
    </div>
  );
}
