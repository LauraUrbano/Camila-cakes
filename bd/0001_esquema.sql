-- Esquema inicial do Cakelyo.
--
-- Três decisões que não são óbvias e que custam caro se forem mudadas tarde:
--
-- 1. Dinheiro é numeric(10,2), nunca float. 0,1 + 0,2 em vírgula flutuante
--    não dá 0,3, e isso numa fatura é inaceitável.
--
-- 2. Os itens do pedido guardam o nome e o preço copiados no momento da
--    encomenda, em vez de apontarem para o produto. Se apontassem, renomear
--    um bolo ou subir um preço reescrevia encomendas antigas — e o que a
--    cliente aceitou deixava de ser o que está registado.
--
-- 3. Cada linha pertence a uma confeiteira e nada é partilhado entre contas.
--    As chaves naturais (slug, chave) são únicas por confeiteira, não
--    globalmente: duas pasteleiras podem ter ambas um "bolo-festa".

-- gen_random_uuid() está no núcleo do Postgres desde a versão 13, por isso
-- não é preciso a extensão pgcrypto.

-- ------------------------------------------------------------ confeiteiras

create table confeiteiras (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  nome                 text not null,
  tagline              text not null default '',
  bio                  text not null default '',
  cidade               text not null,
  pais                 text not null check (pais in ('PT', 'CH', 'BR')),
  moeda                text not null check (moeda in ('EUR', 'CHF', 'BRL')),
  whatsapp             text not null default '',
  instagram            text not null default '',
  dominio_proprio      text unique,
  tema                 jsonb not null,
  aceita_personalizado boolean not null default true,
  aviso_pagamento      text not null default '',
  criada_em            timestamptz not null default now()
);

create table entregas (
  id             uuid primary key default gen_random_uuid(),
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  chave          text not null,
  tipo           text not null check (tipo in ('retirada', 'entrega')),
  nome           text not null,
  descricao      text not null default '',
  taxa           numeric(10, 2) not null default 0 check (taxa >= 0),
  ordem          integer not null default 0,
  unique (confeiteira_id, chave)
);

-- ---------------------------------------------------------------- cardápio

create table produtos (
  id                uuid primary key default gen_random_uuid(),
  confeiteira_id    uuid not null references confeiteiras (id) on delete cascade,
  chave             text not null,
  nome              text not null,
  descricao         text not null default '',
  categoria         text not null default '',
  foto              text,
  cor               text not null default '#FCE4D6',
  max_decoracoes    integer not null default 1 check (max_decoracoes >= 0),
  antecedencia_dias integer not null default 0 check (antecedencia_dias >= 0),
  -- Nulo = sem limite de produção. Quando há limite, vendidos nunca o passa.
  limite_total      integer check (limite_total is null or limite_total > 0),
  limite_vendidos   integer not null default 0 check (limite_vendidos >= 0),
  ordem             integer not null default 0,
  activo            boolean not null default true,
  constraint limite_coerente check (
    limite_total is null or limite_vendidos <= limite_total
  ),
  unique (confeiteira_id, chave)
);

create table tamanhos (
  id           uuid primary key default gen_random_uuid(),
  produto_id   uuid not null references produtos (id) on delete cascade,
  chave        text not null,
  nome         text not null,
  porcoes      text not null default '',
  preco        numeric(10, 2) not null check (preco >= 0),
  max_recheios integer not null default 1 check (max_recheios >= 0),
  ordem        integer not null default 0,
  unique (produto_id, chave)
);

create table opcoes (
  id         uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos (id) on delete cascade,
  grupo      text not null check (grupo in ('massa', 'recheio', 'decoracao')),
  chave      text not null,
  nome       text not null,
  acrescimo  numeric(10, 2) not null default 0 check (acrescimo >= 0),
  disponivel boolean not null default true,
  ordem      integer not null default 0,
  unique (produto_id, grupo, chave)
);

-- --------------------------------------------------------------- coleções

create table colecoes (
  id             uuid primary key default gen_random_uuid(),
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  chave          text not null,
  nome           text not null,
  descricao      text not null default '',
  periodo        text not null default '',
  -- As datas são a verdade; `ativa` é o interruptor manual por cima delas.
  comeca_em      date,
  acaba_em       date,
  ativa          boolean not null default true,
  destaque       boolean not null default false,
  ordem          integer not null default 0,
  unique (confeiteira_id, chave)
);

create table colecao_produtos (
  colecao_id uuid not null references colecoes (id) on delete cascade,
  produto_id uuid not null references produtos (id) on delete cascade,
  ordem      integer not null default 0,
  primary key (colecao_id, produto_id)
);

-- --------------------------------------------------------------- encomendas

create table clientes (
  id             uuid primary key default gen_random_uuid(),
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  nome           text not null,
  telefone       text not null default '',
  criado_em      timestamptz not null default now(),
  unique (confeiteira_id, telefone)
);

