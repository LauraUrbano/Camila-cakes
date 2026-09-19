import { lojaPrincipal, produtosDaColecao } from "@/lib/dados";
import { dicionarioActual } from "@/lib/i18n/servidor";

const { colecoes } = lojaPrincipal;

export default async function PaginaDeColecoes() {
  const c = (await dicionarioActual()).painel.colecoes;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">{c.titulo}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {c.subtitulo}
      </p>

      <div className="mt-8 space-y-5">
        {colecoes.map((colecao) => {
          const itens = produtosDaColecao(lojaPrincipal, colecao);
          return (
            <section
              key={colecao.id}
              className={`rounded-2xl border bg-cartao p-6 ${
                colecao.ativa ? "border-borda" : "border-borda opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-titulo text-lg font-semibold">
                      {colecao.nome}
                    </h2>
                    {colecao.destaque && (
                      <span className="rounded-full bg-marca px-2 py-0.5 text-[11px] font-medium text-white">
                        {c.destaque}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-suave">{colecao.descricao}</p>
                  <p className="mt-1 text-xs text-suave">{colecao.periodo}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    colecao.ativa
                      ? "bg-marca-suave text-marca"
                      : "bg-borda text-suave"
                  }`}
                >
                  {colecao.ativa ? c.noAr : c.foraDoAr}
                </span>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {itens.map((produto) => (
                  <li
                    key={produto.id}
                    className="rounded-full border border-borda px-3 py-1.5 text-xs"
                  >
                    {produto.nome}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
