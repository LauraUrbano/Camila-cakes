import type { Metadata } from "next";
import { prestador } from "@/lib/bd/legal";
import { url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Informações legais",
  description:
    "Identificação do prestador, livro de reclamações, resolução de litígios e cookies.",
  alternates: { canonical: "/legal" },
  openGraph: { title: "Informações legais do Cakelyo", url: url("/legal") },
};

const cookies = [
  {
    nome: "cakelyo_lingua",
    para: "Guarda a língua escolhida, para a página não voltar ao início em cada visita.",
    quanto: "1 ano",
  },
  {
    nome: "cakelyo_moeda",
    para: "Guarda a moeda em que os preços são mostrados.",
    quanto: "1 ano",
  },
  {
    nome: "cakelyo_sessao",
    para: "Mantém a confeitaria autenticada no seu painel.",
    quanto: "30 dias",
  },
  {
    nome: "cakelyo_admin",
    para: "Mantém a sessão do painel da plataforma.",
    quanto: "12 horas",
  },
];

export default async function Legal() {
  const p = await prestador();

  return (
    <>
      <h1>Informações legais</h1>

      <h2>Identificação do prestador</h2>
      <ul>
        <li>
          <strong>Denominação:</strong> {p.nome}
        </li>
        <li>
          <strong>Sede:</strong> {p.morada}
        </li>
        <li>
          <strong>NIF:</strong> {p.nif}
        </li>
        <li>
          <strong>Email:</strong> {p.email}
        </li>
        <li>
          <strong>Telefone:</strong> {p.telefone}
        </li>
      </ul>
      <p>
        O Cakelyo é um serviço de software que fornece às confeitarias uma
        página de cardápio e uma ferramenta de gestão de encomendas. Não vende
        bolos nem intermedeia pagamentos entre as confeitarias e os seus
        clientes.
      </p>

      <h2>Livro de reclamações</h2>
      <p>
        Está disponível o livro de reclamações electrónico. Qualquer reclamação
        sobre o serviço Cakelyo pode ser apresentada em{" "}
        <a
          href={p.livroReclamacoes}
          target="_blank"
          rel="noopener noreferrer"
        >
          livroreclamacoes.pt
        </a>
        .
      </p>
      <p>
        <strong>Atenção a quem encomendou um bolo:</strong> se a sua reclamação
        é sobre uma encomenda — o bolo, o preço, a data, a entrega — ela é com a
        confeitaria a quem encomendou, não connosco. Cada confeitaria tem as
        suas próprias obrigações e o seu próprio livro de reclamações. Na página
        dela encontra os contactos.
      </p>

      <h2>Resolução alternativa de litígios</h2>
      <p>
        Em caso de litígio de consumo, pode recorrer a uma entidade de resolução
        alternativa de litígios. A lista oficial está disponível no Portal do
        Consumidor, em{" "}
        <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer">
          consumidor.gov.pt
        </a>
        . A Comissão Europeia disponibiliza ainda a plataforma de resolução de
        litígios em linha, em{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        Só usamos cookies necessários ao funcionamento. Não há publicidade nem
        análise de tráfego, por isso não há consentimento a pedir.
      </p>
      <ul>
        {cookies.map((cookie) => (
          <li key={cookie.nome}>
            <strong>{cookie.nome}</strong> — {cookie.para} Dura {cookie.quanto}.
          </li>
        ))}
      </ul>

      <h2>Propriedade intelectual</h2>
      <p>
        A marca Cakelyo, o seu logótipo e o software são nossos. Os cardápios,
        textos e fotografias publicados por cada confeitaria são dela.
      </p>
    </>
  );
}
