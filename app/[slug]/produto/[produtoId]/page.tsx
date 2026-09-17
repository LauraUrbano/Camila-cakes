import { notFound } from "next/navigation";
import { lojaPorSlug, lojas, produtoPorId } from "@/lib/dados";
import Montador from "./montador";

export function generateStaticParams() {
  return lojas.flatMap((loja) =>
    loja.produtos.map((produto) => ({
      slug: loja.confeiteira.slug,
      produtoId: produto.id,
    })),
  );
}

export default async function PaginaDoProduto({
  params,
}: {
  params: Promise<{ slug: string; produtoId: string }>;
}) {
  const { slug, produtoId } = await params;
  const loja = lojaPorSlug(slug);
  const produto = loja && produtoPorId(loja, produtoId);
  if (!loja || !produto) notFound();

  return (
    <Montador produto={produto} confeiteira={loja.confeiteira} slug={slug} />
  );
}
