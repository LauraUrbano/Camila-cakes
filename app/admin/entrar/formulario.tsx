"use client";

import { useActionState } from "react";
import { Marca } from "@/app/logo";
import { entrar } from "@/app/admin/accoes";

export default function FormularioEntrada() {
  const [estado, accao, aEntrar] = useActionState(entrar, {});

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <Marca className="h-12 w-12" />
      <h1 className="mt-6 font-titulo text-2xl">Painel da plataforma</h1>
      <p className="mt-2 text-sm leading-relaxed text-suave">
        Esta área é só tua. Daqui vêem-se as contas de todas as confeitarias.
      </p>

      <form action={accao} className="mt-8 space-y-3">
        <input
          name="senha"
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Senha"
          className="w-full rounded-full border border-borda bg-cartao px-5 py-3 text-sm outline-none focus:border-marca"
        />
        <button
          type="submit"
          disabled={aEntrar}
          className="w-full rounded-full bg-marca py-3 text-sm text-white disabled:opacity-50"
        >
          {aEntrar ? "A verificar…" : "Entrar"}
        </button>
      </form>

      {estado.erro && (
        <p className="mt-4 text-sm text-marca">{estado.erro}</p>
      )}
    </main>
  );
}
