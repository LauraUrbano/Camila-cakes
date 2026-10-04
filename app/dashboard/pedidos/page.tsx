import { exigirLoja } from "@/lib/fonte";
import ListaDePedidos from "./lista-de-pedidos";

export default async function PaginaDePedidos() {
  const loja = await exigirLoja();

  return (
    <ListaDePedidos
      iniciais={loja.pedidos}
      codigo={loja.confeiteira.moeda}
    />
  );
}
