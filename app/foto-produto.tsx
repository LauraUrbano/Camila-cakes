import Image from "next/image";
import Icone from "@/app/icones";

/**
 * A foto de um produto — ou o lugar dela.
 *
 * Nem toda a confeiteira tem foto de tudo no dia em que abre a página, e um
 * `<img src="">` pede a página inteira outra vez ao servidor. Sem foto fica
 * a cor do produto com o desenho de um bolo por cima, que se lê como "ainda
 * não há foto" em vez de parecer um erro.
 */
export default function FotoProduto({
  foto,
  nome,
  cor,
  className = "",
  sizes,
  priority = false,
}: {
  foto: string;
  nome: string;
  cor: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: cor }}
    >
      {foto ? (
        <Image
          src={foto}
          alt={nome}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center">
          <Icone nome="bolo" className="h-1/3 w-1/3 max-h-16 max-w-16 opacity-25" />
        </span>
      )}
    </div>
  );
}
