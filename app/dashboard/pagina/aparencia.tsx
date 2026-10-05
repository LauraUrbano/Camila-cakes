"use client";

import { useActionState, useState } from "react";
import { useT } from "@/app/lingua";
import { LISTA_LINGUAS } from "@/lib/i18n";
import { guardarAparenciaDaPagina } from "./accoes";

/** Um desenho pequeno de cada modelo, para se escolher com o olho. */
function Miniatura({ modelo, cor }: { modelo: string; cor: string }) {
  const bloco = "rounded-[3px]";
  if (modelo === "vitrine") {
    return (
      <span className="block space-y-1.5">
        <span className={`block h-10 ${bloco}`} style={{ background: cor }} />
        <span className="grid grid-cols-2 gap-1.5">
          <span className={`block h-6 ${bloco}`} style={{ background: cor }} />
          <span className={`block h-6 ${bloco}`} style={{ background: cor }} />
        </span>
      </span>
    );
  }
  if (modelo === "revista") {
    return (
      <span className="block space-y-1.5">
        <span className="grid grid-cols-[1.2fr_1fr] gap-1.5">
          <span className="block space-y-1 pt-1">
            <span className="block h-1.5 w-full rounded-full bg-borda" />
            <span className="block h-1.5 w-2/3 rounded-full bg-borda" />
          </span>
          <span className={`block h-8 ${bloco}`} style={{ background: cor }} />
        </span>
        <span className="grid grid-cols-[1fr_1.2fr] gap-1.5">
          <span className={`block h-7 ${bloco}`} style={{ background: cor }} />
          <span className="block space-y-1 pt-1">
            <span className="block h-1.5 w-full rounded-full bg-borda" />
            <span className="block h-1.5 w-1/2 rounded-full bg-borda" />
          </span>
        </span>
      </span>
    );
  }
  return (
    <span className="block space-y-1.5">
      <span className="block space-y-1 pb-1">
        <span className="block h-1.5 w-3/4 rounded-full bg-borda" />
        <span className="block h-1.5 w-1/2 rounded-full bg-borda" />
      </span>
      <span className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`block h-8 ${bloco}`} style={{ background: cor }} />
        ))}
      </span>
    </span>
  );
}

export default function SeccaoAparencia({
  inicial,
  cor,
}: {
  inicial: { lingua: string; modelo: string };
  cor: string;
}) {
  const t = useT().painel.pagina.aparencia;
  const [estado, accao, aGuardar] = useActionState(guardarAparenciaDaPagina, {});
  const [modelo, setModelo] = useState(inicial.modelo);

  const modelos = [
    { id: "classico", nome: t.classico, ajuda: t.classicoAjuda },
    { id: "vitrine", nome: t.vitrine, ajuda: t.vitrineAjuda },
    { id: "revista", nome: t.revista, ajuda: t.revistaAjuda },
  ];

  return (
    <form action={accao} className="rounded-3xl border border-borda bg-cartao p-7">
      <h2 className="font-titulo text-lg">{t.titulo}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">{t.ajuda}</p>

      <input type="hidden" name="modelo" value={modelo} />

      <fieldset className="mt-6">
        <legend className="text-xs text-suave">{t.modelo}</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {modelos.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModelo(m.id)}
              aria-pressed={modelo === m.id}
              className={`rounded-2xl border p-4 text-left transition ${
                modelo === m.id
                  ? "border-marca bg-marca-suave/40"
                  : "border-borda hover:border-marca"
              }`}
            >
              <Miniatura modelo={m.id} cor={cor} />
              <span className="mt-3 block text-sm font-medium">{m.nome}</span>
              <span className="mt-1 block text-xs leading-relaxed text-suave">
                {m.ajuda}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-7 block max-w-sm text-xs">
        <span className="text-suave">{t.lingua}</span>
        <select
          name="lingua"
          defaultValue={inicial.lingua}
          className="mt-1 w-full rounded-xl border border-borda bg-fundo px-3.5 py-2.5 text-sm outline-none focus:border-marca"
        >
          <option value="">{t.seguirQuemVisita}</option>
          {LISTA_LINGUAS.map((item) => (
            <option key={item.codigo} value={item.codigo}>
              {item.nome}
            </option>
          ))}
        </select>
        <span className="mt-1.5 block leading-relaxed text-suave">
          {t.linguaAjuda}
        </span>
      </label>

      {estado.erro && <p className="mt-5 text-sm text-marca">{estado.erro}</p>}
      {estado.ok && <p className="mt-5 text-sm text-marca">{estado.ok}</p>}

      <button
        type="submit"
        disabled={aGuardar}
        className="mt-6 rounded-full bg-marca px-6 py-3 text-sm text-white disabled:opacity-50"
      >
        {aGuardar ? t.aGuardar : t.guardar}
      </button>
    </form>
  );
}
