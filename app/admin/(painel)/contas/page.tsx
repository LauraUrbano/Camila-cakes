import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { contas } from "@/lib/bd/admin";
import { acessoDasContas } from "@/lib/bd/acesso";
import TabelaContas from "./tabela";

export default async function Contas() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }
  const exec = executorNeon();
  const [lista, acessos] = await Promise.all([
    contas(exec),
    acessoDasContas(exec),
  ]);
  return <TabelaContas lista={lista} acessos={acessos} />;
}
