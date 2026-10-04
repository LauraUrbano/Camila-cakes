"use client";

import { useActionState } from "react";
import { useT } from "@/app/lingua";
import { mudarSenha } from "./accoes";

const campo =
  "mt-1 w-full rounded-xl border border-borda bg-fundo px-3.5 py-2.5 text-sm outline-none focus:border-marca";

export default function FormularioSenha() {
  const t = useT().painel.conta;
  const [estado, accao, aGuardar] = useActionState(mudarSenha, {});

  return (
    <form action={accao} className="mt-6 rounded-3xl border border-borda bg-cartao p-7">
      <h2 className="font-titulo text-lg">{t.trocarSenha}</h2>
      <p className="mt-2 text-sm leading-relaxed text-suave">{t.trocarAjuda}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs sm:col-span-2">
          <span className="text-suave">{t.senhaActual}</span>
          <input
            name="actual"
            type="password"
            autoComplete="current-password"
            className={campo}
          />
        </label>
        <label className="block text-xs">
          <span className="text-suave">{t.senhaNova}</span>
          <input
            name="nova"
            type="password"
            autoComplete="new-password"
            className={campo}
          />
        </label>
        <label className="block text-xs">
          <span className="text-suave">{t.senhaRepetir}</span>
          <input
            name="repetida"
            type="password"
            autoComplete="new-password"
            className={campo}
          />
        </label>
      </div>

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
