import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { definicoes } from "@/lib/bd/admin";
import { estadoDasChaves } from "@/lib/admin/stripe";
import PainelStripe from "./painel";

export default async function Stripe() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }
  return (
    <PainelStripe
      chaves={estadoDasChaves()}
      definicoes={await definicoes(executorNeon())}
    />
  );
}
