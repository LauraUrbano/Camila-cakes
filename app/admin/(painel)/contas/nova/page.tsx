import Link from "next/link";
import { temBaseDeDados } from "@/lib/bd/cliente";
import FormularioConta from "./formulario";

export default function NovaConta() {
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
        <FormularioConta />
      ) : (
        <p className="mt-8 text-sm text-suave">Sem base de dados ligada.</p>
      )}
    </div>
  );
}
