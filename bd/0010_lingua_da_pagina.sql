-- Língua por omissão da página de cada confeitaria.
--
-- Até aqui a página saía na língua de quem a abria, negociada pelo browser.
-- Serve para quem recebe clientes de vários sítios, mas não para quem vende
-- numa cidade só: uma confeitaria de Lisboa com uma cliente de férias em
-- França via a sua própria página em francês.
--
-- Nulo mantém o que havia: segue quem visita. Com valor, a página abre
-- sempre nessa língua, e quem quiser ainda troca no rodapé — a escolha de
-- quem lê ganha sempre à da casa.
alter table confeiteiras add column lingua text
  check (lingua is null or lingua in ('pt-PT', 'pt-BR', 'en', 'fr', 'de'));
