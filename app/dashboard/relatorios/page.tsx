import { lojaPrincipal } from "@/lib/dados";
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

const estados: { id: StatusPedido; rotulo: string }[] = [
  { id: "aguardando", rotulo: "Aguardam aceite" },
  { id: "aceito", rotulo: "Aceites" },
  { id: "producao", rotulo: "Em produção" },
  { id: "entregue", rotulo: "Entregues" },
  { id: "recusado", rotulo: "Recusados" },
];

export default function Relatorios() {
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

  const porEstado = estados.map((estado) => ({
    ...estado,
    quantos: pedidos.filter((pedido) => pedido.status === estado.id).length,
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
      <h1 className="text-2xl">Relatórios</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        O que já foi aceite, o que se vende mais e como o mês está a correr.
        Pedidos à espera de aceite não contam como receita.
      </p>

      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-8">
        <p className="text-sm text-suave">Receita confirmada</p>
        <p className="mt-2 text-5xl">{fmt(receita)}</p>
        <p className="mt-3 text-sm text-suave">
          {comValor.length} encomendas aceites ·{" "}
          <span className={crescimento >= 0 ? "text-marca" : ""}>
            {crescimento >= 0 ? "+" : ""}
            {crescimento}%
          </span>{" "}
          face ao mês anterior
        </p>
      </section>

      <section className="mt-5 grid gap-5 sm:grid-cols-3">
        {[
          { rotulo: "Ticket médio", valor: fmt(ticket), nota: "por encomenda" },
          {
            rotulo: "Taxa de aceite",
            valor: `${taxaAceite}%`,
            nota: `${recusados.length} recusadas`,
          },
          {
            rotulo: "Encomendas",
            valor: String(pedidos.length),
            nota: "desde o início",
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
        <h2 className="font-titulo text-lg">Receita por mês</h2>
        <p className="mt-1.5 text-sm text-suave">Últimos seis meses fechados</p>
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
          cabecalhos={["Mês", "Receita", "Encomendas"]}
          linhas={historico.map((mes) => [
            mes.mes,
            fmt(mes.receita),
            String(mes.encomendas),
          ])}
        />
      </section>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">O que mais sai</h2>
          <p className="mt-1.5 text-sm text-suave">Por número de encomendas</p>
          <div className="mt-6">
            <Barras dados={ranking} />
          </div>
        </section>

        <section className="rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">Em que pé estão</h2>
          <p className="mt-1.5 text-sm text-suave">Todas as encomendas</p>
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
