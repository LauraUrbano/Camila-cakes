import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { fotoDoProduto } from "@/lib/bd/cardapio";

/**
 * Serve a fotografia de um produto. Pública: é a imagem do cardápio dela.
 *
 * A versão vai no caminho e não numa interrogação porque o `next/image`
 * recusa endereços locais com query string — e é por ele que esta imagem
 * passa em todos os ecrãs.
 */
export async function GET(
  _pedido: Request,
  { params }: { params: Promise<{ slug: string; chave: string }> },
) {
  const { slug, chave } = await params;
  if (!temBaseDeDados()) return new Response("Sem foto", { status: 404 });

  const foto = await fotoDoProduto(executorNeon(), slug, chave);
  if (!foto) return new Response("Sem foto", { status: 404 });

  return new Response(new Uint8Array(foto.bytes), {
    headers: {
      "Content-Type": foto.tipo,
      "Content-Length": String(foto.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
