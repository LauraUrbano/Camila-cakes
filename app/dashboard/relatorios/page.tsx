import { lojaPrincipal } from "@/lib/dados";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { moeda } from "@/lib/precos";
import type { Pedido, StatusPedido } from "@/lib/tipos";
import { Barras, Colunas, Tabela } from "./graficos";

const { confeiteira, pedidos, historico } = lojaPrincipal;
const fmt = (valor: number) => moeda(valor, confeiteira.moeda);

function total(pedido: Pedido) {
  return (
    pedido.itens.reduce((soma, item) => soma + item.total, 0) +
    pedido.entrega.taxa
  );
}

const ordemEstados: StatusPedido[] = [
  "aguardando",
  "aceito",
  "producao",
  "entregue",
  "recusado",
];

export default async function Relatorios() {
  const d = await dicionarioActual();
  const r = d.painel.relatorios;
  const rotulosEstado = {
    aguardando: d.painel.pedidos.filtroAguardando,
    aceito: d.painel.pedidos.filtroAceite,
    producao: d.painel.pedidos.filtroProducao,
    entregue: d.painel.pedidos.filtroEntregue,
    recusado: d.painel.pedidos.filtroRecusado,
  };

  const fechados = pedidos.filter((pedido) =>
    ["aceito", "producao", "entregue"].includes(pedido.status),
  );
  const decididos = pedidos.filter((pedido) => pedido.status !== "aguardando");
  const recusados = pedidos.filter((pedido) => pedido.status === "recusado");

  const receita = fechados.reduce((soma, pedido) => soma + total(pedido), 0);
  const comValor = fechados.filter((pedido) => pedido.itens.length > 0);
  const ticket = comValor.length > 0 ? receita / comValor.length : 0;
  const taxaAceite =
    decididos.length > 0
      ? Math.round(((decididos.length - recusados.length) / decididos.length) * 100)
      : 0;

  // Quantas vezes cada produto foi pedido, para o ranking.
  const contagem = new Map<string, number>();
  for (const pedido of pedidos) {
    for (const item of pedido.itens) {
      contagem.set(item.produtoNome, (contagem.get(item.produtoNome) ?? 0) + 1);
    }
  }
  const ranking = [...contagem.entries()]
    .map(([rotulo, valor]) => ({ rotulo, valor }))
    .sort((a, b) => b.valor - a.valor);

  const porEstado = ordemEstados.map((id) => ({
    id,
    rotulo: rotulosEstado[id],
    quantos: pedidos.filter((pedido) => pedido.status === id).length,
  }));
  const maiorEstado = Math.max(...porEstado.map((e) => e.quantos));

  const crescimento =
    historico.length > 1
      ? Math.round(
          ((historico.at(-1)!.receita - historico.at(-2)!.receita) /
            historico.at(-2)!.receita) *
            100,
        )
      : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl">{r.titulo}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {r.subtitulo}
      </p>

      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-8">
        <p className="text-sm text-suave">{r.receita}</p>
        <p className="mt-2 text-5xl">{fmt(receita)}</p>
        <p className="mt-3 text-sm text-suave">
          {comValor.length} {r.encomendasAceites} ·{" "}
          <span className={crescimento >= 0 ? "text-marca" : ""}>
            {crescimento >= 0 ? "+" : ""}
            {crescimento}%
          </span>{" "}
          {r.faceMesAnterior}
        </p>
      </section>

      <section className="mt-5 grid gap-5 sm:grid-cols-3">
        {[
          { rotulo: r.ticket, valor: fmt(ticket), nota: r.ticketNota },
          {
            rotulo: r.taxaAceite,
            valor: `${taxaAceite}%`,
            nota: `${recusados.length} ${r.recusadas}`,
          },
          {
            rotulo: r.encomendas,
            valor: String(pedidos.length),
            nota: r.desdeInicio,
          },
        ].map((cartao) => (
          <div
            key={cartao.rotulo}
            className="rounded-3xl border border-borda bg-cartao p-6"
          >
            <p className="text-xs text-suave">{cartao.rotulo}</p>
            <p className="mt-2 text-2xl">{cartao.valor}</p>
            <p className="mt-1 text-xs text-suave">{cartao.nota}</p>
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">{r.receitaMes}</h2>
        <p className="mt-1.5 text-sm text-suave">{r.ultimosSeis}</p>
        <div className="mt-8">
          <Colunas
            dados={historico.map((mes) => ({
              rotulo: mes.mes,
              valor: mes.receita,
            }))}
            codigo={confeiteira.moeda}
          />
        </div>
        <Tabela
          cabecalhos={[r.mes, r.receita, r.encomendas]}
          linhas={historico.map((mes) => [
            mes.mes,
            fmt(mes.receita),
            String(mes.encomendas),
          ])}
        />
      </section>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">{r.maisSai}</h2>
          <p className="mt-1.5 text-sm text-suave">{r.porEncomendas}</p>
          <div className="mt-6">
            <Barras dados={ranking} />
          </div>
        </section>

        <section className="rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">{r.emQuePe}</h2>
          <p className="mt-1.5 text-sm text-suave">{r.todasEncomendas}</p>
          <ul className="mt-6 space-y-4">
            {porEstado.map((estado) => (
              <li key={estado.id}>
                <div className="flex justify-between text-sm">
                  <span>{estado.rotulo}</span>
                  <span className="tabular-nums text-suave">
                    {estado.quantos}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-borda">
                  <div
                    className="h-full rounded-full bg-marca"
                    style={{
                      width: `${(estado.quantos / maiorEstado) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
