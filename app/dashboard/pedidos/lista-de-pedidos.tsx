"use client";

import { useMemo, useState } from "react";
import Icone from "@/app/icones";
import { moeda } from "@/lib/precos";
import type { Moeda, Pedido, StatusPedido } from "@/lib/tipos";

const POR_PAGINA = 6;

const rotulos: Record<StatusPedido, string> = {
  aguardando: "aguarda aceite",
  aceito: "aceite",
  producao: "em produção",
  entregue: "entregue",
  recusado: "recusado",
};

/** A bolinha ao lado do nome dá o estado sem ocupar espaço na lista. */
const pontos: Record<StatusPedido, string> = {
  aguardando: "bg-marca",
  aceito: "bg-marca/50",
  producao: "bg-marca/50",
  entregue: "bg-borda",
  recusado: "bg-borda",
};

const filtros: { id: StatusPedido | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "aguardando", rotulo: "Aguardam aceite" },
  { id: "aceito", rotulo: "Aceites" },
  { id: "producao", rotulo: "Em produção" },
  { id: "entregue", rotulo: "Entregues" },
  { id: "recusado", rotulo: "Recusados" },
];

function total(pedido: Pedido) {
  return (
    pedido.itens.reduce((soma, item) => soma + item.total, 0) +
    pedido.entrega.taxa
  );
}

function resumo(pedido: Pedido) {
  if (pedido.personalizado) return "Pedido personalizado";
  return pedido.itens.map((item) => item.produtoNome).join(", ");
}

