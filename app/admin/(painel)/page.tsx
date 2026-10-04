import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { metricasDaPlataforma } from "@/lib/bd/admin";
import { moeda } from "@/lib/precos";
import { Barras, Colunas } from "@/app/dashboard/relatorios/graficos";

const nomeDoPlano: Record<string, string> = {
  prova: "Prova",
  atelier: "Atelier",
  pastelaria: "Pastelaria",
};

export default async function Metricas() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }

  const m = await metricasDaPlataforma(executorNeon());
  const taxaAceite =
    m.pedidos.aceites + m.pedidos.recusados > 0
      ? Math.round(
          (m.pedidos.aceites / (m.pedidos.aceites + m.pedidos.recusados)) * 100,
        )
      : 0;

  const mesCurto = (iso: string) =>
    new Date(`${iso}-01T00:00:00Z`).toLocaleDateString("pt-PT", {
      month: "short",
    });

  return (
    <div>
      <h1 className="text-2xl">Métricas</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        A plataforma inteira, não uma confeitaria.
      </p>

      {/* A receita recorrente aparece separada por moeda de propósito: somar
          euros com reais daria um número que não existe. */}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {m.recorrentePorMoeda.length === 0 ? (
          <div className="rounded-3xl border border-borda bg-cartao p-6 sm:col-span-2">
            <p className="text-xs text-suave">Receita recorrente</p>
            <p className="mt-2 text-2xl">—</p>
            <p className="mt-1 text-xs text-suave">
              ainda ninguém paga pelo Stripe
            </p>
          </div>
        ) : (
          m.recorrentePorMoeda.map((r) => (
            <div
              key={r.moeda}
              className="rounded-3xl border border-marca bg-cartao p-6"
            >
              <p className="text-xs text-suave">Recorrente por mês</p>
              <p className="mt-2 text-2xl">{moeda(r.mensal, r.moeda)}</p>
              <p className="mt-1 text-xs text-suave">
                {r.contas} {r.contas === 1 ? "conta" : "contas"} a pagar
              </p>
            </div>
          ))
        )}

        {[
          {
            rotulo: "Contas",
            valor: String(m.contas.total),
            nota: `${m.contas.activas} activas · ${m.contas.suspensas} suspensas`,
          },
          {
            rotulo: "Encomendas este mês",
            valor: String(m.pedidos.mes),
            nota: `${m.pedidos.total} desde o início`,
          },
          {
            rotulo: "Taxa de aceite",
            valor: `${taxaAceite}%`,
            nota: `${m.pedidos.recusados} recusadas na plataforma`,
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

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">Contas novas por mês</h2>
          <p className="mt-1.5 text-sm text-suave">Últimos seis meses</p>
          <div className="mt-8">
            <Colunas
              rotulo="Contas novas por mês"
              dados={m.novasContasPorMes.map((x) => ({
                rotulo: mesCurto(x.mes),
                valor: x.quantas,
              }))}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-borda bg-cartao p-8">
          <h2 className="font-titulo text-lg">Contas por plano</h2>
          <p className="mt-1.5 text-sm text-suave">Só contas activas</p>
          <div className="mt-6">
            <Barras
              rotulo="Contas por plano"
              dados={m.porPlano.map((x) => ({
                rotulo: nomeDoPlano[x.planoId] ?? x.planoId,
                valor: x.quantas,
              }))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
