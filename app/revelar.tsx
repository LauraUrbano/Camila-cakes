"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Faz um bloco entrar quando se chega a ele.
 *
 * A animação é deliberadamente contida — sobe uns pixéis e aparece. Numa
 * página que serve para vender uma ferramenta de trabalho, movimento a mais
 * lê-se como barulho; o que se quer é que a página pareça viva ao passar,
 * não que chame a atenção para si.
 *
 * Quem pede menos movimento no sistema não vê animação nenhuma, e quem tiver
 * o JavaScript parado vê o conteúdo à mesma: começa visível e só se esconde
 * depois de haver quem o volte a mostrar.
 */
export default function Revelar({
  children,
  atraso = 0,
  className = "",
}: {
  children: ReactNode;
  /** Segundos a esperar, para blocos lado a lado entrarem em escada. */
  atraso?: number;
  className?: string;
}) {
  const alvo = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(true);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const menosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (menosMovimento) return;

    const no = alvo.current;
    if (!no) return;

    setVisivel(false);
    setPronto(true);

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observador.observe(no);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={alvo}
      className={`${pronto ? "revela" : ""} ${visivel ? "revela-dentro" : ""} ${className}`}
      style={atraso ? { transitionDelay: `${atraso}s` } : undefined}
    >
      {children}
    </div>
  );
}
