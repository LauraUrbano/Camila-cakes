import { confeiteira } from "@/lib/dados";
import { moeda } from "@/lib/precos";

export default function PaginaDaMinhaPagina() {
  const { tema, entregas } = confeiteira;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Minha página</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        Tudo o que a cliente vê é seu: endereço, cores, textos e as formas de
        receber.
      </p>

      <section className="mt-8 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">Endereço</h2>
        <div className="mt-4 space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-fundo p-4">
            <span className="font-mono">
              camilacakes.app/
              <span className="font-semibold">{confeiteira.slug}</span>
            </span>
            <span className="rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
              sempre ativo
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-fundo p-4">
            <span className="font-mono">{confeiteira.dominioProprio}</span>
            <span className="rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
              domínio próprio
            </span>
          </div>
          <p className="text-xs leading-relaxed text-suave">
            Já tem um domínio? Aponta ele para cá e a sua página passa a
            atender pelos dois endereços.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">Identidade visual</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {[
            { nome: "Marca", cor: tema.marca },
            { nome: "Marca suave", cor: tema.marcaSuave },
            { nome: "Fundo", cor: tema.fundo },
            { nome: "Texto", cor: tema.texto },
          ].map((item) => (
            <div key={item.nome} className="rounded-xl border border-borda p-3">
              <div
                className="h-14 w-full rounded-lg border border-borda"
                style={{ background: item.cor }}
              />
              <p className="mt-2 text-xs font-medium">{item.nome}</p>
              <p className="font-mono text-[11px] text-suave">{item.cor}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">Textos da página</h2>
        <dl className="mt-4 space-y-4 text-sm">
          {[
            { termo: "Chamada", valor: confeiteira.tagline },
            { termo: "Sobre", valor: confeiteira.bio },
            { termo: "Aviso de pagamento", valor: confeiteira.avisoPagamento },
          ].map((linha) => (
            <div key={linha.termo}>
              <dt className="text-xs font-medium text-suave">{linha.termo}</dt>
              <dd className="mt-1 rounded-xl bg-fundo p-4 leading-relaxed">
                {linha.valor}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">Formas de receber</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {entregas.map((entrega) => (
            <li
              key={entrega.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-fundo p-4"
            >
              <span>
                <span className="block font-medium">
                  {entrega.tipo === "retirada" ? "🏠" : "🚚"} {entrega.nome}
                </span>
                <span className="block text-xs text-suave">
                  {entrega.descricao}
                </span>
              </span>
              <span className="shrink-0 font-medium">
                {entrega.taxa === 0 ? "grátis" : moeda(entrega.taxa)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">Pedidos personalizados</h2>
        <p className="mt-3 text-sm leading-relaxed text-suave">
          {confeiteira.aceitaPersonalizado
            ? "Ligado. A cliente consegue pedir orçamento para o que não está no cardápio."
            : "Desligado. A cliente só pode pedir o que está no cardápio."}
        </p>
      </section>
    </div>
  );
}
