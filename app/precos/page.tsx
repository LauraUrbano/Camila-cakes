import Link from "next/link";
import Logo from "@/app/logo";
import { comparacao, planos } from "@/lib/dados";
import TabelaPrecos from "./tabela-precos";

const duvidas = [
  {
    pergunta: "Pago comissão sobre as encomendas?",
    resposta:
      "Não. O pagamento da encomenda é combinado directamente entre ti e a tua cliente — MB WAY, TWINT, transferência, dinheiro. O Cakelyo não entra nessa transacção e não fica com nada dela.",
  },
  {
    pergunta: "Posso mudar de plano ou sair?",
    resposta:
      "A qualquer momento, pelo painel. Ao subir, pagas só a diferença do que falta do período. Ao sair, a tua página fica no ar até ao fim do período já pago e depois passa ao plano Prova — não perdes o cardápio.",
  },
  {
    pergunta: "Os preços têm IVA?",
    resposta:
      "Os valores acima são sem imposto. O IVA é somado no fim conforme o país e, se tiveres número de contribuinte de empresa na União Europeia, é aplicada a autoliquidação. No Brasil os valores em real já incluem os impostos devidos.",
  },
  {
    pergunta: "Que meios de pagamento aceitam?",
    resposta:
      "Cartão, através do Stripe. Os dados do cartão nunca passam pelos nossos servidores.",
  },
];

export default function Precos() {
  return (
    <div>
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/dashboard" className="text-suave hover:text-texto">
              Painel
            </Link>
            <Link
              href="/camila-cakes"
              className="rounded-full bg-marca px-4 py-2 text-white"
            >
              Ver exemplo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-marca" />
          <span className="text-xs tracking-[0.18em] text-suave uppercase">
            Planos
          </span>
        </div>
        <h1 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
          Um preço fixo por mês. Zero comissão sobre o que vendes.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-suave">
          Começa sem pagar nada. Quando o cardápio crescer e as épocas
          apertarem, sobes de plano — ou não.
        </p>

        <div className="mt-12">
          <TabelaPrecos planos={planos} comparacao={comparacao} />
        </div>

        <p className="mt-8 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
          <strong>Recebeste um código de acesso vitalício?</strong> Resgata-o
          em{" "}
          <Link href="/dashboard/plano" className="underline underline-offset-2">
            Plano e faturação
          </Link>{" "}
          e ficas com o plano para sempre, sem pagar e sem cartão.
        </p>

        <p className="mt-4 rounded-2xl border border-borda bg-cartao p-5 text-sm leading-relaxed text-suave">
          <strong className="text-texto">Isto é um protótipo.</strong> Nenhum
          pagamento é processado — a ligação ao Stripe entra quando houver
          contas e base de dados.
        </p>

        <section className="mt-20">
          <h2 className="font-titulo text-2xl">Antes que perguntes</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {duvidas.map((duvida) => (
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

      <footer className="border-t border-borda py-8 text-center text-sm text-suave">
        Cakelyo · protótipo navegável com dados de exemplo
      </footer>
    </div>
  );
}
