-- SEO e imagem de partilha de cada confeitaria.
--
-- Até aqui o título e a descrição da página dela eram montados por nós a
-- partir do nome e da cidade. Serve para começar, mas quem sabe o que a sua
-- cliente escreve no Google é ela — e a imagem que aparece quando o link é
-- partilhado no WhatsApp é metade da razão por que alguém o abre.
alter table confeiteiras add column seo_titulo    text not null default '';
alter table confeiteiras add column seo_descricao text not null default '';

-- A imagem fica na base e não num balde de ficheiros.
--
-- É uma por confeitaria, com 1200 por 630 e reduzida na entrada para cerca
-- de cem kilobytes. Mil confeitarias dão uns cem megabytes, que o Postgres
-- aguenta sem pestanejar — e evita um serviço a mais para configurar,
-- autenticar e pagar. Se um dia forem dez mil, muda-se.
alter table confeiteiras add column imagem_partilha      bytea;
alter table confeiteiras add column imagem_partilha_tipo text;

-- Sobe a cada troca de imagem e entra no endereço, para o WhatsApp e o
-- Facebook deixarem de servir a antiga a partir da cache deles.
alter table confeiteiras add column imagem_partilha_versao integer not null default 0;
