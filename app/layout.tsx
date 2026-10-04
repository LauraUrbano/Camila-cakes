import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import { ProvedorLingua } from "./lingua";
import { dicionarioActual, linguaActual } from "@/lib/i18n/servidor";
import { SITE } from "@/lib/seo";

const nunito = Nunito({
  variable: "--fonte-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});
const poppins = Poppins({
  variable: "--fonte-titulo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * O que os motores de busca e as redes sociais lêem.
 *
 * `metadataBase` não é um detalhe: sem ele, as imagens de partilha saem com
 * caminhos relativos e nenhuma rede as consegue ir buscar — o link aparece
 * sem imagem, que é a diferença entre alguém abrir e alguém passar à frente.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await dicionarioActual();
  return {
    metadataBase: new URL(SITE),
    title: { default: t.meta.titulo, template: `%s · Cakelyo` },
    description: t.meta.descricao,
    applicationName: "Cakelyo",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: "Cakelyo",
      locale: t.meta.htmlLang.replace("-", "_"),
      title: t.meta.titulo,
      description: t.meta.descricao,
      url: SITE,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.titulo,
      description: t.meta.descricao,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lingua = await linguaActual();
  const t = await dicionarioActual();

  return (
    <html
      lang={t.meta.htmlLang}
      className={`${nunito.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <ProvedorLingua t={t} lingua={lingua}>
          {children}
        </ProvedorLingua>
      </body>
    </html>
  );
}
