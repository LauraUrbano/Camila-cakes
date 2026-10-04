"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { novaConta } from "@/app/admin/accoes";
import { paraSlug } from "@/lib/slug";
import type { Moeda } from "@/lib/tipos";

/** A moeda que se espera em cada país — mudável, porque há excepções. */
const moedaDoPais: Record<string, Moeda> = {
  PT: "EUR",
  CH: "CHF",
  BR: "BRL",
};

export default function FormularioConta() {
  const [estado, accao, aCriar] = useActionState(novaConta, {});
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [pais, setPais] = useState("PT");
  const [moeda, setMoeda] = useState<Moeda>("EUR");
  const [semCobranca, setSemCobranca] = useState(true);

  const endereco = paraSlug(slug || nome);

  if (estado.ok && estado.slug) {
    return (
      <div className="mt-8 rounded-3xl border border-marca bg-cartao p-8">
        <h2 className="font-titulo text-lg">{estado.ok}</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-suave">
          A página já responde. Falta o cardápio — enquanto não houver
          produtos, a cliente vê uma página vazia.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/${estado.slug}`}
            className="rounded-full bg-marca px-5 py-2.5 text-white"
          >
            Abrir /{estado.slug}
          </Link>
          <Link
            href="/admin/contas"
            className="rounded-full border border-borda px-5 py-2.5"
          >
            Ver todas as contas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={accao} className="mt-8 max-w-2xl space-y-8">
      <section className="rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">A confeitaria</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="text-suave">Nome</span>
            <input
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Doces da Sofia"
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>

          <label className="block text-xs">
            <span className="text-suave">Endereço da página</span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={paraSlug(nome) || "doces-da-sofia"}
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 font-mono text-sm outline-none focus:border-marca"
            />
            <span className="mt-1.5 block text-suave">
              cakelyo.app/
              <span className="font-mono text-texto">{endereco || "…"}</span>
            </span>
          </label>

          <label className="block text-xs">
            <span className="text-suave">Cidade</span>
            <input
              name="cidade"
              placeholder="Genebra"
              className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs">
              <span className="text-suave">País</span>
              <select
                name="pais"
                value={pais}
                onChange={(e) => {
                  setPais(e.target.value);
                  setMoeda(moedaDoPais[e.target.value] ?? "EUR");
                }}
                className="mt-1 w-full rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
              >
                <option value="PT">Portugal</option>
                <option value="CH">Suíça</option>
                <option value="BR">Brasil</option>
              </select>
            </label>

            <label className="block text-xs">
              <span className="text-suave">Moeda</span>
              <select
                name="moeda"
                value={moeda}
                onChange={(e) => setMoeda(e.target.value as Moeda)}
                className="mt-1 w-full rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
              >
                <option value="EUR">EUR €</option>
                <option value="CHF">CHF</option>
                <option value="BRL">BRL R$</option>
              </select>
            </label>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-suave">
          A moeda é a dos preços dos bolos dela, na página e nas encomendas.
          Não tem de ser a mesma em que nos paga.
        </p>
      </section>

      <section className="rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">O acesso</h2>

        <label className="mt-6 flex gap-3 text-sm">
          <input
            type="checkbox"
            name="semCobranca"
            checked={semCobranca}
            onChange={(e) => setSemCobranca(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-marca"
          />
          <span>
            Não paga nada
            <span className="mt-1 block text-xs leading-relaxed text-suave">
              O plano fica vitalício e a conta nunca passa pelo Stripe. Fica
              registada como concessão nossa, com um código próprio, para mais
              tarde se saber porque é que não há cobrança.
            </span>
          </span>
        </label>

        <label className="mt-6 block text-xs">
          <span className="text-suave">Plano</span>
          <select
            name="planoId"
            defaultValue="pastelaria"
            className="mt-1 w-full max-w-xs rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
          >
            <option value="prova">Prova</option>
            <option value="atelier">Atelier</option>
            <option value="pastelaria">Pastelaria</option>
          </select>
        </label>

        <label className="mt-4 block text-xs">
          <span className="text-suave">Nota (para te lembrares porquê)</span>
          <input
            name="nota"
            placeholder="Primeira cliente — conta oferecida."
            className="mt-1 w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
          />
        </label>

        {!semCobranca && (
          <p className="mt-6 rounded-2xl border border-borda p-4 text-xs leading-relaxed text-suave">
            Sem a opção acima, a conta entra em período de teste e espera
            pagamento. Enquanto o Stripe não estiver ligado, ninguém lhe pode
            cobrar nada.
          </p>
        )}
      </section>

      {estado.erro && <p className="text-sm text-marca">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aCriar}
        className="rounded-full bg-marca px-7 py-3 text-sm text-white disabled:opacity-50"
      >
        {aCriar ? "A criar…" : "Criar conta"}
      </button>
    </form>
  );
}
