import { notFound } from "next/navigation";
import { confeiteira, produtoPorId, produtos } from "@/lib/dados";
import Montador from "./montador";

export function generateStaticParams() {
  return produtos.map((produto) => ({
    slug: confeiteira.slug,
    produtoId: produto.id,
  }));
}

export default async function PaginaDoProduto({
  params,
}: {
  params: Promise<{ slug: string; produtoId: string }>;
}) {
  const { slug, produtoId } = await params;
  const produto = produtoPorId(produtoId);
  if (slug !== confeiteira.slug || !produto) notFound();

  return <Montador produto={produto} confeiteira={confeiteira} slug={slug} />;
}
