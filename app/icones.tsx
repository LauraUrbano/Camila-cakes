// Ícones de traço, desenhados à mão em SVG. Substituem os emojis, que vinham
// com o estilo do sistema operativo e deixavam a página com cara de conversa
// de WhatsApp.

type Props = { nome: Nome; className?: string };

export type Nome =
  | "ligacao"
  | "calculo"
  | "calendario"
  | "caixa"
  | "confirmado"
  | "entrega"
  | "levantamento"
  | "grafico"
  | "lista"
  | "bolo"
  | "paleta"
  | "enviado"
  | "conversa";

const caminhos: Record<Nome, React.ReactNode> = {
  ligacao: (
    <>
      <path d="M9 13.5a4 4 0 0 0 5.7.3l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
      <path d="M15 10.5a4 4 0 0 0-5.7-.3l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2" />
    </>
  ),
  calculo: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 7.5h8M8 12h3M13 12h3M8 16h3M13 16h3" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  caixa: (
    <>
      <path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5z" />
      <path d="M3.5 8.5 12 13l8.5-4.5M12 13v7" />
    </>
  ),
  confirmado: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </>
  ),
  entrega: (
    <>
      <path d="M3 7.5h9v8H3zM12 10h4l3 3v2.5h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </>
  ),
  levantamento: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  grafico: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 17v-5M12.5 17V8M17 17v-7" />
    </>
  ),
  lista: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3" />
    </>
  ),
  bolo: (
    <>
      <path d="M4.5 20h15v-6a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3z" />
      <path d="M4.5 15.5c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0" />
      <path d="M12 8V5" />
    </>
  ),
  paleta: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1 0 1.6-.7 1.6-1.5 0-1.4 1-2 2-2H18a3 3 0 0 0 3-3c0-5.2-4-10.5-9-10.5z" />
      <circle cx="8.5" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="15.5" cy="10" r="1" />
    </>
  ),
  enviado: (
    <>
      <path d="m3.5 12 17-7.5-4 17-4.5-6z" />
      <path d="m12 15.5 8.5-11" />
    </>
  ),
  conversa: (
    <>
      <path d="M20 13.5a3 3 0 0 1-3 3H9l-4.5 3.5V7a3 3 0 0 1 3-3h9.5a3 3 0 0 1 3 3z" />
      <path d="M9 9h7M9 12.5h4.5" />
    </>
  ),
};

export default function Icone({ nome, className = "h-5 w-5" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {caminhos[nome]}
    </svg>
  );
}
