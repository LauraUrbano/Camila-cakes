import Image from "next/image";
import { lojaPrincipal } from "@/lib/dados";
import { moeda, restam } from "@/lib/precos";
import type { Moeda, Opcao } from "@/lib/tipos";

const { confeiteira, produtos } = lojaPrincipal;
const codigo: Moeda = confeiteira.moeda;

function Opcoes({ titulo, lista }: { titulo: string; lista: Opcao[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-suave">{titulo}</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {lista.map((opcao) => (
          <li key={opcao.id} className="flex justify-between gap-3">
            <span className={opcao.disponivel ? "" : "text-suave line-through"}>
              {opcao.nome}
            </span>
            <span className="shrink-0 text-suave">
              {opcao.acrescimo === 0
                ? "incluído"
                : `+ ${moeda(opcao.acrescimo, codigo)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PaginaDoCardapio() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Cardápio</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        O preço não é digitado item por item: defines o preço de cada tamanho
        e o acréscimo de cada massa, recheio e decoração. A soma da combinação
        que a tua cliente montar sai sozinha.
      </p>

      <div className="mt-8 space-y-6">
        {produtos.map((produto) => {
          const sobrando = restam(produto);
          return (
            <section
              key={produto.id}
              className="overflow-hidden rounded-2xl border border-borda bg-cartao"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borda p-5">
                <div className="flex items-center gap-4">
                  <span
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"
                    style={{ background: produto.cor }}
                  >
                    <Image
                      src={produto.foto}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="block font-titulo font-semibold">
                      {produto.nome}
                    </span>
                    <span className="block text-xs text-suave">
                      {produto.categoria} · {produto.antecedenciaDias} dias de
                      antecedência
                    </span>
                  </span>
                </div>
                {sobrando !== null && (
                  <span className="rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
                    limite: {produto.limite!.vendidos}/{produto.limite!.total}
                  </span>
                )}
              </div>

              <div className="border-b border-borda p-5">
                <p className="text-xs font-medium text-suave">
                  Tamanhos — cada um define o preço de partida e quantos
                  recheios cabem
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {produto.tamanhos.map((tamanho) => (
                    <div
                      key={tamanho.id}
                      className="rounded-xl border border-borda p-4"
                    >
                      <p className="text-sm font-medium">{tamanho.nome}</p>
                      <p className="mt-0.5 text-xs text-suave">
                        {tamanho.porcoes}
                      </p>
                      <p className="mt-2 font-semibold">
                        {moeda(tamanho.preco, codigo)}
                      </p>
                      <p className="mt-1 text-xs text-suave">
                        até {tamanho.maxRecheios}{" "}
                        {tamanho.maxRecheios === 1 ? "recheio" : "recheios"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:grid-cols-3">
                <Opcoes titulo="Massas" lista={produto.massas} />
                <Opcoes titulo="Recheios" lista={produto.recheios} />
                <Opcoes
                  titulo={`Decorações (até ${produto.maxDecoracoes})`}
                  lista={produto.decoracoes}
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
