"use client";

import { useState } from "react";
import { moeda } from "@/lib/precos";
import type { Moeda, Pedido, StatusPedido } from "@/lib/tipos";

const rotulos: Record<StatusPedido, { texto: string; classe: string }> = {
  aguardando: {
    texto: "aguardando aceite",
    classe: "bg-marca text-white",
  },
  aceito: { texto: "aceito", classe: "bg-marca-suave text-marca" },
  producao: { texto: "em produção", classe: "bg-marca-suave text-marca" },
  entregue: { texto: "entregue", classe: "bg-borda text-suave" },
  recusado: { texto: "recusado", classe: "bg-borda text-suave" },
};

function total(pedido: Pedido) {
  return (
    pedido.itens.reduce((soma, item) => soma + item.total, 0) +
    pedido.entrega.taxa
  );
}

export default function ListaDePedidos({
  iniciais,
  codigo,
}: {
  iniciais: Pedido[];
  codigo: Moeda;
}) {
  const [lista, setLista] = useState(iniciais);
  const fmt = (valor: number) => moeda(valor, codigo);

  function mudarStatus(id: string, status: StatusPedido) {
    setLista((atual) =>
      atual.map((pedido) => (pedido.id === id ? { ...pedido, status } : pedido)),
    );
  }

  const aguardando = lista.filter((pedido) => pedido.status === "aguardando");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        Um pedido enviado pelo site é só uma reserva. Ele entra na sua agenda
        quando você aceita — normalmente depois de combinar o pagamento com a
        cliente.
      </p>

      {aguardando.length > 0 && (
        <p className="mt-6 rounded-xl border border-marca bg-marca-suave px-5 py-4 text-sm">
          <strong>{aguardando.length}</strong>{" "}
          {aguardando.length === 1
            ? "pedido ainda não foi aceito"
            : "pedidos ainda não foram aceitos"}
          . Enquanto isso, a data não está reservada para ninguém.
        </p>
      )}

      <ul className="mt-8 space-y-5">
        {lista.map((pedido) => {
          const rotulo = rotulos[pedido.status];
          return (
            <li
              key={pedido.id}
              className={`overflow-hidden rounded-2xl border bg-cartao ${
                pedido.status === "aguardando"
                  ? "border-marca"
                  : "border-borda"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-borda p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-titulo font-semibold">
                      {pedido.cliente}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${rotulo.classe}`}
                    >
                      {rotulo.texto}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-suave">
                    {pedido.id} · pedido em {pedido.criadoEm} ·{" "}
                    {pedido.telefone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {pedido.itens.length === 0 ? "a orçar" : fmt(total(pedido))}
                  </p>
                  <p className="text-xs text-suave">
                    entrega {pedido.entregaEm}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5 text-sm">
                {pedido.personalizado && (
                  <p className="rounded-xl bg-marca-suave p-4 leading-relaxed">
                    <span className="mb-1 block text-xs font-medium text-marca">
                      pedido personalizado
                    </span>
                    {pedido.personalizado}
                  </p>
                )}

                {pedido.itens.map((item, indice) => (
                  <div key={indice}>
                    <p className="font-medium">
                      {item.produtoNome} · {item.tamanhoNome}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-suave">
                      massa {item.massaNome} · recheio{" "}
                      {item.recheiosNomes.join(" e ")}
                      {item.decoracoesNomes.length > 0 &&
                        ` · ${item.decoracoesNomes.join(", ")}`}
                    </p>
                    {item.observacao && (
                      <p className="mt-2 text-xs text-suave italic">
                        “{item.observacao}”
                      </p>
                    )}
                  </div>
                ))}

                <p className="text-xs text-suave">
                  {pedido.entrega.nome} ·{" "}
                  {pedido.entrega.taxa === 0
                    ? "sem taxa"
                    : fmt(pedido.entrega.taxa)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-borda bg-fundo p-5">
                {pedido.status === "aguardando" && (
                  <>
                    <button
                      type="button"
                      onClick={() => mudarStatus(pedido.id, "aceito")}
                      className="rounded-full bg-marca px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Aceitar pedido
                    </button>
                    <button
                      type="button"
                      onClick={() => mudarStatus(pedido.id, "recusado")}
                      className="rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm font-medium"
                    >
                      Recusar
                    </button>
                    <span className="self-center text-xs text-suave">
                      aceitar reserva a data na sua agenda
                    </span>
                  </>
                )}
                {pedido.status === "aceito" && (
                  <button
                    type="button"
                    onClick={() => mudarStatus(pedido.id, "producao")}
                    className="rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm font-medium"
                  >
                    Marcar como em produção
                  </button>
                )}
                {pedido.status === "producao" && (
                  <button
                    type="button"
                    onClick={() => mudarStatus(pedido.id, "entregue")}
                    className="rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm font-medium"
                  >
                    Marcar como entregue
                  </button>
                )}
                {["entregue", "recusado"].includes(pedido.status) && (
                  <span className="text-xs text-suave">
                    pedido encerrado
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
