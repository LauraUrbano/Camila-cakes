import type { MetadataRoute } from "next";
import { todasAsMontras } from "@/lib/fonte";
import { url } from "@/lib/seo";

/**
 * O mapa inclui as páginas das confeitarias, que são o que há de público e
 * de vivo no site — cada uma com os seus produtos. Uma conta suspensa fica
 * de fora: está fora do ar, não faz sentido convidar ninguém a ir lá.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixas: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/precos"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/assinar"), changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const lojas = await todasAsMontras();
    const paginas = lojas.flatMap((loja) => [
      {
        url: url(`/${loja.confeiteira.slug}`),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      ...loja.produtos.map((produto) => ({
        url: url(`/${loja.confeiteira.slug}/produto/${produto.id}`),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ]);
    return [...fixas, ...paginas];
  } catch {
    // Sem base de dados o mapa ainda sai, só com as páginas do produto.
    return fixas;
  }
}
