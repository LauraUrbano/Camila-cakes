"use client";

import { useState, useTransition } from "react";
import type { Definicao } from "@/lib/bd/admin";
import { guardarDadoLegal } from "@/app/admin/accoes";

const rotulos: Record<string, { nome: string; exemplo: string }> = {
  empresa_nome: { nome: "Denominação social", exemplo: "Cakelyo, Unipessoal Lda." },
  empresa_nif: { nome: "NIF", exemplo: "500000000" },
  empresa_morada: { nome: "Morada da sede", exemplo: "Rua de Exemplo 1, 1000-000 Lisboa" },
  empresa_email: { nome: "Email de contacto", exemplo: "ola@cakelyo.app" },
  empresa_telefone: { nome: "Telefone", exemplo: "+351 900 000 000" },
  livro_reclamacoes: {
    nome: "Livro de reclamações",
    exemplo: "https://www.livroreclamacoes.pt/inicio",
  },
};

function Linha({ definicao }: { definicao: Definicao }) {
  const [valor, setValor] = useState(definicao.valor);
  const [aGravar, gravar] = useTransition();
  const [guardado, setGuardado] = useState(false);
  const mudou = valor.trim() !== definicao.valor;
  const rotulo = rotulos[definicao.chave];

  return (
    <li className="grid gap-3 border-t border-borda py-4 sm:grid-cols-[1fr_1.6fr_auto] sm:items-center">
      <div>
        <p className="text-sm">{rotulo?.nome ?? definicao.chave}</p>
        <p className="mt-0.5 text-xs text-suave">{definicao.descricao}</p>
      </div>
      <input
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          setGuardado(false);
        }}
        placeholder={rotulo?.exemplo}
        className="w-full rounded-xl border border-borda px-3 py-2 text-sm outline-none focus:border-marca"
      />
      <button
        type="button"
        disabled={!mudou || aGravar}
        onClick={() =>
          gravar(async () => {
            await guardarDadoLegal(definicao.chave, valor);
            setGuardado(true);
          })
        }
        className="rounded-full border border-borda px-4 py-2 text-xs disabled:opacity-40"
      >
        {aGravar ? "A guardar…" : guardado && !mudou ? "Guardado" : "Guardar"}
      </button>
    </li>
  );
}

export default function PainelLegal({ lista }: { lista: Definicao[] }) {
  return (
    <section className="mt-8 rounded-3xl border border-borda bg-cartao p-8">
      <ul>
        {lista.map((definicao) => (
          <Linha key={definicao.chave} definicao={definicao} />
        ))}
      </ul>
      <p className="mt-6 border-t border-borda pt-5 text-xs leading-relaxed text-suave">
        Os textos legais foram escritos a descrever o que o Cakelyo faz de
        facto — que não vende bolos, não recebe pagamentos de clientes finais e
        não é parte na encomenda. Antes de cobrares a primeira assinatura, vale
        a pena pô-los à frente de um advogado: quem os escreveu não é um.
      </p>
    </section>
  );
}
