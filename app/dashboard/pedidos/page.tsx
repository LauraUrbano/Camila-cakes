import { lojaPrincipal } from "@/lib/dados";
import ListaDePedidos from "./lista-de-pedidos";

export default function PaginaDePedidos() {
  return (
    <ListaDePedidos
      iniciais={lojaPrincipal.pedidos}
      codigo={lojaPrincipal.confeiteira.moeda}
    />
  );
}
