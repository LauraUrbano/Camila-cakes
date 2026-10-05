"use client";

import { useMemo, useState } from "react";
import { useT } from "@/app/lingua";
import { Produtos, type Modelo } from "./modelos";
import type { Moeda, Produto } from "@/lib/tipos";

export type ProdutoDoCardapio = Produto & { colecoes: string[] };

export type ColecaoDoCardapio = {
  id: string;
  nome: string;
  descricao: string;
  periodo: string;
  destaque: boolean;
};

/** Quantos bolos por página. Doze enche a grelha sem obrigar a rolar sem fim. */
const POR_PAGINA = 12;

function semAcentos(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * O cardápio que a cliente percorre.
 *
 * Uma confeitaria com trinta bolos tinha uma página sem fim e sem forma de
 * procurar — quem chegava com uma ideia na cabeça tinha de rolar até a
 * encontrar. Agora há filtros por coleção e por categoria, procura por nome,
 * e páginas de doze.
 *
 * Os filtros são os mesmos nos três modelos; o que muda é só a forma como os
 * bolos são desenhados.
 */
export default function Cardapio({
  modelo,
  slug,
  codigo,
  colecoes,
  produtos,
}: {
  modelo: Modelo;
  slug: string;
  codigo: Moeda;
  colecoes: ColecaoDoCardapio[];
  produtos: ProdutoDoCardapio[];
}) {
  const t = useT().loja;

  const [colecao, setColecao] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);

  const categorias = useMemo(() => {
    const vistas = new Map<string, number>();
    for (const p of produtos) {
      if (!p.categoria) continue;
      vistas.set(p.categoria, (vistas.get(p.categoria) ?? 0) + 1);
    }
    return [...vistas.keys()].sort((a, b) => a.localeCompare(b));
  }, [produtos]);

  const filtrados = useMemo(() => {
    const procura = semAcentos(busca.trim());
    return produtos.filter((p) => {
      if (colecao && !p.colecoes.includes(colecao)) return false;
      if (categoria && p.categoria !== categoria) return false;
      if (!procura) return true;
      return semAcentos(`${p.nome} ${p.descricao} ${p.categoria}`).includes(procura);
    });
  }, [produtos, colecao, categoria, busca]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const actual = Math.min(pagina, paginas - 1);
  const visiveis = filtrados.slice(actual * POR_PAGINA, (actual + 1) * POR_PAGINA);

  const mudar = (accao: () => void) => {
    accao();
    setPagina(0);
  };

  const filtroActivo = Boolean(colecao || categoria || busca.trim());
  // As coleções só viram filtro quando há mais do que uma: com uma só, o
  // botão não escolhe nada e é ruído no ecrã.
  const mostrarColecoes = colecoes.length > 1;

  const chip = (ligado: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm transition ${
      ligado
        ? "border-marca bg-marca text-white"
        : "border-borda bg-cartao text-suave hover:border-marca"
    }`;

  return (
    // A margem em baixo é o que separa o último bolo do que vem a seguir.
    // Sem ela os cartões encostavam ao painel de encomenda à medida e lia-se
    // como uma falha de desenho.
    <section className="mb-16">
      {/* --------------------------------------------------- os filtros */}
      {(mostrarColecoes || categorias.length > 1 || produtos.length > POR_PAGINA) && (
        <div className="mb-8">
          {(mostrarColecoes || categorias.length > 1) && (
            // Em ecrã estreito a fila desliza de lado em vez de partir em
            // três linhas de botões.
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              <button
                type="button"
                onClick={() =>
                  mudar(() => {
                    setColecao("");
                    setCategoria("");
                  })
                }
                className={chip(!colecao && !categoria)}
              >
                {t.tudo}
              </button>

              {mostrarColecoes &&
                colecoes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      mudar(() => {
                        setColecao(colecao === c.id ? "" : c.id);
                        setCategoria("");
                      })
                    }
                    className={chip(colecao === c.id)}
                  >
                    {c.nome}
                  </button>
                ))}

              {categorias.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    mudar(() => setCategoria(categoria === c ? "" : c))
                  }
                  className={chip(categoria === c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {produtos.length > 6 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                value={busca}
                onChange={(e) => mudar(() => setBusca(e.target.value))}
                placeholder={t.procurar}
                className="w-full max-w-sm rounded-full border border-borda bg-cartao px-5 py-2.5 text-sm outline-none focus:border-marca"
              />
              {filtroActivo && (
                <button
                  type="button"
                  onClick={() =>
                    mudar(() => {
                      setColecao("");
                      setCategoria("");
                      setBusca("");
                    })
                  }
                  className="text-sm text-suave underline underline-offset-2"
                >
                  {t.limpar}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------- o que a coleção diz */}
      {colecao &&
        colecoes
          .filter((c) => c.id === colecao && c.descricao)
          .map((c) => (
            <p key={c.id} className="mb-6 text-sm leading-relaxed text-suave">
              {c.descricao}
              {c.periodo && <span className="ml-2 text-xs">· {c.periodo}</span>}
            </p>
          ))}

      {/* ---------------------------------------------------- os bolos */}
      {visiveis.length > 0 ? (
        <Produtos
          modelo={modelo}
          itens={visiveis}
          slug={slug}
          codigo={codigo}
          t={t}
        />
      ) : (
        // Uma loja ainda sem bolos não tem filtro nenhum para culpar: dizer
        // "não há nada com esse filtro" a quem chega à página de uma
        // confeitaria que acabou de abrir parece um erro do site.
        <p className="rounded-3xl border border-borda bg-cartao p-10 text-center text-sm text-suave">
          {produtos.length === 0 ? t.cardapioVazio : t.semResultados}
        </p>
      )}

      {/* ------------------------------------------------- as páginas */}
      {paginas > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={actual === 0}
            onClick={() => setPagina(actual - 1)}
            className="rounded-full border border-borda px-4 py-2 text-sm text-suave disabled:opacity-40"
          >
            {t.anterior}
          </button>

          {Array.from({ length: paginas }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPagina(i)}
              aria-current={i === actual ? "page" : undefined}
              aria-label={`${t.pagina} ${i + 1}`}
              className={`h-10 w-10 rounded-full border text-sm transition ${
                i === actual
                  ? "border-marca bg-marca text-white"
                  : "border-borda text-suave hover:border-marca"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={actual === paginas - 1}
            onClick={() => setPagina(actual + 1)}
            className="rounded-full border border-borda px-4 py-2 text-sm text-suave disabled:opacity-40"
          >
            {t.seguinte}
          </button>
        </nav>
      )}

      {filtrados.length > 0 && paginas > 1 && (
        <p className="mt-4 text-center text-xs text-suave">
          {filtrados.length}{" "}
          {filtrados.length === 1 ? t.umResultado : t.variosResultados}
        </p>
      )}
    </section>
  );
}
