"use client";

import { useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { useLingua, useT } from "@/app/lingua";
import { moeda } from "@/lib/precos";
import type { LinhaComparacao, Moeda, Plano } from "@/lib/tipos";

/** Um valor da tabela: incluído, ausente, ou um limite escrito. */
function Valor({
  valor,
  sim,
  nao,
}: {
  valor: boolean | string;
  sim: string;
  nao: string;
}) {
  if (valor === true)
    return (
      <>
        <Icone nome="confirmado" className="mx-auto h-[18px] w-[18px] text-marca" />
        <span className="sr-only">{sim}</span>
      </>
    );
  if (valor === false)
    return (
      <>
        <span aria-hidden="true" className="text-suave">
          —
        </span>
        <span className="sr-only">{nao}</span>
      </>
    );
  return <span className="text-sm">{valor}</span>;
}

export default function TabelaPrecos({
  planos,
  comparacao,
  moedaInicial,
}: {
  planos: Plano[];
  comparacao: LinhaComparacao[];
  moedaInicial: Moeda;
}) {
  const t = useT();
  const lingua = useLingua();
  // O nome da moeda vem do navegador na língua em curso — "euro", "Swiss
  // franc", "real brasileiro" — em vez de três rótulos por dicionário.
  // Os valores escritos ("ate5", "completo") são chaves, não texto.
  const traduzValor = (valor: boolean | string) =>
    typeof valor === "string"
      ? (t.comparacao.valores[
          valor as keyof typeof t.comparacao.valores
        ] ?? valor)
      : valor;
  const nomeMoeda = (codigo: Moeda) =>
    new Intl.DisplayNames([lingua], { type: "currency" }).of(codigo) ?? codigo;
  const [periodo, setPeriodo] = useState<"mensal" | "anual">("mensal");
  const [codigo, setCodigo] = useState<Moeda>(moedaInicial);

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
              {opcao === "mensal" ? t.precos.mensal : t.precos.anual}
            </button>
          ))}
        </div>

        <div className="flex rounded-full border border-borda bg-cartao p-1">
          {(
            [
              ["EUR", "€"],
              ["CHF", "CHF"],
              ["BRL", "R$"],
            ] as const
          ).map(([opcao, simbolo]) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setCodigo(opcao)}
              aria-pressed={codigo === opcao}
              className={`rounded-full px-4 py-2 text-sm transition ${
                codigo === opcao ? "bg-marca text-white" : "text-suave"
              }`}
            >
              {simbolo} {nomeMoeda(opcao)}
            </button>
          ))}
        </div>

        {periodo === "anual" && (
          <span className="entra-texto rounded-full bg-marca-suave px-3.5 py-1.5 text-xs text-marca">
            {t.precos.doisMeses}
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
            <strong>{t.precos.brasilTitulo}</strong> {t.precos.brasilTexto}
          </p>
          <p className="mt-3 text-suave">
            {t.precos.brasilSaidaAntes}{" "}
            <strong className="text-texto">{t.precos.brasilSaidaForte}</strong>
            {t.precos.brasilSaidaDepois}
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {planos.map((plano) => {
          const valor = plano[periodo][codigo];
          const gratis = valor === 0;
          const texto = t.planos[plano.id];
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
                  {t.precos.maisEscolhido}
                </span>
              )}

              <h2 className="font-titulo text-xl">{plano.nome}</h2>
              <p className="mt-2 text-sm leading-relaxed text-suave">
                {texto.promessa}
              </p>

              <p className="mt-7 flex items-baseline gap-2">
                <span className="font-titulo text-4xl">
                  {gratis ? t.precos.gratis : moeda(valor, codigo)}
                </span>
                {!gratis && (
                  <span className="text-sm text-suave">
                    /{periodo === "mensal" ? t.precos.porMes : t.precos.porAno}
                  </span>
                )}
              </p>
              {!gratis && periodo === "anual" && (
                <p className="mt-1.5 text-xs text-suave">
                  {moeda(valor / 12, codigo)} {t.precos.porMesCobrado}
                </p>
              )}

              <ul className="mt-7 grow space-y-3 text-sm">
                {texto.inclui.map((linha) => (
                  <li key={linha} className="flex gap-2.5">
                    <Icone
                      nome="confirmado"
                      className="mt-0.5 h-4 w-4 shrink-0 text-marca"
                    />
                    <span className="leading-relaxed">{linha}</span>
                  </li>
                ))}
                {texto.naoInclui.map((linha) => (
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
                {gratis
                  ? t.precos.comecarSemPagar
                  : `${t.precos.escolher} ${plano.nome}`}
              </Link>
            </section>
          );
        })}
      </div>

      {/* --------------------------------------------------- comparação */}
      <section className="mt-20">
        <h2 className="font-titulo text-2xl">{t.precos.planoAPlano}</h2>
        <p className="mt-2 text-sm text-suave">
          {t.precos.planoAPlanoAjuda}
        </p>

        {/* Em ecrã estreito a tabela desliza na horizontal e a primeira
            coluna fica colada, para não se perder a linha que se está a ler. */}
        <div className="mt-8 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">
              {t.precos.tabelaLegenda}
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
                        ? t.precos.gratis.toLowerCase()
                        : `${moeda(plano[periodo][codigo], codigo)}/${
                            periodo === "mensal"
                              ? t.precos.porMes
                              : t.precos.porAno
                          }`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparacao.map((linha) => (
                <tr key={linha.id} className="border-t border-borda">
                  <th
                    scope="row"
                    className="sticky left-0 bg-fundo py-3.5 pr-4 text-left font-normal"
                  >
                    {t.comparacao.linhas[
                      linha.id as keyof typeof t.comparacao.linhas
                    ] ?? linha.id}
                  </th>
                  {planos.map((plano) => (
                    <td
                      key={plano.id}
                      className={`px-3 py-3.5 text-center ${
                        plano.destaque ? "bg-marca-suave/50" : ""
                      }`}
                    >
                      <Valor
                        valor={traduzValor(linha.valores[plano.id] ?? false)}
                        sim={t.precos.incluido}
                        nao={t.precos.naoIncluido}
                      />
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
