# Cakelyo

Plataforma para quem vende bolo por encomenda. Cada confeiteira cria sua conta,
ganha uma página pública própria (`/camila-cakes`), monta o cardápio uma vez e
recebe os pedidos já formatados — com o preço da combinação calculado sozinho.

> **Este repositório está em fase de protótipo.** Tudo o que aparece na tela vem
> de dados fake em `lib/dados.ts`. Não existe banco, login nem persistência: o
> objetivo agora é validar as telas e as regras antes de modelar o Supabase.

## Rodando

```bash
npm install
npm run dev
```

## O que já dá para ver

| Rota | O que é |
| --- | --- |
| `/` | Página inicial da plataforma |
| `/camila-cakes` | Página pública da confeiteira, com as coleções no ar |
| `/camila-cakes/produto/bolo-festa` | Montador de bolo com preço ao vivo |
| `/camila-cakes/personalizado` | Pedido de orçamento fora do cardápio |
| `/dashboard` | Painel da confeiteira |
| `/dashboard/pedidos` | Aceitar, recusar e acompanhar pedidos |
| `/dashboard/cardapio` | Tamanhos, massas, recheios e decorações com seus preços |
| `/dashboard/colecoes` | Coleções sazonais no ar e fora do ar |
| `/dashboard/pagina` | Endereço, domínio próprio, cores e textos |

## Cobrança e mercados

A empresa fica em **Portugal**, com **uma conta Stripe portuguesa** a liquidar
em euros. Vendemos à Europa e ao Brasil.

Os planos têm preço próprio em cada moeda — euro, franco suíço e real — e o
anual equivale sempre a dez meses. Cada plano vira um Product no Stripe e cada
linha de preço um Price, por isso os valores vivem separados por moeda e por
período em `lib/dados.ts`.

**O Brasil tem um problema que o código não resolve sozinho.** Como faturamos
de Portugal, um cartão brasileiro trata a cobrança como compra internacional:
o banco soma IOF e spread cambial, cerca de 7% acima do preço da tabela, e
isso aparece na fatura da cliente, não na nossa. A resposta é o **plano anual
pago por Pix** — pagamento local em reais, sem IOF e sem câmbio, uma vez por
ano. O mensal por cartão continua disponível, com o aviso à vista em /precos.

O acesso vitalício por código **não passa pelo Stripe**: não tem subscription,
não renova e não gera fatura. Por isso a assinatura guarda a origem
(`stripe` ou `codigo`) — ver `lib/tipos.ts`.

⚠️ Os detalhes fiscais e as regras do Stripe por país mudam. Confirmar com o
Stripe e com contabilista antes de ligar a cobrança a sério.

## Línguas

Cinco: português europeu, português do Brasil, inglês, francês e alemão. A
língua é escolhida pelo `Accept-Language` do navegador à entrada, guardada num
cookie e trocável no seletor do rodapé.

**A língua não vai no endereço**, de propósito. A promessa do produto é um link
limpo — `cakelyo.app/o-teu-nome` — e um prefixo daria
`cakelyo.app/pt-PT/o-teu-nome`. O preço disso é que as páginas leem o cookie e
passam a ser renderizadas a pedido, sem pré-geração estática. Se um dia o SEO
por língua pesar mais do que o link curto, as páginas de marketing podem ganhar
prefixo sem tocar nas páginas das pasteleiras.

**A moeda segue a região, não a língua.** Um suíço que navegue em inglês vê
francos; um brasileiro que navegue em inglês vê reais. São dois sinais
diferentes e não devem andar colados.

**Traduz-se a moldura, não o conteúdo.** Os botões, rótulos e textos da
plataforma mudam de língua. O que a pasteleira escreve — a bio, os nomes dos
bolos, o aviso de pagamento — fica como ela escreveu, porque é dela e ela sabe
com quem fala. Por isso o motor de preços em `lib/precos.ts` devolve chaves
("premium", "acrescimo") em vez de frases: o nome do recheio é dela, a palavra
"acréscimo" é nossa.

O português europeu é a fonte de verdade: o tipo `Dicionario` é derivado de
`lib/i18n/pt-PT.ts`, por isso uma chave em falta noutra língua rebenta na
compilação em vez de aparecer em branco na página.

Em francês e alemão trata-se por "vous" e "Sie". O manual da marca pede
informalidade, mas tutear uma pasteleira desconhecida nesses mercados soa
atrevido. É uma linha por dicionário, se quiseres mudar.

## As duas regras que sustentam o produto

**1. Preço por combinação.** A confeiteira não digita o preço de cada bolo
possível. Ela define o preço de cada *tamanho* — que também determina quantos
recheios cabem — e o acréscimo de cada massa, recheio e decoração. O total sai
da soma da combinação que a cliente montar. A conta vive em `lib/precos.ts`.

**2. O pedido precisa ser aceito.** Um pedido enviado pelo site é uma reserva,
não um compromisso. A data só entra na agenda quando a confeiteira aceita,
normalmente depois de combinar o pagamento por fora (Pix, WhatsApp). Isso está
dito de forma explícita na tela de envio, na confirmação da cliente e no painel.

## Estrutura

```
app/
  page.tsx              página inicial da plataforma
  [slug]/               tudo o que a cliente da confeiteira vê
  dashboard/            tudo o que a confeiteira usa
lib/
  tipos.ts              modelo de domínio (rascunho do schema)
  precos.ts             motor de preço por combinação
  dados.ts              dados de exemplo
```

`lib/tipos.ts` foi escrito para virar tabela: quando o Supabase entrar, cada
tipo daquele arquivo tem uma tabela correspondente e as telas continuam iguais.

## O que ainda não existe

- Banco de dados, contas e login (Supabase)
- Cadastro e edição de verdade — o painel hoje só mostra os dados
- Fotos reais dos produtos (os cards usam emoji e cor de fundo)
- Domínio próprio funcionando de fato
- Formulário de cardápio montado para uma cliente específica
