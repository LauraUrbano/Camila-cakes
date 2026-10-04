"use client";

import { useActionState } from "react";
import { useT } from "@/app/lingua";
import { entrar } from "./accoes";

const campo =
  "mt-1 w-full rounded-xl border border-borda bg-cartao px-3.5 py-3 text-sm outline-none focus:border-marca";

export default function FormularioEntrar() {
  const t = useT();
  const [estado, accao, aEntrar] = useActionState(entrar, {});

  return (
    <form action={accao} className="rounded-3xl border border-borda bg-cartao p-8">
      <label className="block text-xs">
        <span className="text-suave">{t.entrar.email}</span>
        <input
          name="email"
          autoFocus
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className={campo}
        />
        <span className="mt-1.5 block text-suave">{t.entrar.emailAjuda}</span>
      </label>

      <label className="mt-5 block text-xs">
        <span className="text-suave">{t.entrar.senha}</span>
        <input
          name="senha"
          type="password"
          autoComplete="current-password"
          className={campo}
        />
      </label>

      {estado.erro && <p className="mt-5 text-sm text-marca">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aEntrar}
        className="mt-7 w-full rounded-full bg-marca py-3.5 text-sm text-white disabled:opacity-50"
      >
        {aEntrar ? t.entrar.aEntrar : t.entrar.botao}
      </button>

      <p className="mt-5 text-xs leading-relaxed text-suave">
        {t.entrar.esqueceu}
      </p>
    </form>
  );
}
