import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { inscricoes } from "@/lib/bd/inscricoes";
import PainelInscricoes from "./painel";

export default async function Inscricoes() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }
  return <PainelInscricoes lista={await inscricoes(executorNeon())} />;
}
