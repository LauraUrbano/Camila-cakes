import Image from "next/image";
import Link from "next/link";
import Icone from "@/app/icones";
import Carrossel, { type Slide } from "@/app/carrossel";
import { lojas } from "@/lib/dados";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();
}

const passos = [
  {
    numero: "01",
    titulo: "Monte o cardápio",
    texto:
      "Tamanhos, massas, recheios e decorações, cada um com o seu preço. Uma vez só.",
  },
  {
    numero: "02",
    titulo: "Partilhe o link",
    texto:
      "A sua página fica pronta. Vai na bio, no story, na conversa — em vez de vinte fotos soltas.",
  },
  {
    numero: "03",
    titulo: "Aceite o que quiser",
    texto:
      "O pedido chega montado e com o preço feito. Você combina o pagamento e aceita.",
  },
];

const areas: Slide[] = [
  {
    id: "combinacao",
    icone: "calculo",
    titulo: "Preço por combinação",
    texto:
      "O tamanho define o preço de partida e quantos recheios cabem. Massa, recheio e decoração entram como acréscimo e a soma sai sozinha.",
    href: "/camila-cakes/produto/bolo-festa",
    accao: "Montar um bolo",
    fotos: [
      { src: "/produtos/bolo-festa.jpg", alt: "Bolo com mirtilos" },
      { src: "/atelier/creme.jpg", alt: "Creme a ser espalhado no bolo" },
      { src: "/produtos/naked-cake.jpg", alt: "Naked cake com figos" },
      { src: "/atelier/piping.jpg", alt: "Pasteleira com saco de pasteleiro" },
    ],
  },
  {
    id: "colecoes",
    icone: "calendario",
    titulo: "Coleções sazonais",
    texto:
      "Natal, Páscoa, Dia da Mãe. O cardápio entra na data e sai na data, sem refazer nada — e o mesmo bolo pode viver em várias coleções.",
    href: "/camila-cakes",
    accao: "Ver o cardápio",
    fotos: [
      { src: "/produtos/bolo-rei.jpg", alt: "Bolo-rei polvilhado" },
      { src: "/atelier/tabuleiro.jpg", alt: "Pasteleira com tabuleiro" },
      { src: "/produtos/doces-festa.jpg", alt: "Doces de festa em forminhas" },
      { src: "/produtos/bolo-festa-ch.jpg", alt: "Bolo com framboesas" },
    ],
  },
  {
    id: "limite",
    icone: "caixa",
    titulo: "Limite de produção",
    texto:
      "Diz quantas unidades consegue fazer no período. O site conta por si e, quando esgota, o artigo sai do ar sozinho.",
    href: "/dashboard/cardapio",
    accao: "Ver no painel",
    fotos: [
      { src: "/atelier/farinha.jpg", alt: "Farinha a cair sobre a bancada" },
      { src: "/produtos/pasteis-nata.jpg", alt: "Pastel de nata" },
      { src: "/atelier/tabuleiro.jpg", alt: "Tabuleiro a sair do forno" },
      { src: "/produtos/doces-festa.jpg", alt: "Doces em forminhas" },
    ],
  },
  {
    id: "entrega",
    icone: "entrega",
    titulo: "Entrega à sua maneira",
    texto:
      "Levantamento no atelier, entrega por zona, taxa por região. Você define as opções, a cliente escolhe uma no momento do pedido.",
    href: "/dashboard/pagina",
    accao: "Definir entregas",
    fotos: [
      { src: "/atelier/caixas.jpg", alt: "Caixas de cartão empilhadas" },
      { src: "/atelier/caixas-doces.jpg", alt: "Doces embalados em caixa" },
      { src: "/produtos/bolo-festa.jpg", alt: "Bolo pronto a entregar" },
      { src: "/produtos/pasteis-nata.jpg", alt: "Pastéis de nata embalados" },
    ],
  },
  {
    id: "relatorios",
    icone: "grafico",
    titulo: "Relatórios",
    texto:
      "Receita confirmada, ticket médio, taxa de aceite e o que mais sai. Pedidos à espera de aceite ficam de fora da conta.",
    href: "/dashboard/relatorios",
    accao: "Abrir relatórios",
    fotos: [
      { src: "/produtos/naked-cake.jpg", alt: "Naked cake" },
      { src: "/atelier/piping.jpg", alt: "Decoração a ser aplicada" },
      { src: "/produtos/bolo-rei.jpg", alt: "Bolo-rei" },
      { src: "/atelier/creme.jpg", alt: "Creme a ser espalhado" },
    ],
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-titulo text-lg">Cake Form</span>
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

      <main>
        {/* ---------------------------------------------------------- hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="inline-block rounded-full bg-marca-suave px-3.5 py-1.5 text-xs text-marca">
              Protótipo de visualização — ainda sem base de dados
            </p>
            <h1 className="mt-6 text-[2.7rem] leading-[1.08] sm:text-6xl">
              O seu cardápio
              <br />
              deixa de ser
              <br />
              <span className="text-marca">uma conversa.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-suave">
              A cliente escolhe massa, recheio e decoração, vê o preço na hora e
              envia a encomenda pronta. Você só aceita — ou não.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${lojas[0].confeiteira.slug}`}
                className="rounded-full bg-marca px-7 py-3.5 text-white"
              >
                Ver uma página a sério
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-borda bg-cartao px-7 py-3.5"
              >
                Entrar no painel
              </Link>
            </div>
          </div>

          {/* Composição de fotos: mostra o produto sem precisar de explicar. */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute top-0 right-0 h-[62%] w-[72%] overflow-hidden rounded-[2rem] shadow-sm">
              <Image
                src="/produtos/naked-cake.jpg"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 24rem, 70vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 h-[55%] w-[58%] overflow-hidden rounded-[2rem] border-4 border-fundo shadow-sm">
              <Image
                src="/produtos/doces-festa.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 18rem, 55vw"
                className="object-cover"
              />
            </div>

            <div className="absolute right-0 bottom-6 w-[58%] rounded-2xl border border-borda bg-cartao p-4 text-xs shadow-sm">
              <p className="text-suave">Bolo grande · 3 recheios</p>
              <dl className="mt-3 space-y-1.5 text-suave">
                <div className="flex justify-between">
                  <dt>Massa red velvet</dt>
                  <dd>+ 8,00 €</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Nutella + ninho</dt>
                  <dd>+ 13,00 €</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Drip de chocolate</dt>
                  <dd>+ 7,00 €</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-baseline justify-between border-t border-borda pt-3">
                <span className="text-suave">Total</span>
                <span className="font-titulo text-lg text-texto">110,00 €</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- 3 passos */}
        <section className="border-y border-borda bg-cartao">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
            {passos.map((passo) => (
              <div key={passo.numero}>
                <span className="font-titulo text-3xl text-marca/40">
                  {passo.numero}
                </span>
                <h3 className="mt-3 font-titulo text-xl">{passo.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-suave">
                  {passo.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- carrossel */}
        <section className="overflow-hidden py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-marca" />
              <span className="text-xs tracking-[0.18em] text-suave uppercase">
                O que o Cake Form faz
              </span>
            </div>
            <h2 className="mt-6 max-w-2xl font-titulo text-3xl leading-snug sm:text-[2.6rem]">
              Tudo o que uma encomenda precisa, sem planilha e sem caderno.
            </h2>

            <div className="mt-14">
              <Carrossel slides={areas} />
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- o aceite manual */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid items-center gap-10 rounded-[2.5rem] bg-marca-suave p-10 sm:p-14 lg:grid-cols-2">
            <div>
              <h2 className="font-titulo text-3xl leading-snug">
                Nenhuma data entra na sua agenda sem você dizer que sim.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-suave">
                O pedido feito no site é uma reserva, não um compromisso. Você
                combina o pagamento como sempre fez — MB WAY, TWINT,
                transferência — e só depois aceita. Está escrito na tela da
                cliente, para não haver mal-entendido.
              </p>
            </div>
            <div className="rounded-3xl border border-borda bg-cartao p-7">
              <p className="text-sm text-suave">Juliana Prado · ENC-104</p>
              <p className="mt-1.5 font-titulo text-lg">
                Bolo de festa · Médio
              </p>
              <p className="mt-1 text-xs text-suave">
                massa red velvet · ninho e Nutella · drip de chocolate
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-marca px-5 py-2.5 text-sm text-white">
                  Aceitar pedido
                </span>
                <span className="rounded-full border border-borda px-5 py-2.5 text-sm">
                  Recusar
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-suave">
                <Icone nome="confirmado" className="h-4 w-4" />
                aceitar reserva a data na sua agenda
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- duas lojas */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-titulo text-3xl">
            Duas pastelarias, dois países, duas moedas
          </h2>
          <p className="mt-3 max-w-lg leading-relaxed text-suave">
            Cada uma tem o seu endereço, as suas cores e cobra na moeda do país
            onde trabalha. Entre e experimente montar um bolo.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {lojas.map(({ confeiteira, produtos }) => (
              <Link
                key={confeiteira.slug}
                href={`/${confeiteira.slug}`}
                className="group overflow-hidden rounded-3xl border border-borda bg-cartao transition hover:border-marca"
              >
                <div className="relative h-52">
                  <Image
                    src={produtos[0].foto}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-4 p-7">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-titulo text-sm"
                    style={{
                      background: confeiteira.tema.marcaSuave,
                      color: confeiteira.tema.marca,
                    }}
                  >
                    {iniciais(confeiteira.nome)}
                  </span>
                  <span>
                    <span className="block font-titulo text-lg">
                      {confeiteira.nome}
                    </span>
                    <span className="block text-sm text-suave">
                      {confeiteira.cidade} ·{" "}
                      {confeiteira.moeda === "EUR" ? "euro" : "franco suíço"}
                    </span>
                  </span>
                  <span className="ml-auto text-suave transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ chamada */}
        <section className="border-t border-borda bg-cartao">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="mx-auto max-w-lg font-titulo text-3xl leading-snug">
              A sua pastelaria merece mais do que um álbum de fotos.
            </h2>
            <Link
              href={`/${lojas[0].confeiteira.slug}`}
              className="mt-9 inline-block rounded-full bg-marca px-8 py-4 text-white"
            >
              Ver o Cake Form a funcionar
            </Link>
            <p className="mt-5 font-mono text-xs text-suave">
              cakeform.app/o-seu-nome
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-borda py-8 text-center text-sm text-suave">
        Cake Form · protótipo navegável com dados de exemplo
      </footer>
    </div>
  );
}
