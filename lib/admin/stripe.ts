/**
 * O que se pode dizer sobre as chaves do Stripe sem as mostrar.
 *
 * As chaves vivem no ambiente, não na base: uma fuga da base levaria a
 * faturação atrás, e um formulário web fá-las-ia passar pelo browser. Daqui
 * sai só o que chega para saber se está tudo no sítio — se existe, se é de
 * teste ou de produção, e os últimos quatro caracteres para as distinguir.
 */
export type EstadoDaChave = {
  nome: string;
  descricao: string;
  presente: boolean;
  modo?: "teste" | "producao";
  fim?: string;
};

function fim(valor: string): string {
  return valor.slice(-4);
}

function modoDaChave(valor: string): "teste" | "producao" | undefined {
  if (valor.includes("_test_")) return "teste";
  if (valor.includes("_live_")) return "producao";
  return undefined;
}

export function estadoDasChaves(): EstadoDaChave[] {
  const chaves: { nome: string; descricao: string }[] = [
    {
      nome: "STRIPE_SECRET_KEY",
      descricao: "Cobra e cria assinaturas. Nunca sai do servidor.",
    },
    {
      nome: "STRIPE_WEBHOOK_SECRET",
      descricao:
        "Confirma que um webhook veio mesmo do Stripe, e não de alguém a fingir.",
    },
    {
      nome: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      descricao: "Pública por desenho — vai no browser, não cobra nada.",
    },
  ];

  return chaves.map(({ nome, descricao }) => {
    const valor = process.env[nome];
    return valor
      ? {
          nome,
          descricao,
          presente: true,
          modo: modoDaChave(valor),
          fim: fim(valor),
        }
      : { nome, descricao, presente: false };
  });
}
