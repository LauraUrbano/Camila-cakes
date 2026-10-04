import type { Metadata } from "next";
import Link from "next/link";
import { prestador } from "@/lib/bd/legal";
import { url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Que dados o Cakelyo trata, com que finalidade e com que direitos.",
  alternates: { canonical: "/privacidade" },
  openGraph: {
    title: "Política de privacidade do Cakelyo",
    url: url("/privacidade"),
  },
};

const ACTUALIZADO = "4 de outubro de 2026";

export default async function Privacidade() {
  const p = await prestador();

  return (
    <>
      <h1>Política de privacidade</h1>
      <p className="!mt-4 text-sm">Última actualização: {ACTUALIZADO}</p>

      <p>
        Esta política explica que dados pessoais tratamos, porquê, durante
        quanto tempo e o que se pode fazer quanto a isso. Responsável pelo
        tratamento: {p.nome}, {p.morada}, NIF {p.nif}. Para qualquer assunto de
        privacidade: {p.email}.
      </p>

      <h2>1. Há aqui dois papéis diferentes, e é importante distingui-los</h2>
      <p>
        O Cakelyo trata dois conjuntos de dados que não se confundem.
      </p>
      <h3>Dados de quem tem conta connosco (a confeitaria)</h3>
      <p>
        Nome do negócio, email, telefone, cidade, país e o registo da
        assinatura. Destes somos <strong>responsáveis pelo tratamento</strong>:
        decidimos porque os temos e o que fazemos com eles.
      </p>
      <h3>Dados dos clientes da confeitaria</h3>
      <p>
        Nome, contacto e o conteúdo das encomendas de quem encomenda bolos.
        Destes somos apenas <strong>subcontratantes</strong>: a responsável é a
        confeitaria. Nós guardamo-los e mostramo-los a ela porque é o que o
        serviço faz, e não os usamos para mais nada — não os vendemos, não os
        cruzamos entre contas e não enviamos publicidade a ninguém. Quem quiser
        exercer direitos sobre esses dados deve falar com a confeitaria a quem
        encomendou; se nos contactar a nós, encaminhamos.
      </p>

      <h2>2. O que tratamos e com que fundamento</h2>
      <ul>
        <li>
          <strong>Conta e acesso</strong> — nome, email, senha guardada cifrada,
          data da última entrada. Base legal: execução do contrato.
        </li>
        <li>
          <strong>Encomendas</strong> — nome e contacto do cliente final, o que
          pediu, data e estado. Por conta da confeitaria.
        </li>
        <li>
          <strong>Pedidos de acesso</strong> — nome, email, telefone, cidade e
          plano pretendido de quem pede conta. Base legal: diligências
          pré-contratuais.
        </li>
        <li>
          <strong>Faturação</strong> — valores, datas e estado de pagamento da
          assinatura. Base legal: obrigação legal.
        </li>
        <li>
          <strong>Avaliações</strong> — o nome que quem avalia escrever e o
          texto da avaliação. Base legal: interesse legítimo em mostrar
          avaliações, com o cuidado de não exigir mais do que um primeiro nome.
        </li>
      </ul>
      <p>
        Não usamos ferramentas de análise de tráfego, não fazemos perfis e não
        há publicidade no serviço.
      </p>

      <h2>3. Quem mais toca nos dados</h2>
      <p>
        Trabalhamos com fornecedores que alojam a aplicação e a base de dados.
        São estes:
      </p>
      <ul>
        <li>
          <strong>Neon</strong> — base de dados, alojada na União Europeia
          (Frankfurt, Alemanha).
        </li>
        <li>
          <strong>Vercel</strong> — alojamento e entrega da aplicação.
        </li>
        <li>
          <strong>Stripe</strong> — processamento das assinaturas, quando
          estiver activo. Os dados do cartão são tratados pelo Stripe e nunca
          passam pelos nossos servidores.
        </li>
      </ul>
      <p>
        Alguns destes fornecedores podem tratar dados fora do Espaço Económico
        Europeu. Nesses casos aplicam-se as cláusulas contratuais-tipo aprovadas
        pela Comissão Europeia.
      </p>

      <h2>4. Clientes fora da União Europeia</h2>
      <p>
        Há confeitarias na Suíça e no Brasil. Os dados continuam a ser guardados
        na União Europeia. Aplicam-se, conforme o caso, a LPD suíça e a LGPD
        brasileira, cujos direitos são equivalentes aos descritos abaixo.
      </p>

      <h2>5. Quanto tempo guardamos</h2>
      <ul>
        <li>Dados da conta: enquanto a conta existir.</li>
        <li>
          Encomendas e avaliações: enquanto a conta existir, porque são o
          histórico do negócio da confeitaria.
        </li>
        <li>
          Faturação: dez anos, que é o prazo que a lei fiscal portuguesa
          obriga.
        </li>
        <li>
          Depois de encerrada a conta: apagamos no prazo de 30 dias, salvo o
          que a lei obrigue a conservar.
        </li>
      </ul>

      <h2>6. Direitos</h2>
      <p>
        Pode pedir acesso aos seus dados, correcção, apagamento, limitação,
        portabilidade e oposição, e retirar consentimentos que tenha dado.
        Escreva para {p.email} — respondemos no prazo de um mês. Se achar que
        tratámos mal os seus dados, pode reclamar à Comissão Nacional de
        Protecção de Dados.
      </p>

      <h2>7. Segurança</h2>
      <p>
        As senhas são guardadas com um algoritmo lento e com sal, nunca em
        claro. As sessões são assinadas. A ligação é cifrada. O acesso à base de
        dados é limitado a quem precisa dele. Nenhuma destas medidas torna um
        sistema infalível, mas são as que se devem tomar.
      </p>

      <h2>8. Cookies</h2>
      <p>
        O Cakelyo só usa cookies essenciais — a língua, a moeda e a sessão de
        quem entra. Não há cookies de publicidade nem de análise, e por isso não
        há banner a pedir consentimento. A lista está em{" "}
        <Link href="/legal">informações legais</Link>.
      </p>
    </>
  );
}
