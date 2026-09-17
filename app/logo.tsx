/**
 * Marca do Cakelyo, redesenhada em SVG a partir do manual: queque de forma
 * chocolate, cobertura em dois laços de rosa e um coração por cima.
 *
 * Em SVG em vez de imagem para escalar sem perda, não trazer fundo branco e
 * herdar a cor onde for preciso (a versão clara usa `corEscura` = creme).
 */

type Props = {
  className?: string;
  /** Cor do queque e da palavra. */
  corEscura?: string;
  corRosa?: string;
  corCoracao?: string;
};

export function Marca({
  className = "h-9 w-9",
  corEscura = "#4A2E2A",
  corRosa = "#F4A7B5",
  corCoracao = "#E4899A",
}: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* coração */}
      <path
        d="M32 15.4c-1.9-3.7-7.3-3.2-7.3 1.1 0 2.9 3.9 5.6 7.3 8 3.4-2.4 7.3-5.1 7.3-8 0-4.3-5.4-4.8-7.3-1.1z"
        fill={corCoracao}
      />
      {/* laços da cobertura */}
      <g fill="none" stroke={corRosa} strokeWidth="5.4" strokeLinejoin="round">
        <ellipse cx="25.5" cy="32.5" rx="9" ry="8" />
        <ellipse cx="38" cy="33.5" rx="10.5" ry="7.5" />
      </g>
      {/* forma do queque */}
      <path
        d="M14.5 42.5h35l-4.3 12.9a4 4 0 0 1-3.8 2.7H22.6a4 4 0 0 1-3.8-2.7z"
        fill="none"
        stroke={corEscura}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g stroke={corEscura} strokeWidth="3.4" strokeLinecap="round">
        <path d="M26 47.5v5.5M32 47.5v6M38 47.5v5.5" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "h-8",
  corEscura = "#4A2E2A",
  ...resto
}: Props) {
  return (
    <span className="flex items-center gap-2.5">
      <Marca className={className} corEscura={corEscura} {...resto} />
      <span
        className="font-titulo text-[1.35rem] leading-none font-semibold tracking-[-0.02em]"
        style={{ color: corEscura }}
      >
        Cakelyo
      </span>
    </span>
  );
}
