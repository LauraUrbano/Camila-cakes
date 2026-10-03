import { notFound } from "next/navigation";
import { produtoPorId } from "@/lib/dados";
import { lojaDoSlug } from "@/lib/fonte";
import Montador from "./montador";

export default async function PaginaDoProduto({
  params,
}: {
  params: Promise<{ slug: string; produtoId: string }>;
}) {
  const { slug, produtoId } = await params;
  const loja = await lojaDoSlug(slug);
  const produto = loja && produtoPorId(loja, produtoId);
  if (!loja || !produto) notFound();

  return (
    <Montador produto={produto} confeiteira={loja.confeiteira} slug={slug} />
  );
}
