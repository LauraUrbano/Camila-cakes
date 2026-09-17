import { pedidos } from "@/lib/dados";
import ListaDePedidos from "./lista-de-pedidos";

export default function PaginaDePedidos() {
  return <ListaDePedidos iniciais={pedidos} />;
}
