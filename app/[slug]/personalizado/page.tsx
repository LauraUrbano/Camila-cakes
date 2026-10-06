import { notFound } from "next/navigation";
import { montraDoSlug } from "@/lib/fonte";
import PedidoPersonalizado from "./pedido-personalizado";

export default async function PaginaPersonalizado({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loja = await montraDoSlug(slug);
  if (!loja || !loja.confeiteira.aceitaPersonalizado) notFound();

  return <PedidoPersonalizado confeiteira={loja.confeiteira} slug={slug} />;
}
