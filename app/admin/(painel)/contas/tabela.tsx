"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ContaResumo } from "@/lib/bd/admin";
import { alternarSuspensao, trocarPlano } from "@/app/admin/accoes";

const planos = ["prova", "atelier", "pastelaria"] as const;
const nomeDoPlano: Record<string, string> = {
  prova: "Prova",
  atelier: "Atelier",
  pastelaria: "Pastelaria",
};

function quando(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function TabelaContas({ lista }: { lista: ContaResumo[] }) {
  const [busca, setBusca] = useState("");
  const [aGravar, gravar] = useTransition();

  const filtradas = lista.filter((c) =>
    `${c.nome} ${c.slug} ${c.cidade}`.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Contas</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
            Suspender tira a página do ar sem apagar nada — a conta volta ao
            que era quando quiseres.
          </p>
        </div>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Procurar"
          className="rounded-full border border-borda bg-cartao px-4 py-2 text-sm outline-none focus:border-marca"
        />
      </div>

      <div className="mt-8 space-y-4">
        {filtradas.map((c) => (
          <article
            key={c.id}
            className={`rounded-3xl border bg-cartao p-6 ${
              c.suspensa ? "border-borda opacity-70" : "border-borda"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-titulo text-lg">{c.nome}</h2>
                  <span className="rounded-full bg-marca-suave px-2.5 py-1 text-[11px] text-marca">
                    {nomeDoPlano[c.planoId] ?? c.planoId}
                  </span>
                  {c.origem === "codigo" && (
                    <span className="rounded-full border border-borda px-2.5 py-1 text-[11px] text-suave">
                      vitalício · {c.codigo}
                    </span>
                  )}
                  {c.suspensa && (
                    <span className="rounded-full bg-texto px-2.5 py-1 text-[11px] text-fundo">
                      suspensa
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-suave">
                  <Link
                    href={`/${c.slug}`}
                    className="font-mono underline underline-offset-2"
                  >
                    /{c.slug}
                  </Link>{" "}
                  · {c.cidade} ({c.pais}) · {c.moeda} · desde{" "}
                  {quando(c.criadaEm)}
                </p>
              </div>

              <dl className="flex gap-6 text-right text-xs">
                <div>
                  <dt className="text-suave">Produtos</dt>
                  <dd className="mt-0.5 text-base">{c.produtos}</dd>
                </div>
                <div>
                  <dt className="text-suave">Encomendas</dt>
                  <dd className="mt-0.5 text-base">{c.pedidos}</dd>
                </div>
                <div>
                  <dt className="text-suave">Este mês</dt>
                  <dd className="mt-0.5 text-base">{c.pedidosMes}</dd>
                </div>
                <div>
                  <dt className="text-suave">Última</dt>
                  <dd className="mt-0.5 text-base">{quando(c.ultimoPedido)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-borda pt-5">
              <span className="text-xs text-suave">Plano:</span>
              {planos.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={aGravar || p === c.planoId}
                  onClick={() => gravar(() => trocarPlano(c.slug, p))}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    p === c.planoId
                      ? "border-marca bg-marca-suave text-marca"
                      : "border-borda text-suave hover:border-marca"
                  } disabled:cursor-default`}
                >
                  {nomeDoPlano[p]}
                </button>
              ))}

              <button
                type="button"
                disabled={aGravar}
                onClick={() =>
                  gravar(() => alternarSuspensao(c.slug, !c.suspensa))
                }
                className="ml-auto rounded-full border border-borda px-4 py-1.5 text-xs disabled:opacity-50"
              >
                {c.suspensa ? "Reactivar" : "Suspender"}
              </button>
            </div>
          </article>
        ))}

        {filtradas.length === 0 && (
          <p className="rounded-3xl border border-borda bg-cartao p-8 text-center text-sm text-suave">
            Nenhuma conta com esse nome.
          </p>
        )}
      </div>
    </div>
  );
}
