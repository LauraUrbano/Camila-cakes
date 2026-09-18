import { lojaPrincipal, planos } from "@/lib/dados";
import PainelPlano from "./painel-plano";

export default function PaginaDoPlano() {
  const { confeiteira, produtos, colecoes, pedidos, assinatura } =
    lojaPrincipal;

  return (
    <PainelPlano
      planos={planos}
      inicial={assinatura}
      codigo={confeiteira.moeda}
      consumo={[
        { rotulo: "Produtos", usado: produtos.length },
        { rotulo: "Coleções", usado: colecoes.length },
        { rotulo: "Encomendas este mês", usado: pedidos.length },
      ]}
    />
  );
}
