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
