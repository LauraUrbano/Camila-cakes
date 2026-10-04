-- Fotografia carregada pela confeiteira.
--
-- A coluna `foto` continua a guardar um endereço, porque é o que todo o
-- ecrã já lê. O que muda é de onde esse endereço vem: antes era um ficheiro
-- nosso em /public, agora pode ser uma rota que serve estes bytes.
--
-- Mesmo critério da imagem de partilha: fica na base, reduzida à entrada.
-- Uma foto de telemóvel de oito megabytes passa a cento e poucos
-- kilobytes, e evita um serviço de ficheiros a mais para configurar.
alter table produtos add column foto_bytes  bytea;
alter table produtos add column foto_tipo   text;
alter table produtos add column foto_versao integer not null default 0;
