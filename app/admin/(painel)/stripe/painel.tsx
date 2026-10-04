"use client";

import { useState, useTransition } from "react";
import Icone from "@/app/icones";
import type { Definicao } from "@/lib/bd/admin";
import type { EstadoDaChave } from "@/lib/admin/stripe";
import { guardarChave } from "@/app/admin/accoes";

function Linha({ definicao }: { definicao: Definicao }) {
  const [valor, setValor] = useState(definicao.valor);
  const [aGravar, gravar] = useTransition();
  const [guardado, setGuardado] = useState(false);
  const mudou = valor.trim() !== definicao.valor;

  return (
    <li className="grid gap-3 border-t border-borda py-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
      <div>
        <p className="font-mono text-xs">{definicao.chave}</p>
        <p className="mt-0.5 text-xs text-suave">{definicao.descricao}</p>
      </div>
      <input
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          setGuardado(false);
        }}
        placeholder="price_…"
        className="w-full rounded-xl border border-borda px-3 py-2 font-mono text-xs outline-none focus:border-marca"
      />
      <button
        type="button"
        disabled={!mudou || aGravar}
        onClick={() =>
          gravar(async () => {
            await guardarChave(definicao.chave, valor);
            setGuardado(true);
          })
        }
        className="rounded-full border border-borda px-4 py-2 text-xs disabled:opacity-40"
      >
        {aGravar ? "A guardar…" : guardado ? "Guardado" : "Guardar"}
      </button>
    </li>
  );
}

export default function PainelStripe({
  chaves,
  definicoes,
}: {
  chaves: EstadoDaChave[];
  definicoes: Definicao[];
}) {
  return (
    <div>
      <h1 className="text-2xl">Stripe</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-suave">
        A plataforma cobra a assinatura das confeitarias. O dinheiro das
        encomendas nunca passa por aqui — isso fica entre a confeiteira e a
        cliente dela.
      </p>

      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">Chaves</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-suave">
          As chaves vivem nas variáveis de ambiente, não na base de dados nem
          aqui. Se a base vazasse, levava a faturação atrás — e um formulário
          fá-las-ia passar pelo browser. Este painel só diz se estão no sítio.
        </p>

        <ul className="mt-6 space-y-3">
          {chaves.map((chave) => (
            <li
              key={chave.nome}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-fundo p-4"
            >
              <span
                className={
                  chave.presente ? "text-marca" : "text-suave opacity-50"
                }
              >
                <Icone
                  nome={chave.presente ? "confirmado" : "cartao"}
                  className="h-5 w-5"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs">{chave.nome}</span>
                <span className="block text-xs text-suave">
                  {chave.descricao}
                </span>
              </span>
              <span className="text-right text-xs">
                {chave.presente ? (
                  <>
                    <span className="block">
                      {chave.modo === "producao"
                        ? "produção"
                        : chave.modo === "teste"
                          ? "teste"
                          : "configurada"}
                    </span>
                    <span className="block font-mono text-suave">
                      …{chave.fim}
                    </span>
                  </>
                ) : (
                  <span className="text-suave">por configurar</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {chaves.some((c) => c.modo === "producao") && (
          <p className="mt-6 rounded-2xl border border-marca bg-marca-suave p-4 text-sm leading-relaxed">
            Há uma chave de <strong>produção</strong> configurada. A partir
            daqui as cobranças são reais.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">Identificadores de preço</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-suave">
          Estes podem ficar na base: não são segredos e mudam sempre que crias
          preços novos — e são diferentes entre teste e produção. Editá-los
          aqui evita voltar a publicar o site por causa de um identificador.
        </p>
        <ul className="mt-4">
          {definicoes.map((d) => (
            <Linha key={d.chave} definicao={d} />
          ))}
        </ul>
      </section>
    </div>
  );
}
