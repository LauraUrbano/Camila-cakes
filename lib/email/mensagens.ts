import { moldar, CORES_CAKELYO, type CoresDoEmail } from "./modelo";
import { enviarSemBloquear } from "./enviar";
import { moeda } from "@/lib/precos";
import { SITE } from "@/lib/seo";
import type { Moeda, Tema } from "@/lib/tipos";

/** O tema da confeitaria serve de cores ao email dela. */
function cores(tema?: Tema): CoresDoEmail {
  if (!tema) return CORES_CAKELYO;
  return {
    marca: tema.marca,
    marcaSuave: tema.marcaSuave,
    fundo: tema.fundo,
    texto: tema.texto,
  };
}

const RODAPE_CAKELYO =
  `Recebeste este email porque tens uma conta no Cakelyo. ` +
  `<a href="${SITE}" style="color:inherit">cakelyo.app</a>`;

// ------------------------------------------------- primeira entrada

export function emailDeBoasVindas(dados: {
  para: string;
  nome: string;
  slug: string;
  senha: string;
}) {
  const html = moldar({
    titulo: "A tua página está pronta.",
    preTexto: `Entra em cakelyo.app/entrar e vê a página da ${dados.nome}.`,
    remetente: "Cakelyo",
    saudacao: `Olá! A conta da <strong>${dados.nome}</strong> já está aberta.`,
    paragrafos: [
      `A tua página pública está em <a href="${SITE}/${dados.slug}" style="color:${CORES_CAKELYO.marca}">cakelyo.app/${dados.slug}</a>. ` +
        `É esse o endereço que podes pôr na bio do Instagram, no story ou numa conversa.`,
      `Para entrares no painel, onde recebes as encomendas e mexes no cardápio, usa estes dados:`,
    ],
    linhas: [
      { rotulo: "Endereço", valor: `${SITE}/entrar` },
      { rotulo: "Email", valor: dados.para, forte: true },
      { rotulo: "Senha", valor: dados.senha, forte: true },
    ],
    botao: { texto: "Entrar no painel", href: `${SITE}/entrar` },
    nota:
      "<strong>Troca a senha na primeira vez que entrares.</strong> " +
      "Está em Conta, no menu do painel. A que te demos serve só para a primeira entrada.",
    rodape: RODAPE_CAKELYO,
  });

  enviarSemBloquear({
    para: dados.para,
    assunto: `A página da ${dados.nome} está pronta`,
    html,
  });
}

// --------------------------------------------- encomenda que chega

export type ResumoPedido = {
  referencia: string;
  cliente: string;
  telefone: string;
  entregaEm: string;
  entregaNome: string;
  total: number;
  moeda: Moeda;
  itens: string[];
  personalizado: boolean;
};

/** Para a confeitaria: chegou uma encomenda e está à espera dela. */
export function emailDeNovaEncomenda(dados: {
  para: string;
  confeitaria: string;
  slug: string;
  tema?: Tema;
  pedido: ResumoPedido;
}) {
  const { pedido } = dados;
  const c = cores(dados.tema);

  const html = moldar({
    titulo: `Nova encomenda de ${pedido.cliente}`,
    preTexto: `${pedido.referencia} · ${pedido.entregaEm} · está à espera do teu aceite.`,
    remetente: dados.confeitaria,
    cores: c,
    paragrafos: [
      pedido.personalizado
        ? "Chegou um pedido de orçamento pela tua página."
        : "Chegou uma encomenda pela tua página.",
      ...(pedido.itens.length ? [pedido.itens.join("<br>")] : []),
    ],
    linhas: [
      { rotulo: "Referência", valor: pedido.referencia },
      { rotulo: "Cliente", valor: pedido.cliente },
      ...(pedido.telefone ? [{ rotulo: "Contacto", valor: pedido.telefone }] : []),
      ...(pedido.entregaEm ? [{ rotulo: "Para", valor: pedido.entregaEm }] : []),
      ...(pedido.entregaNome
        ? [{ rotulo: "Entrega", valor: pedido.entregaNome }]
        : []),
      {
        rotulo: "Total",
        valor: pedido.personalizado
          ? "a orçar"
          : moeda(pedido.total, pedido.moeda),
        forte: true,
      },
    ],
    botao: { texto: "Ver no painel", href: `${SITE}/dashboard/pedidos` },
    nota:
      "<strong>A data ainda não está na tua agenda.</strong> " +
      "Combina o pagamento com a cliente e aceita o pedido para a reservar.",
    rodape: RODAPE_CAKELYO,
  });

  enviarSemBloquear({
    para: dados.para,
    assunto: `${pedido.referencia} — nova encomenda de ${pedido.cliente}`,
    html,
  });
}

// ------------------------------------------- resposta ao que pediu

/** Para a cliente: a confeitaria respondeu ao pedido dela. */
export function emailDeRespostaAoCliente(dados: {
  para: string;
  confeitaria: string;
  slug: string;
  tema?: Tema;
  emailDaConfeitaria?: string;
  pedido: ResumoPedido;
  aceite: boolean;
}) {
  const { pedido, confeitaria } = dados;
  const c = cores(dados.tema);

  const html = dados.aceite
    ? moldar({
        titulo: "A tua encomenda foi aceite.",
        preTexto: `${confeitaria} confirmou ${pedido.referencia}. A data está reservada.`,
        remetente: confeitaria,
        cores: c,
        saudacao: `Olá ${pedido.cliente},`,
        paragrafos: [
          `A <strong>${confeitaria}</strong> aceitou o teu pedido. A data está reservada.`,
        ],
        linhas: [
          { rotulo: "Referência", valor: pedido.referencia },
          ...(pedido.entregaEm ? [{ rotulo: "Para", valor: pedido.entregaEm }] : []),
          ...(pedido.entregaNome
            ? [{ rotulo: "Entrega", valor: pedido.entregaNome }]
            : []),
          ...(pedido.personalizado
            ? []
            : [
                {
                  rotulo: "Total",
                  valor: moeda(pedido.total, pedido.moeda),
                  forte: true,
                },
              ]),
        ],
        botao: { texto: `Ver ${confeitaria}`, href: `${SITE}/${dados.slug}` },
        nota: `Qualquer dúvida sobre a encomenda, o pagamento ou a entrega fala directamente com a ${confeitaria} — é com ela que combinas tudo.`,
        rodape: `Recebeste este email porque fizeste uma encomenda a ${confeitaria}. A página dela é feita no Cakelyo, que não vende bolos nem recebe pagamentos.`,
      })
    : moldar({
        titulo: "A tua encomenda não foi aceite.",
        preTexto: `${confeitaria} não pôde aceitar ${pedido.referencia}.`,
        remetente: confeitaria,
        cores: c,
        saudacao: `Olá ${pedido.cliente},`,
        paragrafos: [
          `A <strong>${confeitaria}</strong> não pôde aceitar o pedido ${pedido.referencia}. ` +
            `Pode ser a data, pode ser a agenda cheia — vale a pena falar com ela, que às vezes há volta.`,
        ],
        botao: { texto: `Falar com ${confeitaria}`, href: `${SITE}/${dados.slug}` },
        rodape: `Recebeste este email porque fizeste um pedido a ${confeitaria}. A página dela é feita no Cakelyo, que não vende bolos nem recebe pagamentos.`,
      });

  enviarSemBloquear({
    para: dados.para,
    assunto: dados.aceite
      ? `${confeitaria} aceitou a tua encomenda (${pedido.referencia})`
      : `Sobre o teu pedido ${pedido.referencia}`,
    html,
    responderA: dados.emailDaConfeitaria,
  });
}
