import Icone from "@/app/icones";
import { lojaPrincipal } from "@/lib/dados";
import { dicionarioActual } from "@/lib/i18n/servidor";

const { confeiteira } = lojaPrincipal;
import { moeda } from "@/lib/precos";

export default async function PaginaDaMinhaPagina() {
  const p = (await dicionarioActual()).painel.pagina;

  const { tema, entregas } = confeiteira;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">{p.titulo}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {p.subtitulo}
      </p>

      <section className="mt-8 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">{p.endereco}</h2>
        <div className="mt-4 space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-fundo p-4">
            <span className="font-mono">
              cakelyo.app/
              <span className="font-semibold">{confeiteira.slug}</span>
            </span>
            <span className="rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
              {p.sempreActivo}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-fundo p-4">
            <span className="font-mono">{confeiteira.dominioProprio}</span>
            <span className="rounded-full bg-marca-suave px-3 py-1 text-xs font-medium text-marca">
              {p.dominioProprio}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-suave">
            {p.dominioNota}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">{p.identidade}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {[
            { nome: p.corMarca, cor: tema.marca },
            { nome: p.corMarcaSuave, cor: tema.marcaSuave },
            { nome: p.corFundo, cor: tema.fundo },
            { nome: p.corTexto, cor: tema.texto },
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
        <h2 className="font-titulo font-semibold">{p.textos}</h2>
        <dl className="mt-4 space-y-4 text-sm">
          {[
            { termo: p.chamada, valor: confeiteira.tagline },
            { termo: p.sobre, valor: confeiteira.bio },
            { termo: p.avisoPagamento, valor: confeiteira.avisoPagamento },
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
        <h2 className="font-titulo font-semibold">{p.formasReceber}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {entregas.map((entrega) => (
            <li
              key={entrega.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-fundo p-4"
            >
              <span>
                <span className="flex items-center gap-2 font-medium">
                  <Icone
                    nome={entrega.tipo === "retirada" ? "levantamento" : "entrega"}
                    className="h-4 w-4 text-suave"
                  />
                  {entrega.nome}
                </span>
                <span className="block text-xs text-suave">
                  {entrega.descricao}
                </span>
              </span>
              <span className="shrink-0 font-medium">
                {entrega.taxa === 0
                  ? p.gratis
                  : moeda(entrega.taxa, confeiteira.moeda)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-borda bg-cartao p-6">
        <h2 className="font-titulo font-semibold">{p.personalizados}</h2>
        <p className="mt-3 text-sm leading-relaxed text-suave">
          {confeiteira.aceitaPersonalizado
            ? p.personalizadosLigado
            : p.personalizadosDesligado}
        </p>
      </section>
    </div>
  );
}
