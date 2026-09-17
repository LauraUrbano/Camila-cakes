import Link from "next/link";
import { confeiteira } from "@/lib/dados";

const recursos = [
  {
    emoji: "🔗",
    titulo: "Sua página, seu link",
    texto:
      "Cada confeiteira ganha um endereço próprio para mandar no direct. Depois é só apontar seu domínio para ele.",
  },
  {
    emoji: "🧮",
    titulo: "Preço que se calcula sozinho",
    texto:
      "Você cadastra massas, recheios e decorações com seus acréscimos. O cliente monta, o sistema soma.",
  },
  {
    emoji: "🎄",
    titulo: "Coleções sazonais",
    texto:
      "Cardápio de Natal, de Páscoa, de Dia das Mães. Liga na data, desliga na data, sem refazer nada.",
  },
  {
    emoji: "📦",
    titulo: "Limite de produção",
    texto:
      "Diz quantas unidades você dá conta de fazer. Quando esgota, o item sai do ar sozinho.",
  },
  {
    emoji: "✅",
    titulo: "Você aceita o pedido",
    texto:
      "Nada entra na sua agenda sem o seu aval. O cliente pede, você combina o pagamento e aceita.",
  },
  {
    emoji: "🚚",
    titulo: "Entrega do seu jeito",
    texto:
      "Retirada no ateliê, entrega por região, taxa por bairro. Você define, o cliente escolhe.",
  },
];

export default function Home() {
  return (
    <div>
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-titulo text-lg font-semibold">
            Camila Cakes
          </span>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/dashboard" className="text-suave hover:text-texto">
              Painel
            </Link>
            <Link
              href={`/${confeiteira.slug}`}
              className="rounded-full bg-marca px-4 py-2 font-medium text-white"
            >
              Ver exemplo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="py-20 sm:py-28">
          <p className="mb-4 inline-block rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
            Protótipo de visualização — sem banco de dados
          </p>
          <h1 className="max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl">
            Pare de fechar encomenda no meio de vinte conversas de WhatsApp.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-suave">
            Monte seu cardápio uma vez. Seu cliente escolhe massa, recheio e
            decoração, vê o preço na hora e manda o pedido pronto. Você só
            aceita — ou não.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${confeiteira.slug}`}
              className="rounded-full bg-marca px-6 py-3 font-medium text-white"
            >
              Ver uma página de confeiteira
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-borda bg-cartao px-6 py-3 font-medium"
            >
              Entrar no painel
            </Link>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden rounded-3xl border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-3">
          {recursos.map((recurso) => (
            <div key={recurso.titulo} className="bg-cartao p-7">
              <span className="text-2xl">{recurso.emoji}</span>
              <h3 className="mt-4 text-lg font-semibold">{recurso.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-suave">
                {recurso.texto}
              </p>
            </div>
          ))}
        </section>

        <section className="my-20 rounded-3xl bg-marca-suave p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Assim fica o endereço da sua confeitaria
          </h2>
          <p className="mt-3 font-mono text-marca">
            camilacakes.app/<span className="font-semibold">seu-nome</span>
          </p>
          <p className="mt-3 text-sm text-suave">
            Ou o seu domínio próprio, se você já tiver um.
          </p>
        </section>
      </main>

      <footer className="border-t border-borda py-8 text-center text-sm text-suave">
        Protótipo navegável · dados de exemplo
      </footer>
    </div>
  );
}
