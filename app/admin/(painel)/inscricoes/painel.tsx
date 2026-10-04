"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { EstadoInscricao, Inscricao } from "@/lib/bd/inscricoes";
import { mudarInscricao } from "@/app/admin/accoes";

const estados: { id: EstadoInscricao; rotulo: string }[] = [
  { id: "nova", rotulo: "Novos" },
  { id: "contactada", rotulo: "Contactados" },
  { id: "aberta", rotulo: "Abertos" },
  { id: "recusada", rotulo: "Recusados" },
];

const nomeDoPais: Record<string, string> = {
  PT: "Portugal",
  CH: "Suíça",
  BR: "Brasil",
};

function quando(iso: string) {
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PainelInscricoes({ lista }: { lista: Inscricao[] }) {
  const [filtro, setFiltro] = useState<EstadoInscricao | "todos">("nova");
  const [aGravar, gravar] = useTransition();

  const visiveis = lista.filter((i) => filtro === "todos" || i.estado === filtro);
  const porEstado = (estado: EstadoInscricao) =>
    lista.filter((i) => i.estado === estado).length;

  return (
    <div>
      <h1 className="text-2xl">Pedidos de acesso</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        Quem pediu conta pela página de planos. Abrir a conta a partir daqui
        leva os dados já preenchidos e fecha o pedido.
      </p>

      <div className="mt-8 flex flex-wrap rounded-full border border-borda bg-cartao p-1 text-sm">
        {[...estados, { id: "todos" as const, rotulo: "Todos" }].map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setFiltro(e.id)}
            aria-pressed={filtro === e.id}
            className={`rounded-full px-4 py-2 transition ${
              filtro === e.id ? "bg-marca text-white" : "text-suave"
            }`}
          >
            {e.rotulo}
            {e.id !== "todos" && porEstado(e.id) > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                {porEstado(e.id)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {visiveis.map((i) => (
          <article key={i.id} className="rounded-3xl border border-borda bg-cartao p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-titulo text-lg">{i.nome}</h2>
                  <span className="rounded-full bg-marca-suave px-2.5 py-1 text-[11px] text-marca">
                    {i.planoId} · {i.periodo}
                  </span>
                  {i.contaAberta && (
                    <Link
                      href={`/${i.contaAberta}`}
                      className="rounded-full border border-borda px-2.5 py-1 font-mono text-[11px] text-suave"
                    >
                      /{i.contaAberta}
                    </Link>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-suave">
                  <a
                    href={`mailto:${i.email}`}
                    className="underline underline-offset-2"
                  >
                    {i.email}
                  </a>
                  {i.telefone && <> · {i.telefone}</>} · {i.cidade} (
                  {nomeDoPais[i.pais] ?? i.pais}) · {i.moeda}
                </p>
                {i.slugDesejado && (
                  <p className="mt-1 font-mono text-xs text-suave">
                    quer /{i.slugDesejado}
                  </p>
                )}
              </div>
              <p className="text-xs text-suave">{quando(i.criadaEm)}</p>
            </div>

            {i.mensagem && (
              <p className="mt-4 rounded-2xl bg-marca-suave/60 p-4 text-sm leading-relaxed">
                {i.mensagem}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-borda pt-5">
              {i.estado !== "aberta" && (
                <Link
                  href={{
                    pathname: "/admin/contas/nova",
                    query: {
                      nome: i.nome,
                      slug: i.slugDesejado,
                      cidade: i.cidade,
                      pais: i.pais,
                      moeda: i.moeda,
                      plano: i.planoId,
                      email: i.email,
                    },
                  }}
                  className="rounded-full bg-marca px-5 py-2 text-xs text-white"
                >
                  Abrir a conta
                </Link>
              )}

              {estados
                .filter((e) => e.id !== i.estado && e.id !== "aberta")
                .map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    disabled={aGravar}
                    onClick={() => gravar(() => mudarInscricao(i.id, e.id))}
                    className="rounded-full border border-borda px-4 py-2 text-xs text-suave transition hover:border-marca disabled:opacity-50"
                  >
                    {e.id === "nova"
                      ? "Pôr por tratar"
                      : e.id === "contactada"
                        ? "Já contactei"
                        : "Recusar"}
                  </button>
                ))}
            </div>
          </article>
        ))}

        {visiveis.length === 0 && (
          <p className="rounded-3xl border border-borda bg-cartao p-8 text-center text-sm text-suave">
            Nada aqui.
          </p>
        )}
      </div>
    </div>
  );
}
