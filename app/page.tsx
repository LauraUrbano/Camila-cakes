import Image from "next/image";
import Link from "next/link";
import Icone from "@/app/icones";
import Logo from "@/app/logo";
import Camadas, { type Camada } from "@/app/camadas";
import VitrineTema, { type Vitrine } from "@/app/vitrine-tema";
import { lojas } from "@/lib/dados";
import { moeda, precoAPartirDe } from "@/lib/precos";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();
}

// A mesma vitrine, vista com os olhos de cada pasteleira.
const vitrines: Vitrine[] = lojas.map(({ confeiteira, produtos }) => ({
  slug: confeiteira.slug,
  nome: confeiteira.nome,
  iniciais: iniciais(confeiteira.nome),
  cidade: confeiteira.cidade,
  tagline: confeiteira.tagline,
  moedaNome: confeiteira.moeda === "EUR" ? "euros" : "francos suíços",
  tema: confeiteira.tema,
  entrega: confeiteira.entregas
    .map(
      (opcao) =>
        `${opcao.nome} ${opcao.taxa === 0 ? "grátis" : moeda(opcao.taxa, confeiteira.moeda)}`,
    )
    .join(" · "),
  produtos: produtos.slice(0, 3).map((produto) => ({
    nome: produto.nome,
    foto: produto.foto,
    preco: moeda(precoAPartirDe(produto), confeiteira.moeda),
  })),
}));

const passos = [
  {
    numero: "01",
    titulo: "Monta o cardápio",
    texto:
      "Tamanhos, massas, recheios e decorações, cada um com o seu preço. Uma vez só.",
  },
  {
    numero: "02",
    titulo: "Partilha o link",
    texto:
      "A tua página fica pronta. Vai na bio, no story, na conversa — em vez de vinte fotos soltas.",
  },
  {
    numero: "03",
    titulo: "Aceita o que quiseres",
    texto:
      "O pedido chega montado e com o preço feito. Combinas o pagamento e aceitas.",
  },
];

const areas: Camada[] = [
  {
    id: "combinacao",
    icone: "calculo",
    titulo: "Preço por combinação",
    resumo: "O tamanho manda no preço e no número de recheios",
    texto:
      "O tamanho define o preço de partida e quantos recheios cabem. Massa, recheio e decoração entram como acréscimo e a soma sai sozinha — não há tabela de preços para manter à mão.",
    href: "/camila-cakes/produto/bolo-festa",
    accao: "Montar um bolo",
    foto: "/produtos/bolo-festa.jpg",
    cor: "#FCE4D6",
  },
  {
    id: "colecoes",
    icone: "calendario",
    titulo: "Coleções sazonais",
    resumo: "Natal, Páscoa, Dia da Mãe — entram e saem na data",
    texto:
      "Montas o cardápio da época uma vez e dizes quando entra e quando sai. O mesmo bolo pode viver em várias coleções, e desligar a de Natal não apaga nada — só tira do ar.",
    href: "/camila-cakes",
    accao: "Ver o cardápio",
    foto: "/produtos/bolo-rei.jpg",
    cor: "#FBE9EC",
  },
  {
    id: "limite",
    icone: "caixa",
    titulo: "Limite de produção",
    resumo: "Diz quantos consegues fazer e o site trava sozinho",
    texto:
      "Dizes quantas unidades dás conta de fazer no período. O site conta por ti e, quando esgota, o artigo sai do ar — ninguém encomenda o que já não podes fazer.",
    href: "/dashboard/cardapio",
    accao: "Ver no painel",
    foto: "/atelier/tabuleiro.jpg",
    cor: "#EDF3EC",
  },
  {
    id: "entrega",
    icone: "entrega",
    titulo: "Entrega à tua maneira",
    resumo: "Levantamento, entrega por zona, taxa por região",
    texto:
      "Defines as formas de receber e o que cobras por cada uma. A tua cliente escolhe uma no momento do pedido e a taxa entra no total, sem combinar por mensagem.",
    href: "/dashboard/pagina",
    accao: "Definir entregas",
    foto: "/atelier/caixas.jpg",
    cor: "#FCE4D6",
  },
  {
    id: "relatorios",
    icone: "grafico",
    titulo: "Relatórios",
    resumo: "Receita confirmada, ticket médio e o que mais sai",
    texto:
      "Receita confirmada, ticket médio, taxa de aceite e o ranking dos produtos. Pedidos à espera de aceite ficam de fora da conta — só entra o que já disseste que sim.",
    href: "/dashboard/relatorios",
    accao: "Abrir relatórios",
    foto: "/atelier/piping.jpg",
    cor: "#FBE9EC",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <div className="flex items-center gap-5 text-sm">
            <Link href="/precos" className="text-suave hover:text-texto">
              Preços
            </Link>
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
            <h1 className="mt-6 text-[2.6rem] leading-[1.1] sm:text-[3.4rem]">
              Tudo o que o teu negócio de bolos precisa,{" "}
              <span className="text-marca">num só lugar.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-suave">
              A tua cliente escolhe massa, recheio e decoração, vê o preço na
              hora e envia a encomenda pronta. Só tens de aceitar — ou não.
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

        {/* --------------------------------------------------------- camadas */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-marca" />
              <span className="text-xs tracking-[0.18em] text-suave uppercase">
                O que o Cakelyo faz
              </span>
            </div>
            <h2 className="mt-6 max-w-2xl font-titulo text-3xl leading-snug sm:text-[2.6rem]">
              Tudo o que uma encomenda precisa, sem planilha e sem caderno.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-suave">
              Cinco camadas. Abre a que te interessa.
            </p>

            <div className="mt-12">
              <Camadas camadas={areas} />
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- o aceite manual */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid items-center gap-10 rounded-[2.5rem] bg-marca-suave p-10 sm:p-14 lg:grid-cols-2">
            <div>
              <h2 className="font-titulo text-3xl leading-snug">
                Nenhuma data entra na tua agenda sem tu dizeres que sim.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-suave">
                O pedido feito no site é uma reserva, não um compromisso.
                Combinas o pagamento como sempre fizeste — MB WAY, TWINT,
                transferência — e só depois aceitas. Está escrito no ecrã da
                tua cliente, para não haver mal-entendido.
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
                aceitar reserva a data na tua agenda
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- duas lojas */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-marca" />
            <span className="text-xs tracking-[0.18em] text-suave uppercase">
              A página é sua
            </span>
          </div>
          <h2 className="mt-6 max-w-2xl font-titulo text-3xl leading-snug sm:text-[2.6rem]">
            A mesma vitrine, com a cara de quem a faz.
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-suave">
            Carregue num nome e veja o endereço, as cores, os preços e a moeda
            mudarem. É a mesma página — só que de outra pessoa.
          </p>

          <div className="mt-10">
            <VitrineTema vitrines={vitrines} />
          </div>
        </section>

        {/* ------------------------------------------------------ chamada */}
        <section className="border-t border-borda bg-cartao">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="mx-auto max-w-lg font-titulo text-3xl leading-snug">
              O teu negócio de bolos merece mais do que um álbum de fotos.
            </h2>
            <Link
              href={`/${lojas[0].confeiteira.slug}`}
              className="mt-9 inline-block rounded-full bg-marca px-8 py-4 text-white"
            >
              Ver o Cakelyo a funcionar
            </Link>
            <p className="mt-5 font-mono text-xs text-suave">
              cakelyo.app/o-teu-nome
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-borda py-8 text-center text-sm text-suave">
        Cakelyo · gestão do teu negócio de bolos · protótipo com dados de
        exemplo
      </footer>
    </div>
  );
}
