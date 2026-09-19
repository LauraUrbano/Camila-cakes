import Link from "next/link";
import Logo from "@/app/logo";
import { SeletorLingua } from "@/app/lingua";
import { comparacao, planos } from "@/lib/dados";
import { dicionarioActual, moedaActual } from "@/lib/i18n/servidor";
import TabelaPrecos from "./tabela-precos";

export default async function Precos() {
  const t = await dicionarioActual();
  // A moeda de partida vem da região de quem chega, não da língua.
  const moedaInicial = await moedaActual();

  return (
    <div>
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/dashboard" className="text-suave hover:text-texto">
              {t.comum.painel}
            </Link>
            <Link
              href="/camila-cakes"
              className="rounded-full bg-marca px-4 py-2 text-white"
            >
              {t.comum.verExemplo}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-marca" />
          <span className="text-xs tracking-[0.18em] text-suave uppercase">
            {t.precos.rotulo}
          </span>
        </div>
        <h1 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          {t.precos.titulo}
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-suave">
          {t.precos.subtitulo}
        </p>

        <div className="mt-12">
          <TabelaPrecos
            planos={planos}
            comparacao={comparacao}
            moedaInicial={moedaInicial}
          />
        </div>

        <p className="mt-8 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
          <strong>{t.precos.codigoTitulo}</strong> {t.precos.codigoTexto}{" "}
          <Link
            href="/dashboard/plano"
            className="underline underline-offset-2"
          >
            {t.precos.codigoLink}
          </Link>{" "}
          {t.precos.codigoFim}
        </p>

        <p className="mt-4 rounded-2xl border border-borda bg-cartao p-5 text-sm leading-relaxed text-suave">
          <strong className="text-texto">{t.precos.prototipoTitulo}</strong>{" "}
          {t.precos.prototipoTexto}
        </p>

        <section className="mt-20">
          <h2 className="font-titulo text-2xl">{t.precos.duvidasTitulo}</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {t.precos.duvidas.map((duvida) => (
              <div key={duvida.pergunta}>
                <dt className="font-titulo">{duvida.pergunta}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-suave">
                  {duvida.resposta}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <footer className="border-t border-borda py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-suave">
          <span>Cakelyo · {t.comum.prototipo}</span>
          <SeletorLingua />
        </div>
      </footer>
    </div>
  );
}
