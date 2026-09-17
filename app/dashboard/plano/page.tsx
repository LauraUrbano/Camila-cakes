import Link from "next/link";
import Icone from "@/app/icones";
import { lojaPrincipal, planoPorId, planos } from "@/lib/dados";
import { moeda } from "@/lib/precos";
import type { EstadoAssinatura } from "@/lib/tipos";

const { confeiteira, produtos, colecoes, assinatura } = lojaPrincipal;
const codigo = confeiteira.moeda;
const plano = planoPorId(assinatura.planoId)!;

const estados: Record<EstadoAssinatura, string> = {
  teste: "em experimentação",
  activa: "activa",
  pagamento_falhou: "pagamento falhou",
  cancelada: "cancelada",
};

export default function PaginaDoPlano() {
  const valor = plano[assinatura.periodo][codigo];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl">Plano e faturação</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        O que pagas pela plataforma. Não se confunde com o que recebes das
        tuas clientes — esse dinheiro nunca passa por aqui.
      </p>

      <section className="mt-8 rounded-3xl border border-marca bg-cartao p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-titulo text-xl">Plano {plano.nome}</h2>
              <span className="rounded-full bg-marca-suave px-3 py-1 text-[11px] text-marca">
                {estados[assinatura.estado]}
              </span>
            </div>
            <p className="mt-2 text-sm text-suave">{plano.promessa}</p>
          </div>
          <p className="text-right">
            <span className="font-titulo text-3xl">
              {moeda(valor, codigo)}
            </span>
            <span className="block text-xs text-suave">
              por {assinatura.periodo === "mensal" ? "mês" : "ano"}, sem IVA
            </span>
          </p>
        </div>

        <dl className="mt-8 grid gap-6 border-t border-borda pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-suave">Próxima cobrança</dt>
            <dd className="mt-1">{assinatura.renovaEm}</dd>
          </div>
          <div>
            <dt className="text-xs text-suave">Cartão</dt>
            <dd className="mt-1">
              {assinatura.cartao ? `•••• ${assinatura.cartao}` : "nenhum"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-suave">Cobrança</dt>
            <dd className="mt-1 capitalize">{assinatura.periodo}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-marca px-5 py-2.5 text-sm text-white"
          >
            Gerir no Stripe
          </button>
          <Link
            href="/precos"
            className="rounded-full border border-borda px-5 py-2.5 text-sm"
          >
            Ver os planos
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">O que está a usar</h2>
        <ul className="mt-6 space-y-5 text-sm">
          {[
            { rotulo: "Produtos", usado: produtos.length, limite: null },
            { rotulo: "Coleções", usado: colecoes.length, limite: null },
            {
              rotulo: "Encomendas este mês",
              usado: lojaPrincipal.pedidos.length,
              limite: null,
            },
          ].map((linha) => (
            <li key={linha.rotulo} className="flex justify-between gap-4">
              <span>{linha.rotulo}</span>
              <span className="text-suave">
                {linha.usado}{" "}
                {linha.limite === null ? (
                  <span className="text-xs">· sem limite neste plano</span>
                ) : (
                  `de ${linha.limite}`
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">Faturas</h2>
        {assinatura.faturas.length === 0 ? (
          <p className="mt-4 text-sm text-suave">
            Ainda não há faturas — o plano Prova não cobra nada.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-borda text-sm">
            {assinatura.faturas.map((fatura) => (
              <li
                key={fatura.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <span>
                  <span className="block">{fatura.id}</span>
                  <span className="block text-xs text-suave">
                    {fatura.data}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="tabular-nums">
                    {moeda(fatura.valor, codigo)}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-suave">
                    <Icone nome="confirmado" className="h-4 w-4" />
                    {fatura.paga ? "paga" : "por pagar"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-8">
        <h2 className="font-titulo text-lg">Mudar de plano</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {planos.map((outro) => {
            const actual = outro.id === plano.id;
            return (
              <div
                key={outro.id}
                className={`rounded-2xl border p-5 ${
                  actual ? "border-marca bg-marca-suave" : "border-borda"
                }`}
              >
                <p className="font-titulo">{outro.nome}</p>
                <p className="mt-1 text-sm text-suave">
                  {outro.mensal[codigo] === 0
                    ? "grátis"
                    : `${moeda(outro.mensal[codigo], codigo)}/mês`}
                </p>
                <p className="mt-4 text-xs text-suave">
                  {actual ? "é o teu plano" : "trocar para este"}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-suave">
          Ao subir de plano pagas só a diferença do que falta do período. Ao
          descer ou cancelar, a tua página fica no ar até ao fim do período já
          pago.
        </p>
      </section>

      <p className="mt-6 rounded-2xl border border-borda bg-marca-suave p-5 text-sm leading-relaxed">
        <strong>Nada aqui cobra de verdade.</strong> É protótipo: os botões não
        falam com o Stripe e as faturas são de exemplo. A ligação a sério entra
        com as contas e a base de dados.
      </p>
    </div>
  );
}
