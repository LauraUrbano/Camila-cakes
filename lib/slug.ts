/**
 * Transforma um nome em endereço: "Doces da Sofia" → "doces-da-sofia".
 *
 * Os acentos saem porque o endereço é escrito à mão, ditado ao telefone e
 * colado na bio do Instagram. Vive aqui, e não nas acções do servidor, para
 * o formulário poder mostrar o endereço a formar-se enquanto se escreve.
 */
export function paraSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
