import type { ReactNode } from "react";
import Link from "next/link";
import { lojaPrincipal } from "@/lib/dados";

const { confeiteira } = lojaPrincipal;

const menu = [
  { href: "/dashboard", rotulo: "Visão geral", emoji: "📊" },
  { href: "/dashboard/pedidos", rotulo: "Pedidos", emoji: "📋" },
  { href: "/dashboard/cardapio", rotulo: "Cardápio", emoji: "🍰" },
  { href: "/dashboard/colecoes", rotulo: "Coleções", emoji: "🎄" },
  { href: "/dashboard/pagina", rotulo: "Minha página", emoji: "🎨" },
];

export default function LayoutDoPainel({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-borda bg-cartao lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-marca-suave">
            {confeiteira.emoji}
          </span>
          <span>
            <span className="block text-sm font-semibold">
              {confeiteira.nome}
            </span>
            <span className="block text-xs text-suave">painel</span>
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-suave transition hover:bg-marca-suave hover:text-texto"
            >
              <span>{item.emoji}</span>
              {item.rotulo}
            </Link>
          ))}
        </nav>

        <div className="hidden px-4 pb-6 lg:block">
          <Link
            href={`/${confeiteira.slug}`}
            className="block rounded-xl border border-borda p-4 text-xs leading-relaxed text-suave transition hover:border-marca"
          >
            <span className="block font-medium text-texto">
              Ver minha página
            </span>
            camilacakes.app/{confeiteira.slug} ↗
          </Link>
        </div>
      </aside>

      <main className="px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
