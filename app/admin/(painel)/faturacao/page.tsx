import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { contas, faturas } from "@/lib/bd/admin";
import { planos } from "@/lib/dados";
import PainelFaturacao from "./painel";

export default async function Faturacao() {
  if (!temBaseDeDados()) {
    return <p className="text-sm text-suave">Sem base de dados ligada.</p>;
  }

  const exec = executorNeon();
  const [lista, lojas] = await Promise.all([faturas(exec), contas(exec)]);

  // A conta chega reduzida ao que o formulário precisa — nome, moeda e o que
  // o plano custa — para não atravessar a fronteira do servidor com métricas
  // que esta página não mostra.
  return (
    <PainelFaturacao
      lista={lista}
      contas={lojas.map((c) => {
        const plano = planos.find((p) => p.id === c.planoId);
        return {
          slug: c.slug,
          nome: c.nome,
          moeda: c.moeda,
          planoId: c.planoId,
          periodo: c.periodo,
          origem: c.origem,
          valorDoPlano: plano ? plano[c.periodo][c.moeda] : 0,
        };
      })}
    />
  );
}
