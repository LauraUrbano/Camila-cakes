import Image from "next/image";
import Link from "next/link";
import Icone, { type Nome } from "@/app/icones";
import Logo from "@/app/logo";
import Camadas, { type Camada } from "@/app/camadas";
import VitrineTema, { type Vitrine } from "@/app/vitrine-tema";
import { SeletorLingua } from "@/app/lingua";
import { lojas } from "@/lib/dados";
import { moeda, precoAPartirDe } from "@/lib/precos";
import { dicionarioActual } from "@/lib/i18n/servidor";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();
}

/**
 * A parte de cada área que não é texto — ícone, destino e fotos. O texto vem
 * do dicionário, na mesma ordem, e junta-se a isto na altura de desenhar.
 */
const areasFixas: { icone: Nome; href: string; foto: string; cor: string }[] = [
  {
    icone: "calculo",
    href: "/camila-cakes/produto/bolo-festa",
    foto: "/produtos/bolo-festa.jpg",
    cor: "#FCE4D6",
  },
  {
    icone: "calendario",
    href: "/camila-cakes",
    foto: "/produtos/bolo-rei.jpg",
    cor: "#FBE9EC",
  },
  {
    icone: "caixa",
    href: "/dashboard/cardapio",
    foto: "/atelier/tabuleiro.jpg",
    cor: "#EDF3EC",
  },
  {
    icone: "entrega",
    href: "/dashboard/pagina",
    foto: "/atelier/caixas.jpg",
    cor: "#FCE4D6",
  },
  {
    icone: "grafico",
    href: "/dashboard/relatorios",
    foto: "/atelier/piping.jpg",
    cor: "#FBE9EC",
  },
];

export default async function Home() {
  const t = await dicionarioActual();

  const areas: Camada[] = t.areas.map((area, i) => ({
    id: String(i),
    ...areasFixas[i],
    titulo: area.titulo,
    resumo: area.resumo,
    texto: area.texto,
    accao: area.accao,
  }));

  const vitrines: Vitrine[] = lojas.map(({ confeiteira, produtos }) => ({
    slug: confeiteira.slug,
    nome: confeiteira.nome,
    iniciais: iniciais(confeiteira.nome),
    cidade: confeiteira.cidade,
    tagline: confeiteira.tagline,
    moedaNome: confeiteira.moeda,
    tema: confeiteira.tema,
    entrega: confeiteira.entregas
      .map(
        (opcao) =>
          `${opcao.nome} ${opcao.taxa === 0 ? t.loja.gratis : moeda(opcao.taxa, confeiteira.moeda)}`,
      )
      .join(" · "),
    produtos: produtos.slice(0, 3).map((produto) => ({
      nome: produto.nome,
      foto: produto.foto,
      preco: moeda(precoAPartirDe(produto), confeiteira.moeda),
    })),
  }));

  return (
    <div className="overflow-hidden">
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <div className="flex items-center gap-5 text-sm">
            <Link href="/precos" className="text-suave hover:text-texto">
              {t.comum.precos}
            </Link>
            <Link href="/dashboard" className="text-suave hover:text-texto">
              {t.comum.painel}
            </Link>
            <Link
              href={`/${lojas[0].confeiteira.slug}`}
              className="rounded-full bg-marca px-4 py-2 text-white"
            >
              {t.comum.verExemplo}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="inline-block rounded-full bg-marca-suave px-3.5 py-1.5 text-xs text-marca">
              {t.home.aviso}
            </p>
            <h1 className="mt-6 text-[2.6rem] leading-[1.1] sm:text-[3.4rem]">
              {t.home.titulo}{" "}
              <span className="text-marca">{t.home.tituloDestaque}</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-suave">
              {t.home.subtitulo}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${lojas[0].confeiteira.slug}`}
                className="rounded-full bg-marca px-7 py-3.5 text-white"
              >
                {t.home.verPagina}
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-borda bg-cartao px-7 py-3.5"
              >
                {t.home.entrarPainel}
              </Link>
            </div>
          </div>

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
              <p className="text-suave">{t.home.resumoBolo}</p>
              <dl className="mt-3 space-y-1.5 text-suave">
                <div className="flex justify-between">
                  <dt>Red velvet</dt>
                  <dd>+ 8,00 €</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Nutella + ninho</dt>
                  <dd>+ 13,00 €</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Drip</dt>
                  <dd>+ 7,00 €</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-baseline justify-between border-t border-borda pt-3">
                <span className="text-suave">{t.home.total}</span>
                <span className="font-titulo text-lg text-texto">110,00 €</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-borda bg-cartao">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
            {t.home.passos.map((passo, i) => (
              <div key={passo.titulo}>
                <span className="font-titulo text-3xl text-marca/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-titulo text-xl">{passo.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-suave">
                  {passo.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-marca" />
              <span className="text-xs tracking-[0.18em] text-suave uppercase">
                {t.home.camadasRotulo}
              </span>
            </div>
            <h2 className="mt-6 max-w-2xl font-titulo text-3xl leading-snug sm:text-[2.6rem]">
              {t.home.camadasTitulo}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-suave">
              {t.home.camadasAjuda}
            </p>

            <div className="mt-12">
              <Camadas camadas={areas} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid items-center gap-10 rounded-[2.5rem] bg-marca-suave p-10 sm:p-14 lg:grid-cols-2">
            <div>
              <h2 className="font-titulo text-3xl leading-snug">
                {t.home.aceiteTitulo}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-suave">
                {t.home.aceiteTexto}
              </p>
            </div>
            <div className="rounded-3xl border border-borda bg-cartao p-7">
              <p className="text-sm text-suave">Juliana Prado · ENC-104</p>
              <p className="mt-1.5 font-titulo text-lg">Bolo de festa · Médio</p>
              <p className="mt-1 text-xs text-suave">
                red velvet · ninho + Nutella · drip
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-marca px-5 py-2.5 text-sm text-white">
                  {t.home.aceitarPedido}
                </span>
                <span className="rounded-full border border-borda px-5 py-2.5 text-sm">
                  {t.home.recusar}
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-suave">
                <Icone nome="confirmado" className="h-4 w-4" />
                {t.home.aceiteNota}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-marca" />
            <span className="text-xs tracking-[0.18em] text-suave uppercase">
              {t.home.vitrineRotulo}
            </span>
          </div>
          <h2 className="mt-6 max-w-2xl font-titulo text-3xl leading-snug sm:text-[2.6rem]">
            {t.home.vitrineTitulo}
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-suave">
            {t.home.vitrineTexto}
          </p>

          <div className="mt-10">
            <VitrineTema vitrines={vitrines} />
          </div>
        </section>

        <section className="border-t border-borda bg-cartao">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="mx-auto max-w-lg font-titulo text-3xl leading-snug">
              {t.home.chamadaTitulo}
            </h2>
            <Link
              href={`/${lojas[0].confeiteira.slug}`}
              className="mt-9 inline-block rounded-full bg-marca px-8 py-4 text-white"
            >
              {t.home.chamadaBotao}
            </Link>
          </div>
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
