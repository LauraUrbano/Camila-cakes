"use client";

import { useState } from "react";
import Link from "next/link";
import type { Confeiteira } from "@/lib/tipos";

export default function PedidoPersonalizado({
  confeiteira,
  slug,
}: {
  confeiteira: Confeiteira;
  slug: string;
}) {
  const [enviado, setEnviado] = useState(false);
  const [ideia, setIdeia] = useState("");

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <span className="text-5xl">💬</span>
        <h1 className="mt-6 text-2xl font-semibold">Orçamento solicitado</h1>
        <p className="mt-3 leading-relaxed text-suave">
          {confeiteira.nome} vai responder com um valor e, se você aprovar, ela
          aceita o pedido e a data fica reservada.
        </p>
        <Link
          href={`/${slug}`}
          className="mt-8 inline-block rounded-full border border-borda bg-cartao px-6 py-3 text-sm font-medium"
        >
          Voltar ao cardápio
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href={`/${slug}`} className="text-sm text-suave hover:text-texto">
        ← cardápio
      </Link>

      <h1 className="mt-5 text-3xl font-semibold">Pedido personalizado</h1>
      <p className="mt-3 leading-relaxed text-suave">
        Para o que não cabe no cardápio pronto. Descreve a ideia com o máximo de
        detalhe que você conseguir — quanto mais eu souber, mais preciso fica o
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
            <span className="font-medium">Seu nome</span>
            <input
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">WhatsApp</span>
            <input
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Data da festa</span>
            <input
              type="date"
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Quantas pessoas</span>
            <input
              type="number"
              min={1}
              required
              className="mt-2 w-full rounded-xl border border-borda bg-cartao p-3 outline-none focus:border-marca"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-medium">A ideia</span>
          <textarea
            required
            rows={6}
            value={ideia}
            onChange={(evento) => setIdeia(evento.target.value)}
            placeholder="Tema, cores, sabores que você gosta, referências que viu, restrições alimentares…"
            className="mt-2 w-full rounded-xl border border-borda bg-cartao p-4 outline-none focus:border-marca"
          />
        </label>

        <div className="rounded-2xl border-2 border-marca bg-marca-suave p-5 text-sm leading-relaxed">
          Pedido personalizado começa como <strong>orçamento</strong>. A data só
          fica reservada depois que {confeiteira.nome} aceitar o pedido.
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-marca py-3.5 font-medium text-white"
        >
          Pedir orçamento
        </button>
      </form>
    </main>
  );
}
