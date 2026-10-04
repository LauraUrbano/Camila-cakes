"use client";

import { useActionState, useState } from "react";
import { useT } from "@/app/lingua";
import { novoProduto } from "./accoes";

export default function NovoProduto() {
  const t = useT().painel.editor;
  const [aberto, setAberto] = useState(false);
  const [estado, accao, aCriar] = useActionState(novoProduto, {});

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="rounded-full bg-marca px-5 py-2.5 text-sm text-white"
      >
        {t.novo}
      </button>
    );
  }

  return (
    <form action={accao} className="flex flex-wrap items-end gap-2">
      <label className="block text-xs">
        <span className="text-suave">{t.nomeDoNovo}</span>
        <input
          name="nome"
          autoFocus
          className="mt-1 w-56 rounded-xl border border-borda bg-cartao px-3 py-2 text-sm outline-none focus:border-marca"
        />
      </label>
      <button
        type="submit"
        disabled={aCriar}
        className="rounded-full bg-marca px-5 py-2.5 text-sm text-white disabled:opacity-50"
      >
        {aCriar ? t.aCriar : t.criar}
      </button>
      {estado.erro && (
        <p className="w-full text-xs text-marca">{estado.erro}</p>
      )}
    </form>
  );
}
