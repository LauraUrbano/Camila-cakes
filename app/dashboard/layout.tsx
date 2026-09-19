import type { ReactNode } from "react";
import Link from "next/link";
import Icone, { type Nome } from "@/app/icones";
import { Marca } from "@/app/logo";
import { SeletorLingua } from "@/app/lingua";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { lojaPrincipal } from "@/lib/dados";

const { confeiteira } = lojaPrincipal;

const menu: { href: string; chave: keyof Nav; icone: Nome }[] = [
  { href: "/dashboard", chave: "geral", icone: "casa" },
  { href: "/dashboard/pedidos", chave: "pedidos", icone: "lista" },
  { href: "/dashboard/relatorios", chave: "relatorios", icone: "grafico" },
  { href: "/dashboard/cardapio", chave: "cardapio", icone: "bolo" },
  { href: "/dashboard/colecoes", chave: "colecoes", icone: "calendario" },
  { href: "/dashboard/pagina", chave: "pagina", icone: "paleta" },
  { href: "/dashboard/plano", chave: "plano", icone: "cartao" },
];

type Nav = Awaited<ReturnType<typeof dicionarioActual>>["painel"]["nav"];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();
}

export default async function LayoutDoPainel({
  children,
}: {
  children: ReactNode;
}) {
  const t = await dicionarioActual();

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-borda bg-cartao lg:border-r lg:border-b-0">
        <Link href="/" className="flex items-center gap-2 px-6 pt-5">
          <Marca className="h-7 w-7" />
          <span className="font-titulo font-semibold">Cakelyo</span>
        </Link>

        <div className="flex items-center gap-3 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-marca-suave font-titulo text-xs text-marca">
            {iniciais(confeiteira.nome)}
          </span>
          <span>
            <span className="block text-sm font-semibold">
              {confeiteira.nome}
            </span>
            <span className="block text-xs text-suave">{t.painel.painel}</span>
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-suave transition hover:bg-marca-suave hover:text-texto"
            >
              <Icone nome={item.icone} className="h-[18px] w-[18px]" />
              {t.painel.nav[item.chave]}
            </Link>
          ))}
        </nav>

        <div className="hidden px-4 pb-6 lg:block">
          <Link
            href={`/${confeiteira.slug}`}
            className="block rounded-xl border border-borda p-4 text-xs leading-relaxed text-suave transition hover:border-marca"
          >
            <span className="block font-medium text-texto">
              {t.painel.verPagina}
            </span>
            cakelyo.app/{confeiteira.slug} ↗
          </Link>
        </div>
      </aside>

      <main className="px-6 py-8 lg:px-10">
        {children}
        <div className="mx-auto mt-16 max-w-4xl border-t border-borda pt-6">
          <SeletorLingua />
        </div>
      </main>
    </div>
  );
}
