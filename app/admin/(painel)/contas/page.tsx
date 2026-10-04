import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { contas } from "@/lib/bd/admin";
import TabelaContas from "./tabela";

export default async function Contas() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }
  return <TabelaContas lista={await contas(executorNeon())} />;
}
