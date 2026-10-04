-- Quem pede acesso ao Cakelyo.
--
-- O botão dos planos tem de levar a algum lado, e enquanto não houver
-- registo com senha nem Stripe ligado, o destino honesto é este: a
-- confeitaria deixa o contacto e a conta é aberta no painel da plataforma.
-- Guardar o pedido — e não só enviá-lo por email — é o que permite saber
-- quantas pessoas pediram, quais ficaram sem resposta e de onde vieram.
--
-- Chama-se inscrições e não pedidos porque `pedidos` são as encomendas de
-- bolos. Duas coisas com o mesmo nome na mesma base dão enganos difíceis de
-- desfazer.
create table inscricoes (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null,
  email          text not null,
  telefone       text not null default '',
  cidade         text not null,
  pais           text not null check (pais in ('PT', 'CH', 'BR')),
  moeda          text not null check (moeda in ('EUR', 'CHF', 'BRL')),
  plano_id       text not null references planos (id),
  periodo        text not null default 'mensal' check (periodo in ('mensal', 'anual')),
  slug_desejado  text not null default '',
  mensagem       text not null default '',
  estado         text not null default 'nova' check (
    estado in ('nova', 'contactada', 'aberta', 'recusada')
  ),
  -- Fica a apontar para a conta quando ela for aberta, para o pedido ter
  -- fim e não ficar na caixa de entrada para sempre.
  confeiteira_id uuid references confeiteiras (id) on delete set null,
  criada_em      timestamptz not null default now(),
  tratada_em     timestamptz
);

create index inscricoes_por_estado on inscricoes (estado, criada_em desc);

-- Um email por pedido em aberto: quem carrega duas vezes no botão não cria
-- duas inscrições, e quem voltar a pedir depois de ser atendido cria uma
-- nova, que é o que se quer.
create unique index inscricoes_abertas_por_email
  on inscricoes (lower(email))
  where estado = 'nova';
