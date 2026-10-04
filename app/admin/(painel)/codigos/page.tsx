import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { codigos } from "@/lib/bd/admin";
import PainelCodigos from "./painel";

export default async function Codigos() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }
  return <PainelCodigos lista={await codigos(executorNeon())} />;
}
