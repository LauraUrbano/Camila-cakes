import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Marca } from "@/app/logo";
import { adminConfigurado, estaAutenticado } from "@/lib/admin/sessao";
import { sair } from "@/app/admin/accoes";

const menu = [
  { href: "/admin", rotulo: "Métricas" },
  { href: "/admin/contas", rotulo: "Contas" },
  { href: "/admin/inscricoes", rotulo: "Pedidos de acesso" },
  { href: "/admin/codigos", rotulo: "Códigos" },
  { href: "/admin/faturacao", rotulo: "Faturação" },
  { href: "/admin/stripe", rotulo: "Stripe" },
  { href: "/admin/email", rotulo: "Email" },
  { href: "/admin/legal", rotulo: "Empresa" },
];

/**
 * O portão.
 *
 * Vive num grupo de rotas, (painel), e não em /admin directamente: os layouts
 * do Next.js compõem-se em vez de se substituírem, por isso um layout em
 * /admin apanharia também /admin/entrar — que redirecionaria para si própria,
 * num ciclo. O grupo deixa a página de entrada fora do portão sem lhe mudar
 * o endereço.
 */
export const metadata = {
  title: "Plataforma",
  robots: { index: false, follow: false },
};

export default async function LayoutAdmin({
  children,
}: {
  children: ReactNode;
}) {
  if (!adminConfigurado()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24">
        <h1 className="font-titulo text-2xl">Painel fechado</h1>
        <p className="mt-4 leading-relaxed text-suave">
          Falta a variável <code className="font-mono">ADMIN_TOKEN</code> no
          ambiente. Sem ela não há senha para comparar, e deixar o painel
          aberto seria pior do que não o ter.
        </p>
      </main>
    );
  }

  if (!(await estaAutenticado())) redirect("/admin/entrar");

  return (
    <div className="min-h-full bg-fundo">
      <header className="border-b border-borda bg-cartao">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Marca className="h-7 w-7" />
            <span className="font-titulo font-semibold">Plataforma</span>
          </Link>

          <nav className="flex flex-wrap gap-1 text-sm">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-suave transition hover:bg-marca-suave hover:text-texto"
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>

          <form action={sair} className="ml-auto">
            <button
              type="submit"
              className="rounded-full border border-borda px-4 py-2 text-sm text-suave"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
