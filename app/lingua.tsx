"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  COOKIE_LINGUA,
  LISTA_LINGUAS,
  type Dicionario,
  type Lingua,
} from "@/lib/i18n";

type Valor = { t: Dicionario; lingua: Lingua };

const Contexto = createContext<Valor | null>(null);

export function ProvedorLingua({
  t,
  lingua,
  children,
}: Valor & { children: ReactNode }) {
  return (
    <Contexto.Provider value={{ t, lingua }}>{children}</Contexto.Provider>
  );
}

/** Dicionário para componentes de cliente. */
export function useT(): Dicionario {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useT fora do ProvedorLingua");
  return valor.t;
}

export function useLingua(): Lingua {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useLingua fora do ProvedorLingua");
  return valor.lingua;
}

/**
 * Seletor de língua. Escrever o cookie e pedir refresh basta: as páginas leem
 * a língua do cookie no servidor, por isso voltam a render com o texto novo
 * sem recarregar a página inteira.
 */
export function SeletorLingua() {
  const actual = useLingua();
  const router = useRouter();
  const [aTrocar, comecar] = useTransition();
  const { t } = useContext(Contexto)!;

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t.comum.lingua}</span>
      <select
        value={actual}
        disabled={aTrocar}
        onChange={(evento) => {
          const escolhida = evento.target.value;
          document.cookie = `${COOKIE_LINGUA}=${escolhida};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
          comecar(() => router.refresh());
        }}
        className="rounded-full border border-borda bg-cartao px-3 py-1.5 text-sm text-suave outline-none focus:border-marca"
      >
        {LISTA_LINGUAS.map((item) => (
          <option key={item.codigo} value={item.codigo}>
            {item.nome}
          </option>
        ))}
      </select>
    </label>
  );
}
