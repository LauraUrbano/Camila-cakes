import type { MetadataRoute } from "next";
import { url } from "@/lib/seo";

/**
 * O painel de cada confeitaria e o da plataforma não têm nada que ser
 * indexados: são privados, e um resultado de busca que leve a um ecrã de
 * entrada só gasta o tempo de quem lá vai parar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/entrar"] },
    ],
    sitemap: url("/sitemap.xml"),
    host: url(),
  };
}
