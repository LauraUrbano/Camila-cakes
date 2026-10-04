"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/app/logo";
import { useT } from "@/app/lingua";

/**
 * O topo do site.
 *
 * Em ecrã estreito os cinco destinos não cabem em linha — encavalitavam-se
 * sobre o logótipo. Passam a viver atrás de um botão, e ficam a ocupar a
 * largura toda quando se abrem, que é o tamanho a que um dedo acerta.
 */
export default function MenuTopo({ exemplo }: { exemplo: string }) {
  const t = useT();
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  const destinos = [
    { href: "/#como-funciona", texto: t.comum.comoFunciona },
    { href: "/precos", texto: t.comum.precos },
    { href: `/${exemplo}`, texto: t.comum.verExemplo },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-borda bg-fundo/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" onClick={fechar} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {destinos.map((destino) => (
            <Link
              key={destino.href}
              href={destino.href}
              className="text-suave hover:text-texto"
            >
              {destino.texto}
            </Link>
          ))}
          <span className="h-4 w-px bg-borda" />
          <Link href="/entrar" className="text-suave hover:text-texto">
            {t.comum.entrar}
          </Link>
          <Link
            href="/assinar"
            className="rounded-full bg-marca px-4 py-2 text-white"
          >
            {t.comum.criarConta}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/assinar"
            onClick={fechar}
            className="rounded-full bg-marca px-4 py-2 text-sm text-white"
          >
            {t.comum.criarConta}
          </Link>
          <button
            type="button"
            onClick={() => setAberto((x) => !x)}
            aria-expanded={aberto}
            aria-label={t.comum.menu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-borda"
          >
            {/* Três traços que viram cruz, sem trocar de ícone a meio. */}
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-texto transition-all duration-300 ${
                  aberto ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1.5 left-0 block h-[1.5px] w-4 bg-texto transition-opacity duration-200 ${
                  aberto ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-texto transition-all duration-300 ${
                  aberto ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* O painel desliza em vez de aparecer de repente, para se perceber de
          onde veio. A altura animada evita empurrar a página aos saltos.
          `inert` fechado não é um detalhe: um painel com altura zero continua
          a conter ligações, e sem isto quem navega por teclado saltava para
          dentro de um menu que não está no ecrã. */}
      <div
        inert={!aberto}
        className={`overflow-hidden border-t border-borda bg-cartao transition-[max-height,opacity] duration-300 md:hidden ${
          aberto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2">
          {destinos.map((destino) => (
            <Link
              key={destino.href}
              href={destino.href}
              onClick={fechar}
              className="border-b border-borda py-3.5 text-sm"
            >
              {destino.texto}
            </Link>
          ))}
          <Link
            href="/entrar"
            onClick={fechar}
            className="py-3.5 text-sm font-medium"
          >
            {t.comum.entrar}
          </Link>
        </nav>
      </div>
    </header>
  );
}
