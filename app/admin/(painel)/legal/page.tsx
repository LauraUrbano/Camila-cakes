import Link from "next/link";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { definicoes } from "@/lib/bd/admin";
import { prestador, prestadorIncompleto } from "@/lib/bd/legal";
import PainelLegal from "./painel";

export default async function Legal() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }

  const todas = await definicoes(executorNeon());
  const legais = todas.filter(
    (d) => d.chave.startsWith("empresa_") || d.chave === "livro_reclamacoes",
  );
  const falta = prestadorIncompleto(await prestador());

  return (
    <div>
      <h1 className="text-2xl">Dados da empresa</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        É o que aparece nos{" "}
        <Link href="/termos" className="underline underline-offset-2">
          termos
        </Link>
        , na{" "}
        <Link href="/privacidade" className="underline underline-offset-2">
          privacidade
        </Link>{" "}
        e nas{" "}
        <Link href="/legal" className="underline underline-offset-2">
          informações legais
        </Link>
        . A lei obriga a identificar quem presta o serviço.
      </p>

      {falta.length > 0 && (
        <p className="mt-6 rounded-2xl border border-marca bg-marca-suave p-5 text-sm leading-relaxed">
          <strong>Falta preencher:</strong> {falta.join(", ")}. Enquanto não
          estiver, as páginas legais mostram um traço no lugar — melhor do que
          um dado inventado, mas não serve para estar no ar a sério.
        </p>
      )}

      <PainelLegal lista={legais} />
    </div>
  );
}
