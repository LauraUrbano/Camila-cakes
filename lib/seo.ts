/**
 * O endereço público do site.
 *
 * Hoje quem serve é o www — o apex redireciona para lá. Fica numa variável
 * para que, quando a redirecção for ao contrário, isto mude num sítio só e
 * não em quinze `metadata` espalhados.
 */
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.cakelyo.app";

export function url(caminho = "/"): string {
  return `${SITE}${caminho}`;
}
