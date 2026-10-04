import { notFound } from "next/navigation";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { produtoParaEditar } from "@/lib/bd/cardapio";
import { exigirLoja } from "@/lib/fonte";
import FichaDoProduto from "./ficha";

export default async function EditarProduto({
  params,
}: {
  params: Promise<{ chave: string }>;
}) {
  const { chave } = await params;
  const { confeiteira } = await exigirLoja();
  if (!temBaseDeDados()) notFound();

  const produto = await produtoParaEditar(executorNeon(), confeiteira.slug, chave);
  if (!produto) notFound();

  return (
    <FichaDoProduto
      produto={produto}
      slug={confeiteira.slug}
      moeda={confeiteira.moeda}
    />
  );
}
