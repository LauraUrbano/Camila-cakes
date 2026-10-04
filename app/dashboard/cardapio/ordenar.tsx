"use client";

import { useTransition } from "react";
import { mover } from "./accoes";

export default function Ordenar({
  chave,
  indice,
  total,
  rotulos,
}: {
  chave: string;
  indice: number;
  total: number;
  rotulos: { subir: string; descer: string };
}) {
  const [aMover, moverAgora] = useTransition();
  const botao =
    "grid h-8 w-8 place-items-center rounded-lg border border-borda text-suave transition hover:border-marca disabled:opacity-30";

  return (
    <div className="flex gap-1">
      <button
        type="button"
        aria-label={rotulos.subir}
        disabled={aMover || indice === 0}
        onClick={() => moverAgora(() => mover(chave, -1))}
        className={botao}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label={rotulos.descer}
        disabled={aMover || indice === total - 1}
        onClick={() => moverAgora(() => mover(chave, 1))}
        className={botao}
      >
        ↓
      </button>
    </div>
  );
}
