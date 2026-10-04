import Link from "next/link";
import Logo from "@/app/logo";
import { SeletorLingua } from "@/app/lingua";
import { planos } from "@/lib/dados";
import { dicionarioActual, moedaActual } from "@/lib/i18n/servidor";
import FormularioAcesso from "./formulario";

/**
 * O destino do botão dos planos.
 *
 * Enquanto não houver registo com senha nem Stripe ligado, o que se pode
 * prometer com verdade é isto: deixar o contacto e ter a conta aberta por
 * nós. Pedir cartão numa página que não cobra nada seria pior do que não ter
 * destino nenhum.
 */
export default async function Assinar({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string; periodo?: string }>;
}) {
  const { plano: pedido, periodo: pedidoPeriodo } = await searchParams;
  const t = await dicionarioActual();
  const moeda = await moedaActual();

  const plano = planos.find((p) => p.id === pedido) ?? planos[1];
  const periodo = pedidoPeriodo === "anual" ? "anual" : "mensal";

  return (
    <div>
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/precos" className="text-sm text-suave hover:text-texto">
            {t.comum.precos}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-marca" />
          <span className="text-xs tracking-[0.18em] text-suave uppercase">
            {t.assinar.rotulo}
          </span>
        </div>
        <h1 className="mt-6 text-4xl leading-tight">{t.assinar.titulo}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-suave">
          {t.assinar.subtitulo}
        </p>

        <FormularioAcesso
          planos={planos}
          planoInicial={plano.id}
          periodo={periodo}
          moedaInicial={moeda}
        />
      </main>

      <footer className="border-t border-borda py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-suave">
          <span>Cakelyo · {t.comum.prototipo}</span>
          <SeletorLingua />
        </div>
      </footer>
    </div>
  );
}
