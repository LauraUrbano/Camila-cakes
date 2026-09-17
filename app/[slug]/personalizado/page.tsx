import { notFound } from "next/navigation";
import { lojaPorSlug } from "@/lib/dados";
import PedidoPersonalizado from "./pedido-personalizado";

export default async function PaginaPersonalizado({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = lojaPorSlug(slug);
  if (!loja || !loja.confeiteira.aceitaPersonalizado) notFound();

  return <PedidoPersonalizado confeiteira={loja.confeiteira} slug={slug} />;
}
