import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Cakelyo — gestão do teu negócio de bolos",
  description:
    "Tudo o que o teu negócio de bolos precisa, num só lugar. Encomendas, pedidos personalizados, cardápio e relatórios.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={`${nunito.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
