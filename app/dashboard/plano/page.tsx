import { lojaPrincipal, planos } from "@/lib/dados";
import { dicionarioActual } from "@/lib/i18n/servidor";
import PainelPlano from "./painel-plano";

export default async function PaginaDoPlano() {
  const pl = (await dicionarioActual()).painel.plano;
  const { confeiteira, produtos, colecoes, pedidos, assinatura } =
    lojaPrincipal;

  return (
    <PainelPlano
      planos={planos}
      inicial={assinatura}
      codigo={confeiteira.moeda}
      consumo={[
        { rotulo: pl.produtos, usado: produtos.length },
        { rotulo: pl.colecoes, usado: colecoes.length },
        { rotulo: pl.encomendasMes, usado: pedidos.length },
      ]}
    />
  );
}
