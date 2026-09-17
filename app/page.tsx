import Link from "next/link";
import { lojas } from "@/lib/dados";

const recursos = [
  {
    emoji: "🔗",
    titulo: "A sua página, o seu link",
    texto:
      "Cada pasteleira recebe um endereço próprio para partilhar. Depois é só apontar o seu domínio para ele.",
  },
  {
    emoji: "🧮",
    titulo: "Preço que se calcula sozinho",
    texto:
      "Regista massas, recheios e decorações com os seus acréscimos. A cliente escolhe, o sistema soma.",
  },
  {
    emoji: "🕯️",
    titulo: "Coleções sazonais",
    texto:
      "Cardápio de Natal, de Páscoa, do Dia da Mãe. Entra na data, sai na data, sem refazer nada.",
  },
  {
    emoji: "📦",
    titulo: "Limite de produção",
    texto:
      "Diz quantas unidades consegue fazer. Quando esgota, o artigo sai do ar sozinho.",
  },
  {
    emoji: "✅",
    titulo: "É você que aceita",
    texto:
      "Nada entra na sua agenda sem o seu aval. A cliente pede, você combina o pagamento e aceita.",
  },
  {
    emoji: "🚲",
    titulo: "Entrega à sua maneira",
    texto:
      "Levantamento no atelier, entrega por zona, taxa por região. Você define, a cliente escolhe.",
  },
];

export default function Home() {
  return (
    <div>
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-titulo text-lg">Camila Cakes</span>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/dashboard" className="text-suave hover:text-texto">
              Painel
            </Link>
            <Link
              href={`/${lojas[0].confeiteira.slug}`}
              className="rounded-full bg-marca px-4 py-2 text-white"
            >
              Ver exemplo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="py-20 sm:py-28">
          <p className="mb-5 inline-block rounded-full bg-marca-suave px-3.5 py-1.5 text-xs text-marca">
            Protótipo de visualização — ainda sem base de dados
          </p>
          <h1 className="max-w-2xl text-4xl leading-tight sm:text-[3.1rem]">
            Pare de fechar encomendas no meio de vinte conversas.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-suave">
            Monte o seu cardápio uma vez. A sua cliente escolhe massa, recheio e
            decoração, vê o preço na hora e envia o pedido pronto. Você só
            aceita — ou não.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${lojas[0].confeiteira.slug}`}
              className="rounded-full bg-marca px-6 py-3 text-white"
            >
              Ver uma página de pasteleira
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-borda bg-cartao px-6 py-3"
            >
              Entrar no painel
            </Link>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden rounded-3xl border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-3">
          {recursos.map((recurso) => (
            <div key={recurso.titulo} className="bg-cartao p-8">
              <span className="text-2xl">{recurso.emoji}</span>
              <h3 className="mt-5 font-titulo text-lg">{recurso.titulo}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-suave">
                {recurso.texto}
              </p>
            </div>
          ))}
        </section>

        <section className="my-20">
          <h2 className="text-center font-titulo text-2xl">
            Duas pasteleiras, dois países, duas moedas
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-suave">
            Cada uma tem o seu endereço, as suas cores e cobra na moeda do país
            onde trabalha.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {lojas.map(({ confeiteira }) => (
              <Link
                key={confeiteira.slug}
                href={`/${confeiteira.slug}`}
                className="rounded-3xl border border-borda bg-cartao p-8 transition hover:border-marca"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-full text-xl"
                  style={{ background: confeiteira.tema.marcaSuave }}
                >
                  {confeiteira.emoji}
                </span>
                <h3 className="mt-5 font-titulo text-lg">{confeiteira.nome}</h3>
                <p className="mt-1.5 text-sm text-suave">
                  {confeiteira.cidade} ·{" "}
                  {confeiteira.moeda === "EUR" ? "euro" : "franco suíço"}
                </p>
                <p className="mt-5 font-mono text-xs text-suave">
                  camilacakes.app/{confeiteira.slug} →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-borda py-8 text-center text-sm text-suave">
        Protótipo navegável · dados de exemplo
      </footer>
    </div>
  );
}
