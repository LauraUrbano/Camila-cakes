import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--fonte-sans", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--fonte-titulo",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Cake Form — o cardápio e as encomendas da sua pastelaria",
  description:
    "Cardápio online, montagem de bolo com preço automático e gestão de encomendas para pasteleiras em Portugal e na Suíça.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