create table pedidos (
  id             uuid primary key default gen_random_uuid(),
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  referencia     text not null,
  cliente_id     uuid references clientes (id) on delete set null,
  -- Copiados do cliente: a encomenda tem de continuar legível se o contacto
  -- for apagado a pedido dele.
  cliente_nome   text not null,
  telefone       text not null default '',
  criado_em      timestamptz not null default now(),
  entrega_em     date,
  entrega_nome   text not null default '',
  entrega_tipo   text check (entrega_tipo in ('retirada', 'entrega')),
  entrega_taxa   numeric(10, 2) not null default 0,
  status         text not null default 'aguardando' check (
    status in ('aguardando', 'aceito', 'producao', 'entregue', 'recusado')
  ),
  -- Quando o aceite aconteceu. É isto que separa reserva de compromisso.
  aceite_em      timestamptz,
  personalizado  text,
  unique (confeiteira_id, referencia),
  constraint aceite_coerente check (
    (status in ('aguardando', 'recusado')) = (aceite_em is null)
  )
);

create table pedido_itens (
  id            uuid primary key default gen_random_uuid(),
  pedido_id     uuid not null references pedidos (id) on delete cascade,
  produto_nome  text not null,
  tamanho_nome  text not null default '',
  massa_nome    text not null default '',
  recheios      text[] not null default '{}',
  decoracoes    text[] not null default '{}',
  observacao    text,
  total         numeric(10, 2) not null check (total >= 0),
  ordem         integer not null default 0
);

-- -------------------------------------------------------------- assinaturas

create table planos (
  id       text primary key check (id in ('prova', 'atelier', 'pastelaria')),
  nome     text not null,
  destaque boolean not null default false,
  ordem    integer not null default 0
);

-- Um preço por plano, moeda e período: é o que o Stripe chama Price.
create table plano_precos (
  plano_id text not null references planos (id) on delete cascade,
  moeda    text not null check (moeda in ('EUR', 'CHF', 'BRL')),
  periodo  text not null check (periodo in ('mensal', 'anual')),
  valor    numeric(10, 2) not null check (valor >= 0),
  stripe_price_id text,
  primary key (plano_id, moeda, periodo)
);

create table codigos_vitalicios (
  codigo   text primary key,
  plano_id text not null references planos (id),
  max_usos integer not null check (max_usos > 0),
  usos     integer not null default 0 check (usos >= 0),
  nota     text not null default '',
  criado_em timestamptz not null default now(),
  constraint nao_passa_do_tecto check (usos <= max_usos)
);

create table assinaturas (
  confeiteira_id uuid primary key references confeiteiras (id) on delete cascade,
  plano_id       text not null references planos (id),
  estado         text not null check (
    estado in ('teste', 'activa', 'vitalicia', 'pagamento_falhou', 'cancelada')
  ),
  -- 'codigo' é uma concessão nossa: não tem contrato no Stripe, não renova e
  -- não gera fatura. Separar a origem evita ir procurar lá o que não existe.
  origem         text not null check (origem in ('stripe', 'codigo')),
  periodo        text not null default 'mensal' check (periodo in ('mensal', 'anual')),
  renova_em      date,
  cartao         text,
  codigo         text references codigos_vitalicios (codigo),
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  actualizada_em timestamptz not null default now(),
  constraint vitalicia_tem_codigo check (
    (origem = 'codigo') = (codigo is not null)
  ),
  constraint stripe_nao_tem_codigo check (
    origem = 'stripe' or (stripe_subscription_id is null)
  )
);

create table faturas (
  id             uuid primary key default gen_random_uuid(),
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  referencia     text not null,
  emitida_em     date not null,
  valor          numeric(10, 2) not null check (valor >= 0),
  moeda          text not null check (moeda in ('EUR', 'CHF', 'BRL')),
  paga           boolean not null default false,
  stripe_invoice_id text unique,
  unique (confeiteira_id, referencia)
);

-- Um mês fechado por confeiteira, para os relatórios não varrerem os pedidos
-- todos de cada vez que alguém abre a página.
create table historico_mensal (
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  mes            date not null,
  receita        numeric(12, 2) not null default 0,
  encomendas     integer not null default 0,
  primary key (confeiteira_id, mes)
);

-- ------------------------------------------------------------------ índices

create index produtos_por_confeiteira on produtos (confeiteira_id) where activo;
create index tamanhos_por_produto on tamanhos (produto_id);
create index opcoes_por_produto on opcoes (produto_id, grupo);
create index colecoes_por_confeiteira on colecoes (confeiteira_id) where ativa;
create index pedidos_por_confeiteira on pedidos (confeiteira_id, criado_em desc);
-- A lista de pedidos abre sempre filtrada por estado; o índice acompanha.
create index pedidos_por_estado on pedidos (confeiteira_id, status, entrega_em);
create index itens_por_pedido on pedido_itens (pedido_id);
create index clientes_por_confeiteira on clientes (confeiteira_id);
