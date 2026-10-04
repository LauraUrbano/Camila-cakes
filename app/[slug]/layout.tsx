import type { ReactNode, CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { lojaDoSlug } from "@/lib/fonte";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { url } from "@/lib/seo";
import { SeletorLingua } from "@/app/lingua";

/** Duas iniciais servem de marca enquanto a confeiteira não carrega um logótipo. */
function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();
}

/**
 * Cada confeitaria tem a sua ficha nos motores de busca e nas redes.
 *
 * É a página dela que é partilhada no Instagram e no WhatsApp, não a nossa:
 * o título, o texto e a imagem têm de ser os dela. A foto do primeiro
 * produto serve de imagem de partilha enquanto ela não escolher outra —
 * melhor um bolo verdadeiro do que o nosso cartão genérico.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loja = await lojaDoSlug(slug);
  if (!loja) return {};

  const { confeiteira } = loja;
  const titulo = `${confeiteira.nome} — bolos por encomenda em ${confeiteira.cidade}`;
  const descricao =
    confeiteira.tagline ||
    confeiteira.bio ||
    `Encomenda bolos a ${confeiteira.nome}, em ${confeiteira.cidade}.`;
  const foto = loja.produtos.find((p) => p.foto)?.foto;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      title: titulo,
      description: descricao,
      url: url(`/${slug}`),
      images: foto ? [{ url: foto }] : undefined,
    },
    twitter: {
      card: foto ? "summary_large_image" : "summary",
      title: titulo,
      description: descricao,
      images: foto ? [foto] : undefined,
    },
  };
}

export default async function LayoutDaConfeiteira({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = (await dicionarioActual()).loja;
  const loja = await lojaDoSlug(slug);
  if (!loja) notFound();

  const { confeiteira } = loja;

  // O wa.me só aceita dígitos, e uma conta acabada de abrir ainda não tem
  // contactos nenhuns: sem isto, o botão levava a uma conversa com ninguém e
  // o rodapé mostrava um "·" sozinho.
  const whatsapp = confeiteira.whatsapp.replace(/\D/g, "");
  const contactos = [confeiteira.instagram, confeiteira.whatsapp].filter(Boolean);

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
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href={`/${slug}`} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-marca-suave font-titulo text-sm text-marca">
              {iniciais(confeiteira.nome)}
            </span>
            <span>
              <span className="block font-titulo text-[15px]">
                {confeiteira.nome}
              </span>
              <span className="block text-xs text-suave">
                {confeiteira.cidade}
              </span>
            </span>
          </Link>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              className="rounded-full border border-borda px-4 py-2 text-sm"
            >
              {t.falarComigo}
            </a>
          )}
        </div>
      </header>

      {children}

      <footer className="mt-24 border-t border-borda bg-cartao">
        <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-suave">
          <p className="font-titulo text-texto">{confeiteira.nome}</p>
          {contactos.length > 0 && (
            <p className="mt-1">{contactos.join(" · ")}</p>
          )}
          <div className="mt-6">
            <SeletorLingua />
          </div>
          <p className="mt-6 text-xs">
            {t.feitaNo}{" "}
            <Link href="/" className="underline underline-offset-2">
              {t.criaATua}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
