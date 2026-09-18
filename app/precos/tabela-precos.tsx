"use client";

import { useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { moeda } from "@/lib/precos";
import type { LinhaComparacao, Moeda, Plano } from "@/lib/tipos";

/** Um valor da tabela: incluído, ausente, ou um limite escrito. */
function Valor({ valor }: { valor: boolean | string }) {
  if (valor === true)
    return (
      <>
        <Icone nome="confirmado" className="mx-auto h-[18px] w-[18px] text-marca" />
        <span className="sr-only">incluído</span>
      </>
    );
  if (valor === false)
    return (
      <>
        <span aria-hidden="true" className="text-suave">
          —
        </span>
        <span className="sr-only">não incluído</span>
      </>
    );
  return <span className="text-sm">{valor}</span>;
}

export default function TabelaPrecos({
  planos,
  comparacao,
}: {
  planos: Plano[];
  comparacao: LinhaComparacao[];
}) {
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
          {(
            [
              ["EUR", "€ Portugal"],
              ["CHF", "CHF Suíça"],
              ["BRL", "R$ Brasil"],
            ] as const
          ).map(([opcao, rotulo]) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setCodigo(opcao)}
              aria-pressed={codigo === opcao}
              className={`rounded-full px-4 py-2 text-sm transition ${
                codigo === opcao ? "bg-marca text-white" : "text-suave"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>

        {periodo === "anual" && (
          <span className="entra-texto rounded-full bg-marca-suave px-3.5 py-1.5 text-xs text-marca">
            dois meses oferecidos
          </span>
        )}
      </div>

      {/* O Cakelyo fatura de Portugal. Para quem paga do Brasil com cartão
          isso é uma compra internacional, com IOF e spread por cima — e o
          valor que sai do cartão não é o que está escrito aqui. Dizê-lo à
          partida evita a surpresa na fatura. O Pix é local e não tem esse
          custo, mas só serve para pagamento de uma vez. */}
      {codigo === "BRL" && (
        <div className="entra-texto mt-6 rounded-2xl border border-borda bg-cartao p-5 text-sm leading-relaxed">
          <p>
            <strong>Se pagas do Brasil:</strong> o Cakelyo fatura de Portugal,
            por isso o cartão trata isto como compra internacional — o teu
            banco soma IOF e spread cambial, à volta de 7% a mais do que o
            valor acima.
          </p>
          <p className="mt-3 text-suave">
            Para não pagares isso,{" "}
            <strong className="text-texto">
              escolhe o plano anual e paga por Pix
            </strong>
            : é um pagamento local em reais, sem IOF e sem câmbio. Sai uma vez
            por ano e fica exactamente o valor da tabela.
          </p>
        </div>
      )}

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

      {/* --------------------------------------------------- comparação */}
      <section className="mt-20">
        <h2 className="font-titulo text-2xl">Plano a plano</h2>
        <p className="mt-2 text-sm text-suave">
          O que muda de um para o outro, sem letra pequena.
        </p>

        {/* Em ecrã estreito a tabela desliza na horizontal e a primeira
            coluna fica colada, para não se perder a linha que se está a ler. */}
        <div className="mt-8 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">
              Comparação dos planos Prova, Atelier e Pastelaria
            </caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 bg-fundo" />
                {planos.map((plano) => (
                  <th
                    key={plano.id}
                    scope="col"
                    className="px-3 pb-4 text-center align-bottom"
                  >
                    <span className="block font-titulo text-base font-semibold">
                      {plano.nome}
                    </span>
                    <span className="mt-1 block text-xs font-normal text-suave">
                      {plano[periodo][codigo] === 0
                        ? "grátis"
                        : `${moeda(plano[periodo][codigo], codigo)}/${
                            periodo === "mensal" ? "mês" : "ano"
                          }`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparacao.map((linha) => (
                <tr key={linha.rotulo} className="border-t border-borda">
                  <th
                    scope="row"
                    className="sticky left-0 bg-fundo py-3.5 pr-4 text-left font-normal"
                  >
                    {linha.rotulo}
                  </th>
                  {planos.map((plano) => (
                    <td
                      key={plano.id}
                      className={`px-3 py-3.5 text-center ${
                        plano.destaque ? "bg-marca-suave/50" : ""
                      }`}
                    >
                      <Valor valor={linha.valores[plano.id] ?? false} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
