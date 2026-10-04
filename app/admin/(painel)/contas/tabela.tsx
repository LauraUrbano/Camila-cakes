"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import type { ContaResumo } from "@/lib/bd/admin";
import { alternarSuspensao, darAcesso, trocarPlano } from "@/app/admin/accoes";
import type { AcessoDaConta } from "@/lib/bd/acesso";

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

/** O painel de entrada de uma conta: quem entra, e desde quando. */
function Acesso({ conta, acesso }: { conta: ContaResumo; acesso?: AcessoDaConta }) {
  const [aberto, setAberto] = useState(false);
  const [estado, accao, aGuardar] = useActionState(darAcesso, {});

  return (
    <div className="mt-5 border-t border-borda pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-suave">
          {acesso?.temSenha ? (
            <>
              Entra como{" "}
              <span className="text-texto">{acesso.email ?? "—"}</span>
              {acesso.entrouEm
                ? ` · última entrada ${quando(acesso.entrouEm)}`
                : " · ainda não entrou"}
            </>
          ) : (
            "Ainda não tem entrada própria."
          )}
        </p>
        <button
          type="button"
          onClick={() => setAberto((x) => !x)}
          className="rounded-full border border-borda px-4 py-1.5 text-xs text-suave transition hover:border-marca"
        >
          {acesso?.temSenha ? "Trocar senha" : "Dar entrada"}
        </button>
      </div>

      {aberto && (
        <form action={accao} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input type="hidden" name="slug" value={conta.slug} />
          <label className="block text-xs">
            <span className="text-suave">Email dela</span>
            <input
              name="email"
              type="email"
              defaultValue={acesso?.email ?? ""}
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>
          <label className="block text-xs">
            <span className="text-suave">Senha (dita-lhe tu)</span>
            <input
              name="senha"
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 font-mono text-sm outline-none focus:border-marca"
            />
          </label>
          <button
            type="submit"
            disabled={aGuardar}
            className="self-end rounded-full bg-marca px-5 py-2.5 text-xs text-white disabled:opacity-50"
          >
            {aGuardar ? "A guardar…" : "Guardar"}
          </button>
          {estado.erro && (
            <p className="text-xs text-marca sm:col-span-3">{estado.erro}</p>
          )}
          {estado.ok && (
            <p className="text-xs text-marca sm:col-span-3">{estado.ok}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function TabelaContas({
  lista,
  acessos,
}: {
  lista: ContaResumo[];
  acessos: Record<string, AcessoDaConta>;
}) {
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
        <div className="flex items-center gap-3">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar"
            className="rounded-full border border-borda bg-cartao px-4 py-2 text-sm outline-none focus:border-marca"
          />
          <Link
            href="/admin/contas/nova"
            className="rounded-full bg-marca px-5 py-2.5 text-sm text-white"
          >
            Criar conta
          </Link>
        </div>
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

            <Acesso conta={c} acesso={acessos[c.slug]} />
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
