import Link from "next/link";
import { temBaseDeDados } from "@/lib/bd/cliente";
import type { Moeda, Pais } from "@/lib/tipos";
import FormularioConta from "./formulario";

/**
 * Os parâmetros servem para abrir a conta a partir de um pedido de acesso: a
 * inscrição já traz nome, cidade, país e moeda, e reescrevê-los à mão era
 * onde se trocava um dado.
 */
export default async function NovaConta({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const texto = (chave: string) =>
    typeof p[chave] === "string" ? (p[chave] as string) : "";

  return (
    <div>
      <Link
        href="/admin/contas"
        className="text-xs text-suave underline underline-offset-2"
      >
        ← Contas
      </Link>

      <h1 className="mt-4 text-2xl">Criar conta</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        Para abrir a conta de uma confeitaria aqui, sem ela passar pelo
        registo. Fica com a página de pé — formas de entrega e um cardápio
        vazio — e ela muda depois o que quiser.
      </p>

      {temBaseDeDados() ? (
        <FormularioConta
          inicial={{
            nome: texto("nome"),
            slug: texto("slug"),
            cidade: texto("cidade"),
            pais: (texto("pais") || "PT") as Pais,
            moeda: (texto("moeda") || "EUR") as Moeda,
            planoId: texto("plano") || "pastelaria",
            email: texto("email"),
          }}
        />
      ) : (
        <p className="mt-8 text-sm text-suave">Sem base de dados ligada.</p>
      )}
    </div>
  );
}
