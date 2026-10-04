"use client";

import { useActionState, useState, useTransition } from "react";
import { useT } from "@/app/lingua";
import type { Avaliacao } from "@/lib/bd/avaliacoes";
import { mudarAvaliacao, responder } from "./accoes";

function Estrelas({ nota }: { nota: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${nota}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i <= nota ? "text-marca" : "text-borda"}`}
          fill="currentColor"
        >
          <path d="M10 1.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.5l5.4-.8z" />
        </svg>
      ))}
    </span>
  );
}

function Ficha({ avaliacao, lingua }: { avaliacao: Avaliacao; lingua: string }) {
  const t = useT().painel.avaliacoes;
  const [aGravar, gravar] = useTransition();
  const [aResponder, setAResponder] = useState(false);
  const [estado, accao, aGuardar] = useActionState(responder, {});

  const quando = new Date(avaliacao.criadaEm).toLocaleDateString(lingua, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article
      className={`rounded-3xl border bg-cartao p-6 ${
        avaliacao.estado === "nova" ? "border-marca" : "border-borda"
      } ${avaliacao.estado === "escondida" ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Estrelas nota={avaliacao.nota} />
            <span className="font-titulo">{avaliacao.nome}</span>
            {avaliacao.verificada && (
              <span className="rounded-full bg-marca-suave px-2.5 py-1 text-[11px] text-marca">
                {t.verificada}
              </span>
            )}
            {avaliacao.estado === "nova" && (
              <span className="rounded-full bg-marca px-2.5 py-1 text-[11px] text-white">
                {t.porTratar}
              </span>
            )}
            {avaliacao.estado === "escondida" && (
              <span className="rounded-full border border-borda px-2.5 py-1 text-[11px] text-suave">
                {t.escondida}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-suave">{quando}</p>
        </div>
      </div>

      {avaliacao.comentario && (
        <p className="mt-4 leading-relaxed">{avaliacao.comentario}</p>
      )}

      {avaliacao.resposta && !aResponder && (
        <div className="mt-4 rounded-2xl bg-marca-suave/60 p-4">
          <p className="text-[11px] text-suave">{t.aTuaResposta}</p>
          <p className="mt-1.5 text-sm leading-relaxed">{avaliacao.resposta}</p>
        </div>
      )}

      {aResponder && (
        <form action={accao} className="mt-4">
          <input type="hidden" name="id" value={avaliacao.id} />
          <textarea
            name="resposta"
            rows={3}
            defaultValue={avaliacao.resposta}
            placeholder={t.respostaAjuda}
            className="w-full rounded-xl border border-borda px-3.5 py-2.5 text-sm outline-none focus:border-marca"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={aGuardar}
              className="rounded-full bg-marca px-5 py-2 text-xs text-white disabled:opacity-50"
            >
              {aGuardar ? t.aGuardar : t.guardarResposta}
            </button>
            <button
              type="button"
              onClick={() => setAResponder(false)}
              className="text-xs text-suave underline underline-offset-2"
            >
              {t.cancelar}
            </button>
            {estado.ok && <span className="text-xs text-marca">{estado.ok}</span>}
          </div>
        </form>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-borda pt-4">
        {avaliacao.estado !== "publicada" && (
          <button
            type="button"
            disabled={aGravar}
            onClick={() => gravar(() => mudarAvaliacao(avaliacao.id, "publicada"))}
            className="rounded-full bg-marca px-4 py-2 text-xs text-white disabled:opacity-50"
          >
            {t.publicar}
          </button>
        )}
        {avaliacao.estado !== "escondida" && (
          <button
            type="button"
            disabled={aGravar}
            onClick={() => gravar(() => mudarAvaliacao(avaliacao.id, "escondida"))}
            className="rounded-full border border-borda px-4 py-2 text-xs disabled:opacity-50"
          >
            {t.esconder}
          </button>
        )}
        {!aResponder && (
          <button
            type="button"
            onClick={() => setAResponder(true)}
            className="ml-auto text-xs text-suave underline underline-offset-2"
          >
            {avaliacao.resposta ? t.mudarResposta : t.responder}
          </button>
        )}
      </div>
    </article>
  );
}

export default function PainelAvaliacoes({
  lista,
  lingua,
}: {
  lista: Avaliacao[];
  lingua: string;
}) {
  const t = useT().painel.avaliacoes;
  const porTratar = lista.filter((a) => a.estado === "nova").length;

  return (
    <div className="mt-8">
      {porTratar > 0 && (
        <p className="mb-6 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
          <strong>
            {porTratar} {porTratar === 1 ? t.umaPorTratar : t.variasPorTratar}
          </strong>{" "}
          {t.porTratarTexto}
        </p>
      )}

      <div className="space-y-4">
        {lista.map((avaliacao) => (
          <Ficha key={avaliacao.id} avaliacao={avaliacao} lingua={lingua} />
        ))}
      </div>

      {lista.length === 0 && (
        <p className="rounded-3xl border border-borda bg-cartao p-8 text-center text-sm text-suave">
          {t.nenhuma}
        </p>
      )}
    </div>
  );
}
