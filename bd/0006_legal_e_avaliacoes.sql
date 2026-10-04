-- Identificação do prestador e avaliações.

-- Os dados da empresa ficam em definições e não no código: mudam de morada,
-- mudam de telefone, e nenhuma dessas mudanças devia obrigar a publicar o
-- site outra vez. Entram vazios de propósito — uma morada inventada numa
-- página legal é pior do que uma morada em falta, que se vê que falta.
insert into definicoes (chave, descricao) values
  ('empresa_nome',      'Nome ou denominação social de quem presta o serviço'),
  ('empresa_nif',       'Número de identificação fiscal'),
  ('empresa_morada',    'Morada da sede'),
  ('empresa_email',     'Email de contacto para clientes'),
  ('empresa_telefone',  'Telefone de contacto'),
  ('livro_reclamacoes', 'Ligação para o livro de reclamações eletrónico')
on conflict (chave) do nothing;

-- A ligação oficial é a mesma para toda a gente em Portugal; fica preenchida
-- à partida para não ficar a faltar por esquecimento.
update definicoes
set valor = 'https://www.livroreclamacoes.pt/inicio'
where chave = 'livro_reclamacoes' and valor = '';

-- Avaliações das clientes a cada confeitaria.
--
-- A nota vive aqui e não numa média guardada na confeiteira: médias
-- guardadas ficam dessincronizadas ao primeiro apagar, e contar cinco linhas
-- não custa nada.
--
-- Nada aparece na página sem a confeiteira aprovar. Não é para ela filtrar o
-- que não gosta — é a única defesa que tem contra spam e contra quem lhe
-- queira fazer mal — e a página diz que é assim que funciona, para quem lê
-- saber o que está a ler.
create table avaliacoes (
  id             uuid primary key default gen_random_uuid(),
  confeiteira_id uuid not null references confeiteiras (id) on delete cascade,
  -- Quando a avaliação vem de uma encomenda, fica ligada a ela e ganha o
  -- selo de encomenda verificada.
  pedido_id      uuid references pedidos (id) on delete set null,
  nome           text not null,
  nota           smallint not null check (nota between 1 and 5),
  comentario     text not null default '',
  estado         text not null default 'nova' check (
    estado in ('nova', 'publicada', 'escondida')
  ),
  resposta       text not null default '',
  criada_em      timestamptz not null default now(),
  tratada_em     timestamptz
);

create index avaliacoes_publicas
  on avaliacoes (confeiteira_id, criada_em desc)
  where estado = 'publicada';

create index avaliacoes_por_tratar
  on avaliacoes (confeiteira_id, criada_em desc)
  where estado = 'nova';

-- Uma encomenda dá uma avaliação, não dez.
create unique index avaliacoes_uma_por_pedido
  on avaliacoes (pedido_id)
  where pedido_id is not null;
