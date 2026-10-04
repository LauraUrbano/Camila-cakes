-- Contas com entrada própria.
--
-- Até aqui o painel abria sempre na mesma confeitaria e qualquer pessoa com
-- o endereço lá entrava. Com clientes a sério isso não se pode manter: cada
-- confeitaria entra na sua conta e vê só as encomendas dela.
--
-- A senha nunca fica em claro nem num resumo simples: fica em scrypt, que é
-- propositadamente lento, para quem levar a base não poder experimentar
-- milhões de senhas por segundo.
alter table confeiteiras add column email      text;
alter table confeiteiras add column senha_hash text;
alter table confeiteiras add column entrou_em  timestamptz;

-- Email único sem distinguir maiúsculas, e só entre quem o tem: contas
-- criadas no painel antes de ela escolher o email ficam com nulo.
create unique index confeiteiras_email_unico
  on confeiteiras (lower(email))
  where email is not null;
