import type { Metadata } from "next";
import Link from "next/link";
import { prestador } from "@/lib/bd/legal";
import { url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Termos de serviço",
  description:
    "As condições de utilização do Cakelyo pelas confeitarias e pastelarias.",
  alternates: { canonical: "/termos" },
  openGraph: { title: "Termos de serviço do Cakelyo", url: url("/termos") },
};

const ACTUALIZADO = "4 de outubro de 2026";

export default async function Termos() {
  const p = await prestador();

  return (
    <>
      <h1>Termos de serviço</h1>
      <p className="!mt-4 text-sm">Última actualização: {ACTUALIZADO}</p>

      <p>
        Estes termos regulam a utilização do Cakelyo por quem cria uma conta
        para gerir o seu negócio de bolos — adiante, <strong>a confeitaria</strong>.
        O serviço é prestado por {p.nome}, com sede em {p.morada} e número de
        identificação fiscal {p.nif}.
      </p>

      <h2>1. O que o Cakelyo é</h2>
      <p>
        O Cakelyo é uma ferramenta. Dá à confeitaria uma página pública onde
        publica o seu cardápio, e um painel onde recebe e gere pedidos de
        encomenda, define preços por combinação, organiza coleções e consulta
        relatórios.
      </p>

      <h2>2. O que o Cakelyo não é</h2>
      <p>
        Esta secção é a mais importante de todo o documento, por isso está
        escrita sem rodeios.
      </p>
      <p>
        <strong>
          O Cakelyo não vende bolos, não recebe pagamentos de clientes finais e
          não é parte no contrato entre a confeitaria e quem lhe encomenda.
        </strong>{" "}
        Não somos um marketplace nem um intermediário de pagamentos.
      </p>
      <p>
        Um pedido feito na página de uma confeitaria é um <strong>pedido de
        reserva</strong>. Não vincula ninguém enquanto a confeitaria não o
        aceitar. O preço, a forma de pagamento, a data, a entrega e tudo o
        resto são combinados directamente entre a confeitaria e o seu cliente,
        pelos meios que ambos escolherem. Esse dinheiro nunca passa por nós.
      </p>
      <p>Em consequência, a confeitaria é a única responsável por:</p>
      <ul>
        <li>o produto, a sua qualidade, composição e conservação;</li>
        <li>
          a segurança alimentar e a informação sobre alergénios e ingredientes;
        </li>
        <li>os preços praticados e o cumprimento das datas combinadas;</li>
        <li>
          a cobrança, a emissão de factura e as obrigações fiscais da sua
          actividade;
        </li>
        <li>
          o cumprimento da lei do consumo perante os seus clientes, incluindo
          garantias, devoluções e reclamações;
        </li>
        <li>
          tudo o que publica na sua página — textos, fotografias, preços — e o
          direito de o publicar.
        </li>
      </ul>
      <p>
        No sentido inverso: o Cakelyo também não responde por dívidas, atrasos
        ou condutas dos clientes da confeitaria. Não cobramos por ela nem
        garantimos que lhe paguem.
      </p>

      <h2>3. Conta e acesso</h2>
      <p>
        A conta é pessoal da confeitaria. As credenciais são confidenciais e a
        confeitaria responde pelo que for feito com elas. Se desconfiar que
        alguém lhes acedeu, deve avisar-nos de imediato para {p.email}.
      </p>

      <h2>4. Planos, pagamento e cancelamento</h2>
      <p>
        O primeiro mês é gratuito e não exige cartão. Findo esse período, a
        confeitaria decide se continua num plano pago; se não continuar, a
        conta passa ao plano gratuito e a página mantém-se com os limites desse
        plano. Os preços em vigor estão em{" "}
        <Link href="/precos">cakelyo.app/precos</Link>.
      </p>
      <p>
        As assinaturas renovam-se automaticamente no fim de cada período e
        podem ser canceladas a qualquer momento, com efeito no fim do período
        já pago — não há fidelização nem penalização. Aos valores publicados
        acresce o imposto que for devido conforme o país.
      </p>
      <p>
        Alguns acessos são concedidos por nós sem cobrança, por código ou por
        acordo. Enquanto durarem, não há nada a pagar e não há renovação.
      </p>

      <h2>5. Utilização aceitável</h2>
      <p>
        Não é permitido usar o Cakelyo para actividades ilícitas, para publicar
        conteúdo de terceiros sem direito a isso, para vender o que a lei não
        permite vender, nem para tentar aceder a dados de outras contas. Podemos
        suspender uma conta que o faça, e nesse caso explicamos porquê.
      </p>

      <h2>6. Conteúdos da confeitaria</h2>
      <p>
        O que a confeitaria publica continua a ser dela. Autoriza-nos apenas a
        alojar e mostrar esse conteúdo na sua página pública, que é o que o
        serviço faz. Ao encerrar a conta, deixamos de o mostrar.
      </p>

      <h2>7. Disponibilidade e limites da nossa responsabilidade</h2>
      <p>
        Fazemos o possível para manter o serviço no ar, mas não garantimos que
        funcione sem interrupções: depende de fornecedores de alojamento e de
        base de dados, e qualquer sistema tem avarias e manutenções.
      </p>
      <p>
        A nossa responsabilidade perante a confeitaria está limitada ao valor
        que ela nos tiver pago nos doze meses anteriores ao facto que a origina.
        Nada nestes termos exclui responsabilidade que a lei não permita
        excluir, nomeadamente por dolo ou culpa grave.
      </p>

      <h2>8. Dados pessoais</h2>
      <p>
        O tratamento de dados está explicado na{" "}
        <Link href="/privacidade">política de privacidade</Link>, que faz parte
        destes termos. Em resumo: os dados dos clientes da confeitaria são dela,
        e nós tratamo-los por conta dela.
      </p>

      <h2>9. Alterações</h2>
      <p>
        Estes termos podem mudar. Alterações relevantes são comunicadas por
        email com pelo menos 30 dias de antecedência; continuar a usar o serviço
        depois disso significa aceitá-las. Quem não concordar pode cancelar sem
        custo.
      </p>

      <h2>10. Lei aplicável e resolução de litígios</h2>
      <p>
        Aplica-se a lei portuguesa. Em caso de litígio, pode recorrer-se à
        resolução alternativa de conflitos ou aos tribunais portugueses. As vias
        de reclamação, incluindo o livro de reclamações electrónico, estão em{" "}
        <Link href="/legal">informações legais</Link>.
      </p>
    </>
  );
}
