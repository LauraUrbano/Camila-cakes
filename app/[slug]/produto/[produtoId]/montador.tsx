"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calcular, moeda, restam, vagasDeRecheio } from "@/lib/precos";
import type { Selecao } from "@/lib/precos";
import type { Confeiteira, Moeda, Opcao, Produto } from "@/lib/tipos";

type Props = {
  produto: Produto;
  confeiteira: Confeiteira;
  slug: string;
};

function Etiqueta({ opcao, codigo }: { opcao: Opcao; codigo: Moeda }) {
  if (!opcao.disponivel)
    return <span className="text-xs text-suave">em falta</span>;
  if (opcao.acrescimo === 0)
    return <span className="text-xs text-suave">incluído</span>;
  return (
    <span className="text-xs text-marca">+ {moeda(opcao.acrescimo, codigo)}</span>
  );
}

function Escolha({
  opcao,
  marcada,
  bloqueada,
  codigo,
  aoClicar,
}: {
  opcao: Opcao;
  marcada: boolean;
  bloqueada: boolean;
  codigo: Moeda;
  aoClicar: () => void;
}) {
  const inativa = !opcao.disponivel || (bloqueada && !marcada);

  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={inativa}
      aria-pressed={marcada}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
        marcada
          ? "border-marca bg-marca-suave"
          : inativa
            ? "cursor-not-allowed border-borda bg-cartao opacity-45"
            : "border-borda bg-cartao hover:border-marca"
      }`}
    >
      <span className="font-medium">{opcao.nome}</span>
      <Etiqueta opcao={opcao} codigo={codigo} />
    </button>
  );
}

export default function Montador({ produto, confeiteira, slug }: Props) {
  const fmt = (valor: number) => moeda(valor, confeiteira.moeda);

  const [selecao, setSelecao] = useState<Selecao>({
    tamanhoId: produto.tamanhos[0].id,
    massaId: "",
    recheioIds: [],
    decoracaoIds: [],
  });
  const [entregaId, setEntregaId] = useState(confeiteira.entregas[0].id);
  const [observacao, setObservacao] = useState("");
  const [enviado, setEnviado] = useState(false);

  const tamanho = produto.tamanhos.find((t) => t.id === selecao.tamanhoId);
  const entrega = confeiteira.entregas.find((e) => e.id === entregaId)!;
  const orcamento = useMemo(
    () => calcular(produto, selecao),
    [produto, selecao],
  );
  const vagas = vagasDeRecheio(tamanho, selecao.recheioIds.length);
  const sobrando = restam(produto);
  const totalComEntrega = orcamento.total + entrega.taxa;

  function trocarTamanho(id: string) {
    const novo = produto.tamanhos.find((t) => t.id === id);
    setSelecao((atual) => ({
      ...atual,
      tamanhoId: id,
      // Trocar de tamanho pode reduzir quantos recheios cabem: corta o excesso.
      recheioIds: atual.recheioIds.slice(0, novo?.maxRecheios ?? 0),
    }));
  }

  function alternar(campo: "recheioIds" | "decoracaoIds", id: string, limite: number) {
    setSelecao((atual) => {
      const atuais = atual[campo];
      if (atuais.includes(id)) {
        return { ...atual, [campo]: atuais.filter((item) => item !== id) };
      }
      if (atuais.length >= limite) return atual;
      return { ...atual, [campo]: [...atuais, id] };
    });
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <span className="text-5xl">📨</span>
        <h1 className="mt-6 text-2xl font-semibold">Pedido enviado</h1>
        <p className="mt-3 leading-relaxed text-suave">
          {confeiteira.nome} recebeu sua reserva e vai te chamar no WhatsApp
          para combinar o pagamento.
        </p>
        <div className="mt-8 rounded-2xl border border-marca bg-marca-suave p-6 text-left">
          <p className="font-titulo font-semibold">
            ⚠️ Sua data ainda não está garantida
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            O pedido só entra na agenda quando a confeiteira{" "}
            <strong>aceitar</strong>. Você recebe um aviso assim que isso
            acontecer — normalmente em até 24 horas.
          </p>
        </div>
        <Link
          href={`/${slug}`}
          className="mt-8 inline-block rounded-full border border-borda bg-cartao px-6 py-3 text-sm font-medium"
        >
          Voltar ao cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <Link href={`/${slug}`} className="text-sm text-suave hover:text-texto">
          ← cardápio
        </Link>

        <div
          className="mt-5 grid h-44 place-items-center rounded-2xl text-6xl"
          style={{ background: produto.cor }}
        >
          {produto.emoji}
        </div>

        <h1 className="mt-6 text-3xl font-semibold">{produto.nome}</h1>
        <p className="mt-3 leading-relaxed text-suave">{produto.descricao}</p>
        <p className="mt-3 text-sm text-suave">
          Encomende com {produto.antecedenciaDias} dias de antecedência
          {sobrando !== null && ` · restam ${sobrando} unidades`}
        </p>

        <section className="mt-10">
          <h2 className="font-titulo text-lg font-semibold">Tamanho</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {produto.tamanhos.map((opcao) => {
              const marcada = opcao.id === selecao.tamanhoId;
              return (
                <button
                  key={opcao.id}
                  type="button"
                  onClick={() => trocarTamanho(opcao.id)}
                  aria-pressed={marcada}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    marcada
                      ? "border-marca bg-marca-suave"
                      : "border-borda bg-cartao hover:border-marca"
                  }`}
                >
                  <span className="block font-medium">{opcao.nome}</span>
                  <span className="mt-1 block text-xs text-suave">
                    {opcao.porcoes}
                  </span>
                  <span className="mt-2 block text-sm font-semibold">
                    {fmt(opcao.preco)}
                  </span>
                  <span className="mt-1 block text-xs text-suave">
                    até {opcao.maxRecheios}{" "}
                    {opcao.maxRecheios === 1 ? "recheio" : "recheios"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-titulo text-lg font-semibold">Massa</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {produto.massas.map((opcao) => (
              <Escolha
                key={opcao.id}
                opcao={opcao}
                marcada={selecao.massaId === opcao.id}
                bloqueada={false}
                codigo={confeiteira.moeda}
                aoClicar={() =>
                  setSelecao((atual) => ({ ...atual, massaId: opcao.id }))
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-titulo text-lg font-semibold">Recheios</h2>
            <span className="text-sm text-suave">
              {vagas === 0
                ? "completo"
                : `escolha mais ${vagas}`}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {produto.recheios.map((opcao) => (
              <Escolha
                key={opcao.id}
                opcao={opcao}
                marcada={selecao.recheioIds.includes(opcao.id)}
                bloqueada={vagas === 0}
                codigo={confeiteira.moeda}
                aoClicar={() =>
                  alternar("recheioIds", opcao.id, tamanho?.maxRecheios ?? 0)
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-titulo text-lg font-semibold">Decoração</h2>
            <span className="text-sm text-suave">
              até {produto.maxDecoracoes}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {produto.decoracoes.map((opcao) => (
              <Escolha
                key={opcao.id}
                opcao={opcao}
                codigo={confeiteira.moeda}
                marcada={selecao.decoracaoIds.includes(opcao.id)}
                bloqueada={
                  selecao.decoracaoIds.length >= produto.maxDecoracoes
                }
                aoClicar={() =>
                  alternar("decoracaoIds", opcao.id, produto.maxDecoracoes)
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-titulo text-lg font-semibold">Como receber</h2>
          <div className="mt-4 grid gap-3">
            {confeiteira.entregas.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                onClick={() => setEntregaId(opcao.id)}
                aria-pressed={opcao.id === entregaId}
                className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm transition ${
                  opcao.id === entregaId
                    ? "border-marca bg-marca-suave"
                    : "border-borda bg-cartao hover:border-marca"
                }`}
              >
                <span>
                  <span className="block font-medium">{opcao.nome}</span>
                  <span className="block text-xs text-suave">
                    {opcao.descricao}
                  </span>
                </span>
                <span className="shrink-0 font-medium">
                  {opcao.taxa === 0 ? "grátis" : fmt(opcao.taxa)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-titulo text-lg font-semibold">Observações</h2>
          <textarea
            value={observacao}
            onChange={(evento) => setObservacao(evento.target.value)}
            rows={3}
            placeholder="Tema da festa, cores, nome no topo, alguma restrição alimentar…"
            className="mt-4 w-full rounded-xl border border-borda bg-cartao p-4 text-sm outline-none focus:border-marca"
          />
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-borda bg-cartao p-6">
          <h2 className="font-titulo font-semibold">Seu bolo</h2>

          <ul className="mt-5 space-y-3 text-sm">
            {orcamento.linhas.map((linha, indice) => (
              <li
                key={`${linha.rotulo}-${indice}`}
                className="flex justify-between gap-3"
              >
                <span>
                  <span className="block">{linha.rotulo}</span>
                  <span className="block text-xs text-suave">
                    {linha.detalhe}
                  </span>
                </span>
                <span className="shrink-0 text-suave">
                  {linha.valor === 0 ? "—" : fmt(linha.valor)}
                </span>
              </li>
            ))}
            <li className="flex justify-between gap-3 border-t border-borda pt-3">
              <span>
                <span className="block">{entrega.nome}</span>
                <span className="block text-xs text-suave">entrega</span>
              </span>
              <span className="shrink-0 text-suave">
                {entrega.taxa === 0 ? "—" : fmt(entrega.taxa)}
              </span>
            </li>
          </ul>

          <div className="mt-5 flex items-baseline justify-between border-t border-borda pt-5">
            <span className="text-sm text-suave">Total</span>
            <span className="text-2xl font-semibold">
              {fmt(totalComEntrega)}
            </span>
          </div>

          {orcamento.pendencias.length > 0 && (
            <ul className="mt-5 space-y-1 rounded-xl bg-marca-suave p-4 text-xs text-marca">
              {orcamento.pendencias.map((pendencia) => (
                <li key={pendencia}>• {pendencia}</li>
              ))}
            </ul>
          )}

          <button
            type="button"
            disabled={!orcamento.completo}
            onClick={() => setEnviado(true)}
            className="mt-5 w-full rounded-full bg-marca py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enviar pedido
          </button>

          <p className="mt-4 text-xs leading-relaxed text-suave">
            Enviar não reserva a data. {confeiteira.nome} precisa{" "}
            <strong className="text-texto">aceitar o pedido</strong> para a
            encomenda valer.
          </p>
        </div>
      </aside>
    </div>
  );
}
