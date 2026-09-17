import Link from "next/link";
import { lojaPrincipal } from "@/lib/dados";
import { moeda, restam } from "@/lib/precos";

function totalDoPedido(itens: { total: number }[], taxa: number) {
  return itens.reduce((soma, item) => soma + item.total, 0) + taxa;
}

const { confeiteira, colecoes, pedidos, produtos } = lojaPrincipal;

export default function VisaoGeral() {
  const aguardando = pedidos.filter((pedido) => pedido.status === "aguardando");
  const naAgenda = pedidos.filter((pedido) =>
    ["aceito", "producao"].includes(pedido.status),
  );
  // Pedido personalizado ainda não tem valor fechado, então fica fora da conta.
  const aReceber = naAgenda
    .filter((pedido) => pedido.itens.length > 0)
    .reduce(
      (soma, pedido) => soma + totalDoPedido(pedido.itens, pedido.entrega.taxa),
      0,
    );
  const acabando = produtos.filter((produto) => {
    const sobrando = restam(produto);
    return sobrando !== null && sobrando <= 10;
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Visão geral</h1>
      <p className="mt-2 text-sm text-suave">Bom dia, Camila 👋</p>

      {aguardando.length > 0 && (
        <Link
          href="/dashboard/pedidos"
          className="mt-8 block rounded-2xl border border-marca bg-marca-suave p-6 transition hover:opacity-90"
        >
          <p className="font-titulo text-lg font-semibold">
            {aguardando.length}{" "}
            {aguardando.length === 1
              ? "pedido à espera do teu aceite"
              : "pedidos à espera do teu aceite"}
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Nenhum deles está na tua agenda ainda. Combina o pagamento com a
            cliente e aceita para reservar a data. →
          </p>
        </Link>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {[
          { rotulo: "Na agenda", valor: String(naAgenda.length), nota: "pedidos aceitos" },
          { rotulo: "A receber", valor: moeda(aReceber, confeiteira.moeda), nota: "pedidos em aberto" },
          {
            rotulo: "Coleções ativas",
            valor: String(colecoes.filter((colecao) => colecao.ativa).length),
            nota: "no ar agora",
          },
        ].map((cartao) => (
          <div
            key={cartao.rotulo}
            className="rounded-3xl border border-borda bg-cartao p-5"
          >
            <p className="text-xs text-suave">{cartao.rotulo}</p>
            <p className="mt-2 text-2xl font-semibold">{cartao.valor}</p>
            <p className="mt-1 text-xs text-suave">{cartao.nota}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-titulo text-lg font-semibold">Próximas entregas</h2>
        <ul className="mt-4 divide-y divide-borda overflow-hidden rounded-3xl border border-borda bg-cartao">
          {naAgenda.map((pedido) => (
            <li key={pedido.id} className="flex items-center justify-between gap-4 p-5">
              <span>
                <span className="block font-medium">{pedido.cliente}</span>
                <span className="block text-xs text-suave">
                  {pedido.personalizado
                    ? "pedido personalizado"
                    : pedido.itens.map((item) => item.produtoNome).join(", ")}{" "}
                  · {pedido.entrega.nome}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-medium">
                  {pedido.entregaEm}
                </span>
                <span className="block text-xs text-suave">
                  {pedido.status === "producao" ? "em produção" : "aceito"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {acabando.length > 0 && (
        <section className="mt-10">
          <h2 className="font-titulo text-lg font-semibold">
            Produção acabando
          </h2>
          <ul className="mt-4 space-y-3">
            {acabando.map((produto) => {
              const sobrando = restam(produto) ?? 0;
              const feitos = produto.limite!.vendidos;
              const total = produto.limite!.total;
              return (
                <li
                  key={produto.id}
                  className="rounded-3xl border border-borda bg-cartao p-5"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{produto.nome}</span>
                    <span className="text-suave">
                      {feitos} de {total} vendidos
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-borda">
                    <div
                      className="h-full rounded-full bg-marca"
                      style={{ width: `${(feitos / total) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-suave">
                    {sobrando === 0
                      ? "esgotado — saiu do cardápio"
                      : `restam ${sobrando} · sai do ar sozinho ao zerar`}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
