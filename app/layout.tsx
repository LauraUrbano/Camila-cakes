import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import { ProvedorLingua } from "./lingua";
import { dicionarioActual, linguaActual } from "@/lib/i18n/servidor";

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

export async function generateMetadata(): Promise<Metadata> {
  const t = await dicionarioActual();
  return { title: t.meta.titulo, description: t.meta.descricao };
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
