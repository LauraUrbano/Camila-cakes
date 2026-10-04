"use client";

import { useActionState, useState } from "react";
import Icone from "@/app/icones";
import { useT } from "@/app/lingua";
import type { Avaliacao, ResumoAvaliacoes } from "@/lib/bd/avaliacoes";
import { deixarAvaliacao } from "./accoes-avaliacao";

/** Cinco estrelas desenhadas a partir de uma só, cheias até à nota. */
function Estrelas({ nota, tamanho = "h-4 w-4" }: { nota: number; tamanho?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${tamanho} ${i <= Math.round(nota) ? "text-marca" : "text-borda"}`}
          fill="currentColor"
        >
          <path d="M10 1.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.5l5.4-.8z" />
        </svg>
      ))}
    </span>
  );
}

function quando(iso: string, lingua: string) {
  return new Date(iso).toLocaleDateString(lingua, {
    month: "long",
    year: "numeric",
  });
}

export default function Avaliacoes({
  slug,
  nome,
  lista,
  resumo,
  lingua,
}: {
  slug: string;
  nome: string;
  lista: Avaliacao[];
  resumo: ResumoAvaliacoes;
  lingua: string;
}) {
  const t = useT().loja.avaliacoes;
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState(0);
  const [estado, accao, aEnviar] = useActionState(deixarAvaliacao, {});

  return (
    <section className="mt-20 border-t border-borda pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-titulo text-2xl">{t.titulo}</h2>
          {resumo.quantas > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <Estrelas nota={resumo.media} tamanho="h-5 w-5" />
              <span className="text-sm">
                <strong className="font-titulo text-lg">
                  {resumo.media.toFixed(1).replace(".", ",")}
                </strong>{" "}
                <span className="text-suave">{t.media}</span>
                <span className="text-suave">
                  {" · "}
                  {resumo.quantas}{" "}
                  {resumo.quantas === 1 ? t.umaAvaliacao : t.variasAvaliacoes}
                </span>
              </span>
            </div>
          )}
        </div>

        {!aberto && !estado.ok && (
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="rounded-full border border-borda px-5 py-2.5 text-sm transition hover:border-marca"
          >
            {t.deixar}
          </button>
        )}
      </div>

      {estado.ok ? (
        <div className="entra-texto mt-8 rounded-3xl border border-marca bg-cartao p-7">
          <Icone nome="confirmado" className="h-6 w-6 text-marca" />
          <p className="mt-3 font-titulo text-lg">{t.obrigada}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-suave">
            {t.obrigadaTexto}
          </p>
        </div>
      ) : (
        aberto && (
          <form
            action={accao}
            className="entra-texto mt-8 rounded-3xl border border-borda bg-cartao p-7"
          >
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="nota" value={nota} />

            <fieldset>
              <legend className="text-xs text-suave">{t.aNota}</legend>
              <div className="mt-2 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNota(i)}
                    aria-pressed={nota === i}
                    aria-label={`${i}`}
                    className="transition hover:scale-110"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-8 w-8 ${i <= nota ? "text-marca" : "text-borda"}`}
                      fill="currentColor"
                    >
                      <path d="M10 1.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.5l5.4-.8z" />
                    </svg>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block text-xs">
              <span className="text-suave">{t.oNome}</span>
              <input
                name="nome"
                className="mt-1 w-full rounded-xl border border-borda bg-fundo px-3.5 py-2.5 text-sm outline-none focus:border-marca"
              />
            </label>

            <label className="mt-4 block text-xs">
              <span className="text-suave">{t.oComentario}</span>
              <textarea
                name="comentario"
                rows={4}
                placeholder={t.comentarioAjuda}
                className="mt-1 w-full rounded-xl border border-borda bg-fundo px-3.5 py-2.5 text-sm outline-none focus:border-marca"
              />
            </label>

            {estado.erro && <p className="mt-4 text-sm text-marca">{estado.erro}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={aEnviar}
                className="rounded-full bg-marca px-6 py-3 text-sm text-white disabled:opacity-50"
              >
                {aEnviar ? t.aEnviar : t.enviar}
              </button>
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="text-sm text-suave underline underline-offset-2"
              >
                {t.fechar}
              </button>
            </div>
          </form>
        )
      )}

      {lista.length > 0 ? (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {lista.map((avaliacao) => (
            <li
              key={avaliacao.id}
              className="rounded-3xl border border-borda bg-cartao p-6"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <Estrelas nota={avaliacao.nota} />
                {avaliacao.verificada && (
                  <span className="rounded-full bg-marca-suave px-2.5 py-1 text-[11px] text-marca">
                    {t.verificada}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                {avaliacao.comentario}
              </p>
              <p className="mt-4 text-xs text-suave">
                {avaliacao.nome} · {quando(avaliacao.criadaEm, lingua)}
              </p>

              {avaliacao.resposta && (
                <div className="mt-4 rounded-2xl bg-marca-suave/60 p-4">
                  <p className="text-[11px] text-suave">
                    {t.respondeu.replace("%s", nome)}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed">
                    {avaliacao.resposta}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm leading-relaxed text-suave">{t.semNenhuma}</p>
      )}

      {/* Dizer como funciona é o que separa isto de uma montra escolhida a
          dedo: quem lê sabe que o que está no ecrã passou pelo crivo dela. */}
      <p className="mt-8 text-xs leading-relaxed text-suave">
        {t.comoFunciona.replace("%s", nome)}
      </p>
    </section>
  );
}
