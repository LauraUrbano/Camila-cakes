"use client";

import { useState } from "react";
import Link from "next/link";
import Icone from "@/app/icones";
import { useT } from "@/app/lingua";
import type { Confeiteira } from "@/lib/tipos";

export default function PedidoPersonalizado({
  confeiteira,
  slug,
}: {
  confeiteira: Confeiteira;
  slug: string;
}) {
  const d = useT().loja;
  const t = d.personalizado;
  const [enviado, setEnviado] = useState(false);
  const [ideia, setIdeia] = useState("");

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-marca-suave text-marca">
          <Icone nome="conversa" className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-2xl">{t.enviadoTitulo}</h1>
        <p className="mt-3 leading-relaxed text-suave">
          {confeiteira.nome} {t.enviadoTexto}
        </p>
        <Link
          href={`/${slug}`}
          className="mt-8 inline-block rounded-full border border-borda bg-cartao px-6 py-3 text-sm font-medium"
        >
          {d.montador.voltarCardapio}
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href={`/${slug}`} className="text-sm text-suave hover:text-texto">
        ← {d.montador.voltarCardapio}
      </Link>

      <h1 className="mt-5 text-3xl font-semibold">{t.titulo}</h1>
      <p className="mt-3 leading-relaxed text-suave">
        Para o que não cabe no cardápio pronto. Descreva a ideia com o máximo de
        detalhe que conseguir — quanto mais eu souber, mais preciso fica o
        orçamento.
      </p>

      <form
        className="mt-10 space-y-6"
        onSubmit={(evento) => {
          evento.preventDefault();
          setEnviado(true);
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">{t.nome}</span>
            <input
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t.whatsapp}</span>
            <input
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t.data}</span>
            <input
              type="date"
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t.pessoas}</span>
            <input
              type="number"
              min={1}
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-medium">{t.ideia}</span>
          <textarea
            required
            rows={6}
            value={ideia}
            onChange={(evento) => setIdeia(evento.target.value)}
            placeholder={t.ideiaAjuda}
            className="mt-2 w-full rounded-xl border border-borda bg-cartao p-4 outline-none focus:border-marca"
          />
        </label>

        <div className="rounded-2xl border border-marca bg-marca-suave p-5 text-sm leading-relaxed">
          {t.avisoAntes} <strong>{t.avisoForte}</strong>
          {t.avisoDepois} {confeiteira.nome} {t.avisoFim}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-marca py-3.5 font-medium text-white"
        >
          {t.botao}
        </button>
      </form>
    </main>
  );
}