export default function ListaDePedidos({
  iniciais,
  codigo,
}: {
  iniciais: Pedido[];
  codigo: Moeda;
}) {
  const [lista, setLista] = useState(iniciais);
  const [filtro, setFiltro] = useState<StatusPedido | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [aberto, setAberto] = useState(iniciais[0]?.id ?? "");

  const fmt = (valor: number) => moeda(valor, codigo);

  const filtrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();
    return lista.filter((pedido) => {
      const porEstado = filtro === "todos" || pedido.status === filtro;
      const porTexto =
        texto === "" ||
        pedido.cliente.toLowerCase().includes(texto) ||
        pedido.id.toLowerCase().includes(texto);
      return porEstado && porTexto;
    });
  }, [lista, filtro, busca]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  // Filtrar pode encurtar a lista: nesse caso a página atual deixa de existir.
  const paginaAtual = Math.min(pagina, paginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA,
  );

  const pedido = lista.find((item) => item.id === aberto) ?? visiveis[0];
  const aguardando = lista.filter((item) => item.status === "aguardando");

  function mudarStatus(id: string, status: StatusPedido) {
    setLista((atual) =>
      atual.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  function trocarFiltro(id: StatusPedido | "todos") {
    setFiltro(id);
    setPagina(1);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Pedidos</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
            Um pedido enviado pelo site é só uma reserva. Entra na tua agenda
            quando o aceitas — normalmente depois de combinar o pagamento.
          </p>
        </div>
        {aguardando.length > 0 && (
          <p className="rounded-full bg-marca-suave px-4 py-2 text-sm text-marca">
            {aguardando.length}{" "}
            {aguardando.length === 1 ? "à espera" : "à espera de aceite"}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {filtros.map((item) => {
          const activo = filtro === item.id;
          const quantos =
            item.id === "todos"
              ? lista.length
              : lista.filter((pedido) => pedido.status === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => trocarFiltro(item.id)}
              aria-pressed={activo}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                activo
                  ? "border-marca bg-marca-suave text-marca"
                  : "border-borda bg-cartao text-suave hover:border-marca"
              }`}
            >
              {item.rotulo}
              <span className="ml-1.5 text-xs opacity-60">{quantos}</span>
            </button>
          );
        })}

        <input
          value={busca}
          onChange={(evento) => {
            setBusca(evento.target.value);
            setPagina(1);
          }}
          placeholder="Procurar por nome ou número"
          className="ml-auto w-full rounded-full border border-borda bg-cartao px-4 py-2 text-sm outline-none focus:border-marca sm:w-64"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[19rem_1fr]">
        <div>
          <ul className="divide-y divide-borda overflow-hidden rounded-3xl border border-borda bg-cartao">
            {visiveis.map((item) => {
              const activo = pedido?.id === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setAberto(item.id)}
                    aria-current={activo}
                    className={`w-full px-5 py-4 text-left transition ${
                      activo ? "bg-marca-suave" : "hover:bg-fundo"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${pontos[item.status]}`}
                      />
                      <span className="truncate text-sm font-medium">
                        {item.cliente}
                      </span>
                      <span className="ml-auto shrink-0 text-sm text-suave">
                        {item.itens.length === 0 ? "—" : fmt(total(item))}
                      </span>
                    </span>
                    <span className="mt-1.5 flex justify-between gap-2 pl-3.5 text-xs text-suave">
                      <span className="truncate">{resumo(item)}</span>
                      <span className="shrink-0">{item.entregaEm}</span>
                    </span>
                  </button>
                </li>
              );
            })}

            {visiveis.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-suave">
                Nenhum pedido com esse filtro.
              </li>
            )}
          </ul>

          {filtrados.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-suave">
                {(paginaAtual - 1) * POR_PAGINA + 1}–
                {Math.min(paginaAtual * POR_PAGINA, filtrados.length)} de{" "}
                {filtrados.length}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  className="rounded-full border border-borda bg-cartao px-3 py-1.5 disabled:opacity-35"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setPagina(paginaAtual + 1)}
                  disabled={paginaAtual === paginas}
                  className="rounded-full border border-borda bg-cartao px-3 py-1.5 disabled:opacity-35"
                >
                  →
                </button>
              </span>
            </div>
          )}
        </div>

        {pedido ? (
          <article className="h-fit rounded-3xl border border-borda bg-cartao">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-borda p-7">
              <div>
                <h2 className="font-titulo text-xl">{pedido.cliente}</h2>
                <p className="mt-1.5 text-xs text-suave">
                  {pedido.id} · pedido em {pedido.criadoEm} · {pedido.telefone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg">
                  {pedido.itens.length === 0 ? "a orçar" : fmt(total(pedido))}
                </p>
                <p className="mt-0.5 text-xs text-suave">
                  entrega {pedido.entregaEm}
                </p>
              </div>
            </header>

            <div className="flex items-center gap-2 border-b border-borda px-7 py-4">
              <span
                className={`h-1.5 w-1.5 rounded-full ${pontos[pedido.status]}`}
              />
              <span className="text-sm">{rotulos[pedido.status]}</span>
              {pedido.status === "aguardando" && (
                <span className="text-xs text-suave">
                  · a data ainda não está reservada
                </span>
              )}
            </div>

            <div className="space-y-5 p-7 text-sm">
              {pedido.personalizado && (
                <p className="rounded-2xl bg-marca-suave p-5 leading-relaxed">
                  <span className="mb-1.5 block text-xs text-marca">
                    pedido personalizado
                  </span>
                  {pedido.personalizado}
                </p>
              )}

              {pedido.itens.map((item, indice) => (
                <div key={indice} className="rounded-2xl bg-fundo p-5">
                  <div className="flex justify-between gap-4">
                    <p className="font-medium">
                      {item.produtoNome} · {item.tamanhoNome}
                    </p>
                    <p className="shrink-0 text-suave">{fmt(item.total)}</p>
                  </div>
                  <dl className="mt-3 space-y-1.5 text-xs text-suave">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0">Massa</dt>
                      <dd>{item.massaNome}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0">Recheio</dt>
                      <dd>{item.recheiosNomes.join(", ")}</dd>
                    </div>
                    {item.decoracoesNomes.length > 0 && (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0">Decoração</dt>
                        <dd>{item.decoracoesNomes.join(", ")}</dd>
                      </div>
                    )}
                  </dl>
                  {item.observacao && (
                    <p className="mt-3 border-l-2 border-borda pl-3 text-xs leading-relaxed text-suave italic">
                      {item.observacao}
                    </p>
                  )}
                </div>
              ))}

              <p className="flex items-center gap-2 text-xs text-suave">
                <Icone
                  nome={
                    pedido.entrega.tipo === "retirada"
                      ? "levantamento"
                      : "entrega"
                  }
                  className="h-4 w-4"
                />
                {pedido.entrega.nome} ·{" "}
                {pedido.entrega.taxa === 0
                  ? "sem taxa"
                  : fmt(pedido.entrega.taxa)}
              </p>
            </div>

            <footer className="flex flex-wrap items-center gap-3 border-t border-borda bg-fundo p-7">
              {pedido.status === "aguardando" && (
                <>
                  <button
                    type="button"
                    onClick={() => mudarStatus(pedido.id, "aceito")}
                    className="rounded-full bg-marca px-5 py-2.5 text-sm text-white"
                  >
                    Aceitar pedido
                  </button>
                  <button
                    type="button"
                    onClick={() => mudarStatus(pedido.id, "recusado")}
                    className="rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm"
                  >
                    Recusar
                  </button>
                  <span className="text-xs text-suave">
                    aceitar reserva a data na tua agenda
                  </span>
                </>
              )}
              {pedido.status === "aceito" && (
                <button
                  type="button"
                  onClick={() => mudarStatus(pedido.id, "producao")}
                  className="rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm"
                >
                  Marcar como em produção
                </button>
              )}
              {pedido.status === "producao" && (
                <button
                  type="button"
                  onClick={() => mudarStatus(pedido.id, "entregue")}
                  className="rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm"
                >
                  Marcar como entregue
                </button>
              )}
              {["entregue", "recusado"].includes(pedido.status) && (
                <span className="text-xs text-suave">Pedido encerrado.</span>
              )}
            </footer>
          </article>
        ) : (
          <div className="grid h-64 place-items-center rounded-3xl border border-borda bg-cartao text-sm text-suave">
            Escolha um pedido à esquerda.
          </div>
        )}
      </div>
    </div>
  );
}
