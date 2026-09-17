import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--fonte-sans", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--fonte-titulo",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Camila Cakes — a plataforma de quem vende bolo por encomenda",
  description:
    "Cardápio online, montagem de bolo com preço automático e controle de encomendas para confeiteiras.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
