"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { FaturaResumo } from "@/lib/bd/admin";
import { alternarFatura, novaFatura, removerFatura } from "@/app/admin/accoes";
import { moeda as formata } from "@/lib/precos";
import type { Moeda } from "@/lib/tipos";

export type ContaParaFatura = {
  slug: string;
  nome: string;
  moeda: Moeda;
  planoId: string;
  periodo: "mensal" | "anual";
  origem: string;
  valorDoPlano: number;
};

const filtros = [
  { id: "divida", rotulo: "Em dívida" },
  { id: "todas", rotulo: "Todas" },
  { id: "pagas", rotulo: "Pagas" },
] as const;

function quando(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function PainelFaturacao({
  lista,
  contas,
}: {
  lista: FaturaResumo[];
  contas: ContaParaFatura[];
}) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("divida");
  const [aGravar, gravar] = useTransition();
  const [estado, accao, aLancar] = useActionState(novaFatura, {});

  // Escolher a conta preenche a moeda e o valor do plano dela: é isso que se
  // cobra em quase todos os lançamentos, e escrevê-lo à mão é onde se erra.
  const [slug, setSlug] = useState(contas[0]?.slug ?? "");
  const conta = contas.find((c) => c.slug === slug);

  /**
   * Os totais são por moeda e nunca somados entre elas. 12,90 € e R$ 24,90
   * não dão 37,80 de nada; quem quiser um total converte-o e assume a data
   * da taxa de câmbio.
   */
  const totais = useMemo(() => {
    const mapa = new Map<Moeda, { divida: number; pago: number }>();
    for (const f of lista) {
      const linha = mapa.get(f.moeda) ?? { divida: 0, pago: 0 };
      if (f.paga) linha.pago += f.valor;
      else linha.divida += f.valor;
      mapa.set(f.moeda, linha);
    }
    return [...mapa.entries()];
  }, [lista]);

  const visiveis = lista.filter((f) =>
    filtro === "todas" ? true : filtro === "pagas" ? f.paga : !f.paga,
  );

  const vitalicias = contas.filter((c) => c.origem === "codigo").length;

  return (
    <div>
      <h1 className="text-2xl">Faturação</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        O que as confeitarias nos pagam pelo acesso — não o que as clientes
        lhes pagam pelos bolos. Esse dinheiro nunca passa por aqui.
      </p>

      {totais.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {totais.map(([codigo, linha]) => (
            <div
              key={codigo}
              className="rounded-3xl border border-borda bg-cartao p-6"
            >
              <p className="text-xs tracking-[0.14em] text-suave uppercase">
                {codigo}
              </p>
              <p className="mt-3 font-titulo text-2xl">
                {formata(linha.divida, codigo)}
              </p>
              <p className="text-xs text-suave">em dívida</p>
              <p className="mt-3 border-t border-borda pt-3 text-xs text-suave">
                {formata(linha.pago, codigo)} recebidos
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------- lançar à mão */}
      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">Lançar fatura</h2>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-suave">
          Enquanto o Stripe não estiver ligado, as faturas entram por aqui. A
          referência é numerada por conta e por ano, FT-2026-0001.
        </p>

        <form
          action={accao}
          className="mt-6 grid gap-4 sm:grid-cols-[1fr_8rem_7rem_9rem_auto]"
        >
          <label className="block text-xs">
            <span className="text-suave">Conta</span>
            <select
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
            >
              {contas.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nome} · {c.planoId}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs">
            <span className="text-suave">Valor</span>
            <input
              name="valor"
              key={`valor-${slug}`}
              defaultValue={conta?.valorDoPlano ? String(conta.valorDoPlano) : ""}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>

          <label className="block text-xs">
            <span className="text-suave">Moeda</span>
            <select
              name="moeda"
              key={`moeda-${slug}`}
              defaultValue={conta?.moeda ?? "EUR"}
              className="mt-1 w-full rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
            >
              <option value="EUR">EUR</option>
              <option value="CHF">CHF</option>
              <option value="BRL">BRL</option>
            </select>
          </label>

          <label className="block text-xs">
            <span className="text-suave">Emitida em</span>
            <input
              name="emitidaEm"
              type="date"
              defaultValue={hojeISO()}
              className="mt-1 w-full rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>

          <button
            type="submit"
            disabled={aLancar || contas.length === 0}
            className="self-end rounded-full bg-marca px-6 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {aLancar ? "A lançar…" : "Lançar"}
          </button>

          <label className="flex items-center gap-2 text-xs sm:col-span-5">
            <input type="checkbox" name="paga" className="h-4 w-4 accent-marca" />
            <span className="text-suave">Já está paga</span>
          </label>
        </form>

        {estado.erro && <p className="mt-4 text-sm text-marca">{estado.erro}</p>}
        {estado.ok && <p className="mt-4 text-sm text-marca">{estado.ok}</p>}
      </section>

      {/* ------------------------------------------------------- lista */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full border border-borda bg-cartao p-1 text-sm">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              aria-pressed={filtro === f.id}
              className={`rounded-full px-4 py-2 transition ${
                filtro === f.id ? "bg-marca text-white" : "text-suave"
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
        {vitalicias > 0 && (
          <p className="text-xs text-suave">
            {vitalicias}{" "}
            {vitalicias === 1 ? "conta vitalícia" : "contas vitalícias"} — sem
            faturação, por desenho.
          </p>
        )}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-suave">
              <th scope="col" className="pb-3 font-normal">Referência</th>
              <th scope="col" className="pb-3 font-normal">Conta</th>
              <th scope="col" className="pb-3 font-normal">Emitida</th>
              <th scope="col" className="pb-3 text-right font-normal">Valor</th>
              <th scope="col" className="pb-3 text-right font-normal">Estado</th>
              <th scope="col" className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {visiveis.map((f) => (
              <tr key={f.id} className="border-t border-borda">
                <td className="py-3.5 font-mono text-xs">{f.referencia}</td>
                <td className="py-3.5">
                  <Link
                    href={`/${f.slug}`}
                    className="underline underline-offset-2"
                  >
                    {f.confeiteira}
                  </Link>
                </td>
                <td className="py-3.5 text-suave">{quando(f.emitidaEm)}</td>
                <td className="py-3.5 text-right">
                  {formata(f.valor, f.moeda)}
                </td>
                <td className="py-3.5 text-right">
                  <button
                    type="button"
                    disabled={aGravar}
                    onClick={() => gravar(() => alternarFatura(f.id, !f.paga))}
                    className={`rounded-full border px-3.5 py-1.5 text-xs transition disabled:opacity-50 ${
                      f.paga
                        ? "border-marca bg-marca-suave text-marca"
                        : "border-borda text-suave hover:border-marca"
                    }`}
                  >
                    {f.paga ? "Paga" : "Marcar paga"}
                  </button>
                </td>
                <td className="py-3.5 pl-3 text-right">
                  <button
                    type="button"
                    disabled={aGravar}
                    onClick={() => gravar(() => removerFatura(f.id))}
                    className="text-xs text-suave underline underline-offset-2 disabled:opacity-50"
                    title="Apagar o lançamento"
                  >
                    apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visiveis.length === 0 && (
          <p className="rounded-3xl border border-borda bg-cartao p-8 text-center text-sm text-suave">
            {filtro === "divida"
              ? "Nada em dívida."
              : "Ainda não há faturas lançadas."}
          </p>
        )}
      </div>
    </div>
  );
}
