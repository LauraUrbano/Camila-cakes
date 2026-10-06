import type { ReactNode } from "react";
import Link from "next/link";
import { SeletorLingua } from "@/app/lingua";
import MenuTopo from "@/app/menu-topo";
import { vitrines } from "@/lib/fonte";

const paginas = [
  { href: "/termos", rotulo: "Termos de serviço" },
  { href: "/privacidade", rotulo: "Privacidade" },
  { href: "/legal", rotulo: "Informações legais" },
];

export default async function LayoutLegal({
  children,
}: {
  children: ReactNode;
}) {
  const exemplo = (await vitrines())[0]?.slug ?? "camila-cakes";

  return (
    <div className="flex min-h-screen flex-col">
      <MenuTopo exemplo={exemplo} />

      <main className="mx-auto w-full max-w-5xl grow px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[13rem_1fr]">
          <nav className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs tracking-[0.18em] text-suave uppercase">
              Documentos
            </p>
            <ul className="mt-4 space-y-1 text-sm">
              {paginas.map((pagina) => (
                <li key={pagina.href}>
                  <Link
                    href={pagina.href}
                    className="block rounded-xl px-3 py-2 text-suave transition hover:bg-marca-suave hover:text-texto"
                  >
                    {pagina.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* A medida curta é de propósito: um texto legal lê-se à mesma
              largura de um livro, não à largura do ecrã. */}
          <article className="legal max-w-[62ch]">{children}</article>
        </div>
      </main>

      <footer className="border-t border-borda py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-suave">
          <Link href="/" className="hover:text-texto">
            ← Cakelyo
          </Link>
          <SeletorLingua />
        </div>
      </footer>
    </div>
  );
}
