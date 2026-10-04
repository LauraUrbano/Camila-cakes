"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { useT } from "@/app/lingua";
import type {
  LinhaDeOpcao,
  LinhaDeTamanho,
  ProdutoParaEditar,
} from "@/lib/bd/cardapio";
import type { Moeda } from "@/lib/tipos";
import { guardarFicha, remover, removerFoto } from "../accoes";

const campo =
  "w-full rounded-xl border border-borda bg-fundo px-3 py-2 text-sm outline-none focus:border-marca";

/** Uma linha que ainda não existe na base: sem id. */
type Nova<T> = Omit<T, "id"> & { id?: string };

function usarLista<T extends { id?: string }>(inicial: T[], vazia: () => T) {
  const [lista, setLista] = useState<T[]>(inicial);
  return {
    lista,
    mudar: (i: number, campos: Partial<T>) =>
      setLista((l) => l.map((x, j) => (j === i ? { ...x, ...campos } : x))),
    juntar: () => setLista((l) => [...l, vazia()]),
    tirar: (i: number) => setLista((l) => l.filter((_, j) => j !== i)),
  };
}

export default function FichaDoProduto({
  produto,
  slug,
  moeda,
}: {
  produto: ProdutoParaEditar;
  slug: string;
  moeda: Moeda;
}) {
  const t = useT().painel.editor;
  const [estado, accao, aGuardar] = useActionState(guardarFicha, {});
  const [aApagar, apagar] = useTransition();
  const [aTirarFoto, tirarFoto] = useTransition();

  const [temLimite, setTemLimite] = useState(produto.limiteTotal !== null);
  const [previa, setPrevia] = useState<string | null>(null);

  const tamanhos = usarLista<Nova<LinhaDeTamanho>>(produto.tamanhos, () => ({
    nome: "",
    porcoes: "",
    preco: 0,
    maxRecheios: 0,
  }));

  const grupos = {
    massa: usarLista<Nova<LinhaDeOpcao>>(produto.massas, () => ({
      nome: "",
      acrescimo: 0,
      disponivel: true,
    })),
    recheio: usarLista<Nova<LinhaDeOpcao>>(produto.recheios, () => ({
      nome: "",
      acrescimo: 0,
      disponivel: true,
    })),
    decoracao: usarLista<Nova<LinhaDeOpcao>>(produto.decoracoes, () => ({
      nome: "",
      acrescimo: 0,
      disponivel: true,
    })),
  };

  const tituloDoGrupo = {
    massa: t.massas,
    recheio: t.recheios,
    decoracao: t.decoracoes,
  };

  return (
    <form action={accao} className="mx-auto max-w-3xl pb-28">
      <input type="hidden" name="chave" value={produto.chave} />

      <Link
        href="/dashboard/cardapio"
        className="text-xs text-suave underline underline-offset-2"
      >
        ← {t.voltar}
      </Link>

      <h1 className="mt-4 text-2xl">{produto.nome}</h1>

      {/* ------------------------------------------------------ o produto */}
      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-7">
        <h2 className="font-titulo text-lg">{t.basicos}</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:col-span-2">
            <span className="text-suave">{t.nome}</span>
            <input name="nome" defaultValue={produto.nome} className={`mt-1 ${campo}`} />
          </label>

          <label className="block text-xs sm:col-span-2">
            <span className="text-suave">{t.descricao}</span>
            <input
              name="descricao"
              defaultValue={produto.descricao}
              className={`mt-1 ${campo}`}
            />
            <span className="mt-1 block text-suave">{t.descricaoAjuda}</span>
          </label>

          <label className="block text-xs">
            <span className="text-suave">{t.categoria}</span>
            <input
              name="categoria"
              defaultValue={produto.categoria}
              className={`mt-1 ${campo}`}
            />
            <span className="mt-1 block text-suave">{t.categoriaAjuda}</span>
          </label>

          <label className="block text-xs">
            <span className="text-suave">{t.antecedencia}</span>
            <input
              name="antecedenciaDias"
              type="number"
              min={0}
              defaultValue={produto.antecedenciaDias}
              className={`mt-1 ${campo}`}
            />
            <span className="mt-1 block text-suave">{t.antecedenciaAjuda}</span>
          </label>

          <label className="block text-xs">
            <span className="text-suave">{t.cor}</span>
            <input
              name="cor"
              type="color"
              defaultValue={produto.cor}
              className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-borda bg-fundo px-1"
            />
            <span className="mt-1 block text-suave">{t.corAjuda}</span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={produto.activo}
              className="mt-0.5 h-4 w-4 accent-marca"
            />
            <span>
              {t.activo}
              <span className="mt-1 block text-xs leading-relaxed text-suave">
                {t.activoAjuda}
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* ---------------------------------------------------- fotografia */}
      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-7">
        <h2 className="font-titulo text-lg">{t.foto}</h2>
        <p className="mt-1.5 text-xs text-suave">{t.fotoAjuda}</p>

        {(previa || produto.foto) && (
          <div className="mt-4 h-40 w-40 overflow-hidden rounded-2xl border border-borda">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previa ?? produto.foto}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-borda px-5 py-2.5 text-sm transition hover:border-marca">
            {produto.foto ? t.trocarFoto : t.escolherFoto}
            <input
              name="foto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPrevia(f ? URL.createObjectURL(f) : null);
              }}
            />
          </label>
          {produto.foto && (
            <button
              type="button"
              disabled={aTirarFoto}
              onClick={() => tirarFoto(() => removerFoto(produto.chave))}
              className="text-sm text-suave underline underline-offset-2 disabled:opacity-50"
            >
              {t.removerFoto}
            </button>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ tamanhos */}
      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-7">
        <h2 className="font-titulo text-lg">{t.tamanhos}</h2>
        <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-suave">
          {t.tamanhosAjuda}
        </p>

        <div className="mt-5 space-y-3">
          {tamanhos.lista.map((linha, i) => (
            <div
              key={linha.id ?? `novo-${i}`}
              className="grid gap-2 sm:grid-cols-[1.3fr_1fr_6rem_5rem_auto] sm:items-end"
            >
              {linha.id && (
                <input type="hidden" name={`tamanho[${i}][id]`} value={linha.id} />
              )}
              <label className="block text-xs">
                <span className="text-suave">{t.tamanhoNome}</span>
                <input
                  name={`tamanho[${i}][nome]`}
                  value={linha.nome}
                  onChange={(e) => tamanhos.mudar(i, { nome: e.target.value })}
                  className={`mt-1 ${campo}`}
                />
              </label>
              <label className="block text-xs">
                <span className="text-suave">{t.porcoes}</span>
                <input
                  name={`tamanho[${i}][porcoes]`}
                  value={linha.porcoes}
                  onChange={(e) => tamanhos.mudar(i, { porcoes: e.target.value })}
                  placeholder="até 10 pessoas"
                  className={`mt-1 ${campo}`}
                />
              </label>
              <label className="block text-xs">
                <span className="text-suave">
                  {t.preco} ({moeda})
                </span>
                <input
                  name={`tamanho[${i}][preco]`}
                  value={String(linha.preco).replace(".", ",")}
                  inputMode="decimal"
                  onChange={(e) =>
                    tamanhos.mudar(i, {
                      preco: Number(e.target.value.replace(",", ".")) || 0,
                    })
                  }
                  className={`mt-1 ${campo}`}
                />
              </label>
              <label className="block text-xs">
                <span className="text-suave">{t.recheiosQueCabem}</span>
                <input
                  name={`tamanho[${i}][maxRecheios]`}
                  type="number"
                  min={0}
                  value={linha.maxRecheios}
                  onChange={(e) =>
                    tamanhos.mudar(i, { maxRecheios: Number(e.target.value) })
                  }
                  className={`mt-1 ${campo}`}
                />
              </label>
              <button
                type="button"
                aria-label={t.apagarLinha}
                onClick={() => tamanhos.tirar(i)}
                className="h-10 rounded-xl border border-borda px-3 text-suave transition hover:border-marca"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={tamanhos.juntar}
          className="mt-4 rounded-full border border-borda px-4 py-2 text-xs transition hover:border-marca"
        >
          + {t.novaLinha}
        </button>
      </section>

      {/* ------------------------------------- massas, recheios, decorações */}
      {(["massa", "recheio", "decoracao"] as const).map((grupo) => {
        const g = grupos[grupo];
        return (
          <section
            key={grupo}
            className="mt-6 rounded-3xl border border-borda bg-cartao p-7"
          >
            <h2 className="font-titulo text-lg">{tituloDoGrupo[grupo]}</h2>

            {grupo === "decoracao" && (
              <label className="mt-4 block max-w-xs text-xs">
                <span className="text-suave">{t.maxDecoracoes}</span>
                <input
                  name="maxDecoracoes"
                  type="number"
                  min={0}
                  defaultValue={produto.maxDecoracoes}
                  className={`mt-1 ${campo}`}
                />
                <span className="mt-1 block text-suave">
                  {t.maxDecoracoesAjuda}
                </span>
              </label>
            )}

            <div className="mt-5 space-y-3">
              {g.lista.map((linha, i) => (
                <div
                  key={linha.id ?? `novo-${i}`}
                  className="grid gap-2 sm:grid-cols-[1.6fr_7rem_auto_auto] sm:items-end"
                >
                  {linha.id && (
                    <input
                      type="hidden"
                      name={`${grupo}[${i}][id]`}
                      value={linha.id}
                    />
                  )}
                  <label className="block text-xs">
                    <span className="text-suave">{t.opcaoNome}</span>
                    <input
                      name={`${grupo}[${i}][nome]`}
                      value={linha.nome}
                      onChange={(e) => g.mudar(i, { nome: e.target.value })}
                      className={`mt-1 ${campo}`}
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-suave">{t.acrescimo}</span>
                    <input
                      name={`${grupo}[${i}][acrescimo]`}
                      value={String(linha.acrescimo).replace(".", ",")}
                      inputMode="decimal"
                      onChange={(e) =>
                        g.mudar(i, {
                          acrescimo: Number(e.target.value.replace(",", ".")) || 0,
                        })
                      }
                      className={`mt-1 ${campo}`}
                    />
                  </label>
                  <label className="flex h-10 items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={linha.disponivel}
                      onChange={(e) => g.mudar(i, { disponivel: e.target.checked })}
                      className="h-4 w-4 accent-marca"
                    />
                    <input
                      type="hidden"
                      name={`${grupo}[${i}][disponivel]`}
                      value={linha.disponivel ? "sim" : "nao"}
                    />
                    <span className="text-suave">{t.disponivel}</span>
                  </label>
                  <button
                    type="button"
                    aria-label={t.apagarLinha}
                    onClick={() => g.tirar(i)}
                    className="h-10 rounded-xl border border-borda px-3 text-suave transition hover:border-marca"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-suave">{t.acrescimoZero}</p>

            <button
              type="button"
              onClick={g.juntar}
              className="mt-4 rounded-full border border-borda px-4 py-2 text-xs transition hover:border-marca"
            >
              + {t.novaLinha}
            </button>
          </section>
        );
      })}

      {/* -------------------------------------------------------- limite */}
      <section className="mt-6 rounded-3xl border border-borda bg-cartao p-7">
        <h2 className="font-titulo text-lg">{t.limite}</h2>

        <label className="mt-4 flex gap-3 text-sm">
          <input
            type="checkbox"
            name="temLimite"
            checked={temLimite}
            onChange={(e) => setTemLimite(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-marca"
          />
          <span>
            {t.temLimite}
            <span className="mt-1 block text-xs leading-relaxed text-suave">
              {t.limiteAjuda}
            </span>
          </span>
        </label>

        {temLimite && (
          <div className="mt-5 grid max-w-sm gap-4 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="text-suave">{t.limiteTotal}</span>
              <input
                name="limiteTotal"
                type="number"
                min={1}
                defaultValue={produto.limiteTotal ?? 10}
                className={`mt-1 ${campo}`}
              />
            </label>
            <label className="block text-xs">
              <span className="text-suave">{t.limiteVendidos}</span>
              <input
                name="limiteVendidos"
                type="number"
                min={0}
                defaultValue={produto.limiteVendidos}
                className={`mt-1 ${campo}`}
              />
            </label>
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={aApagar}
          onClick={() => {
            if (confirm(t.confirmarApagar)) apagar(() => remover(produto.chave));
          }}
          className="text-sm text-suave underline underline-offset-2 disabled:opacity-50"
        >
          {t.apagar}
        </button>
        <Link
          href={`/${slug}`}
          className="text-sm text-suave underline underline-offset-2"
        >
          {t.verNaPagina}
        </Link>
      </div>

      {/* A barra de guardar acompanha a página: a ficha é comprida e não se
          deve ter de voltar ao fim para gravar. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-borda bg-cartao/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-4 px-6 py-4 lg:pl-10">
          <button
            type="submit"
            disabled={aGuardar}
            className="rounded-full bg-marca px-7 py-3 text-sm text-white disabled:opacity-50"
          >
            {aGuardar ? t.aGuardar : t.guardar}
          </button>
          {estado.erro && <p className="text-sm text-marca">{estado.erro}</p>}
          {estado.ok && <p className="text-sm text-marca">{estado.ok}</p>}
        </div>
      </div>
    </form>
  );
}
