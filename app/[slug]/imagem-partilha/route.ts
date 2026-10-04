import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { imagemPartilha } from "@/lib/bd/pagina";

/**
 * Serve a imagem de partilha da confeitaria.
 *
 * Tem de ser pública e sem sessão: quem a vai buscar é o robô do WhatsApp ou
 * do Facebook, que não tem cookies nem faz login. A cache é longa porque o
 * endereço muda de versão a cada troca de imagem.
 */
export async function GET(
  _pedido: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!temBaseDeDados()) return new Response("Sem imagem", { status: 404 });

  const imagem = await imagemPartilha(executorNeon(), slug);
  if (!imagem) return new Response("Sem imagem", { status: 404 });

  return new Response(new Uint8Array(imagem.bytes), {
    headers: {
      "Content-Type": imagem.tipo,
      "Content-Length": String(imagem.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
