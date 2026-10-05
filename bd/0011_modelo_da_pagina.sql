-- Modelo da página pública.
--
-- A mesma informação — nome, textos, cardápio — arrumada de três maneiras
-- diferentes. Não é um tema a mais em cima das cores: é outra disposição,
-- porque uma confeitaria que vive de fotografia precisa de uma página
-- diferente de uma que vive de uma lista de sabores.
alter table confeiteiras add column modelo text not null default 'classico'
  check (modelo in ('classico', 'vitrine', 'revista'));
