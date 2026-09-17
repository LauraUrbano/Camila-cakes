import { notFound } from "next/navigation";
import { confeiteira } from "@/lib/dados";
import PedidoPersonalizado from "./pedido-personalizado";

export default async function PaginaPersonalizado({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== confeiteira.slug || !confeiteira.aceitaPersonalizado) notFound();

  return <PedidoPersonalizado confeiteira={confeiteira} slug={slug} />;
}
