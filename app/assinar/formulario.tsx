"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { useLingua, useT } from "@/app/lingua";
import { moeda as formata } from "@/lib/precos";
import { paraSlug } from "@/lib/slug";
import type { Moeda, Pais, Plano } from "@/lib/tipos";
import { pedirAcesso } from "./accoes";

const paises: Pais[] = ["PT", "CH", "BR"];
const moedaDoPais: Record<Pais, Moeda> = {
  PT: "EUR",
  CH: "CHF",
  BR: "BRL",
};

const campo =
  "mt-1 w-full rounded-xl border border-borda bg-cartao px-3.5 py-2.5 text-sm outline-none focus:border-marca";

export default function FormularioAcesso({
  planos,
  planoInicial,
  periodo,
  moedaInicial,
}: {
  planos: Plano[];
  planoInicial: string;
  periodo: "mensal" | "anual";
  moedaInicial: Moeda;
}) {
  const t = useT();
  const lingua = useLingua();
  const [estado, accao, aEnviar] = useActionState(pedirAcesso, {});

  const [planoId, setPlanoId] = useState(planoInicial);
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  // O país e a moeda chegam já respondidos a partir da região de quem abre a
  // página; mudam-se com um toque se estiverem errados.
  const [pais, setPais] = useState<Pais>(
    paises.find((p) => moedaDoPais[p] === moedaInicial) ?? "PT",
  );
  const [moeda, setMoeda] = useState<Moeda>(moedaInicial);

  const plano = planos.find((p) => p.id === planoId) ?? planos[0];
  const valor = plano[periodo][moeda];
  const nomePais = (codigo: Pais) =>
    new Intl.DisplayNames([lingua], { type: "region" }).of(codigo) ?? codigo;

  if (estado.ok) {
    return (
      <div className="entra-texto mt-12 rounded-3xl border border-marca bg-cartao p-10">
        <Icone nome="confirmado" className="h-8 w-8 text-marca" />
        <h2 className="mt-5 font-titulo text-2xl">{t.assinar.prontoTitulo}</h2>
        <p className="mt-3 max-w-lg leading-relaxed text-suave">
          {t.assinar.prontoTexto}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-marca px-6 py-3 text-sm text-white"
        >
          {t.assinar.prontoVoltar}
        </Link>
      </div>
    );
  }

  return (
    <form action={accao} className="mt-12 space-y-6">
      <input type="hidden" name="planoId" value={planoId} />
      <input type="hidden" name="periodo" value={periodo} />

      {/* ------------------------------------------------- plano escolhido */}
      <section className="rounded-3xl border border-borda bg-cartao p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs tracking-[0.14em] text-suave uppercase">
            {t.assinar.planoEscolhido}
          </p>
          <Link
            href="/precos"
            className="text-xs text-suave underline underline-offset-2"
          >
            {t.assinar.mudar}
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {planos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanoId(p.id)}
                aria-pressed={p.id === planoId}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  p.id === planoId
                    ? "border-marca bg-marca-suave text-marca"
                    : "border-borda text-suave hover:border-marca"
                }`}
              >
                {p.nome}
              </button>
            ))}
          </div>

          <p className="flex items-baseline gap-2">
            <span className="font-titulo text-2xl">
              {valor === 0 ? t.precos.gratis : formata(valor, moeda)}
            </span>
            {valor > 0 && (
              <span className="text-xs text-suave">
                /{periodo === "mensal" ? t.precos.porMes : t.precos.porAno}
              </span>
            )}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- contacto */}
      <section className="grid gap-5 rounded-3xl border border-borda bg-cartao p-7 sm:grid-cols-2">
        <label className="block text-xs">
          <span className="text-suave">{t.assinar.nome}</span>
          <input
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={campo}
          />
        </label>

        <label className="block text-xs">
          <span className="text-suave">{t.assinar.email}</span>
          <input name="email" type="email" className={campo} />
        </label>

        <label className="block text-xs">
          <span className="text-suave">{t.assinar.telefone}</span>
          <input name="telefone" inputMode="tel" className={campo} />
        </label>

        <label className="block text-xs">
          <span className="text-suave">{t.assinar.cidade}</span>
          <input name="cidade" className={campo} />
        </label>

        <label className="block text-xs">
          <span className="text-suave">{t.assinar.pais}</span>
          <select
            name="pais"
            value={pais}
            onChange={(e) => {
              const escolhido = e.target.value as Pais;
              setPais(escolhido);
              setMoeda(moedaDoPais[escolhido]);
            }}
            className={campo}
          >
            {paises.map((p) => (
              <option key={p} value={p}>
                {nomePais(p)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs">
          <span className="text-suave">{t.assinar.moeda}</span>
          <select
            name="moeda"
            value={moeda}
            onChange={(e) => setMoeda(e.target.value as Moeda)}
            className={campo}
          >
            <option value="EUR">EUR €</option>
            <option value="CHF">CHF</option>
            <option value="BRL">BRL R$</option>
          </select>
          <span className="mt-1.5 block leading-relaxed text-suave">
            {t.assinar.moedaAjuda}
          </span>
        </label>

        <label className="block text-xs sm:col-span-2">
          <span className="text-suave">{t.assinar.endereco}</span>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={paraSlug(nome) || "doces-da-sofia"}
            className={`${campo} font-mono`}
          />
          <span className="mt-1.5 block text-suave">
            cakelyo.app/
            <span className="font-mono text-texto">
              {paraSlug(slug || nome) || "…"}
            </span>
          </span>
        </label>

        <label className="block text-xs sm:col-span-2">
          <span className="text-suave">{t.assinar.mensagem}</span>
          <textarea name="mensagem" rows={3} className={campo} />
        </label>
      </section>

      {estado.erro && <p className="text-sm text-marca">{estado.erro}</p>}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={aEnviar}
          className="rounded-full bg-marca px-7 py-3.5 text-sm text-white disabled:opacity-50"
        >
          {aEnviar ? t.assinar.aEnviar : t.assinar.enviar}
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-suave">
          {t.assinar.semCartao}
        </p>
      </div>
    </form>
  );
}
