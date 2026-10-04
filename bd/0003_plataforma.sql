-- Gestão da plataforma: definições, suspensão de contas e rasto de quem
-- resgatou cada código.

-- Definições editáveis sem voltar a publicar o site. Serve para IDs de preço
-- do Stripe e afins.
--
-- Não serve para segredos. A chave secreta do Stripe fica na variável de
-- ambiente: aqui, uma fuga da base levava a faturação atrás. A coluna
-- `sensivel` existe para o painel saber o que nunca deve mostrar por
-- inteiro, não para dar licença de guardar chaves.
create table definicoes (
  chave          text primary key,
  valor          text not null default '',
  descricao      text not null default '',
  sensivel       boolean not null default false,
  actualizada_em timestamptz not null default now()
);

-- Suspender uma conta tira a página do ar sem apagar nada: a confeiteira
-- volta ao que era se pagar ou se o engano for nosso.
alter table confeiteiras add column suspensa boolean not null default false;
alter table confeiteiras add column suspensa_motivo text;

-- Quem usou cada código. Sem isto, `usos` é um número sem história: não se
-- sabe a quem foi dado o acesso nem se pode retirar a um sem mexer nos
-- outros.
create table resgates (
  codigo         text not null references codigos_vitalicios (codigo) on delete cascade,
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  resgatado_em   timestamptz not null default now(),
  primary key (codigo, confeiteira_id)
);

create index resgates_por_confeiteira on resgates (confeiteira_id);
create index confeiteiras_activas on confeiteiras (criada_em desc) where not suspensa;

insert into definicoes (chave, descricao) values
  ('stripe_price_atelier_eur_mensal',    'Price ID do Stripe: Atelier, euro, mensal'),
  ('stripe_price_atelier_eur_anual',     'Price ID do Stripe: Atelier, euro, anual'),
  ('stripe_price_pastelaria_eur_mensal', 'Price ID do Stripe: Pastelaria, euro, mensal'),
  ('stripe_price_pastelaria_eur_anual',  'Price ID do Stripe: Pastelaria, euro, anual'),
  ('stripe_portal_configuration',        'ID da configuração do portal de faturação'),
  ('stripe_modo',                        'teste ou producao — só informativo')
on conflict (chave) do nothing;
