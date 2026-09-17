import type { ReactNode, CSSProperties } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { confeiteira } from "@/lib/dados";

export default async function LayoutDaConfeiteira({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== confeiteira.slug) notFound();

  // É aqui que a personalização visual entra: o tema da confeiteira vira
  // variável CSS e todo o resto da página se pinta sozinho.
  const tema = {
    "--marca": confeiteira.tema.marca,
    "--marca-suave": confeiteira.tema.marcaSuave,
    "--fundo": confeiteira.tema.fundo,
    "--texto": confeiteira.tema.texto,
  } as CSSProperties;

  return (
    <div style={tema} className="min-h-full bg-fundo text-texto">
      <header className="border-b border-borda bg-cartao/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href={`/${slug}`} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-marca-suave text-lg">
              {confeiteira.emoji}
            </span>
            <span>
              <span className="block font-titulo font-semibold">
                {confeiteira.nome}
              </span>
              <span className="block text-xs text-suave">
                {confeiteira.cidade}
              </span>
            </span>
          </Link>
          <a
            href={`https://wa.me/`}
            className="rounded-full border border-borda px-4 py-2 text-sm font-medium"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {children}

      <footer className="mt-20 border-t border-borda bg-cartao">
        <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-suave">
          <p className="font-medium text-texto">{confeiteira.nome}</p>
          <p className="mt-1">
            {confeiteira.instagram} · {confeiteira.whatsapp}
          </p>
          <p className="mt-6 text-xs">
            Página feita na plataforma Camila Cakes ·{" "}
            <Link href="/" className="underline">
              crie a sua
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
