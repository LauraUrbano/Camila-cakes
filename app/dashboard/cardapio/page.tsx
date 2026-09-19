import Image from "next/image";
import { lojaPrincipal } from "@/lib/dados";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { moeda, restam } from "@/lib/precos";
import type { Moeda, Opcao } from "@/lib/tipos";

const { confeiteira, produtos } = lojaPrincipal;
const codigo: Moeda = confeiteira.moeda;

function Opcoes({
  titulo,
  lista,
  incluido,
}: {
  titulo: string;
  lista: Opcao[];
  incluido: string;
}) {
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
                ? incluido
                : `+ ${moeda(opcao.acrescimo, codigo)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PaginaDoCardapio() {
  const c = (await dicionarioActual()).painel.cardapio;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">{c.titulo}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {c.subtitulo}
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
                      {produto.categoria} · {produto.antecedenciaDias}{" "}
                      {c.diasAntecedencia}
                    </span>
                  </span>
                </div>
                {sobrando !== null && (
                  <span className="rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
                    {c.limite}: {produto.limite!.vendidos}/
                    {produto.limite!.total}
                  </span>
                )}
              </div>

              <div className="border-b border-borda p-5">
                <p className="text-xs font-medium text-suave">
                  {c.tamanhosNota}
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
                        {c.ate} {tamanho.maxRecheios}{" "}
                        {tamanho.maxRecheios === 1 ? c.recheio : c.recheios}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:grid-cols-3">
                <Opcoes
                  titulo={c.massas}
                  lista={produto.massas}
                  incluido={c.incluido}
                />
                <Opcoes
                  titulo={c.recheiosTitulo}
                  lista={produto.recheios}
                  incluido={c.incluido}
                />
                <Opcoes
                  titulo={`${c.decoracoes} (${c.ate} ${produto.maxDecoracoes})`}
                  lista={produto.decoracoes}
                  incluido={c.incluido}
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
