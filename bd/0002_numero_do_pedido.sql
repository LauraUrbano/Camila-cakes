-- Numeração das encomendas por confeiteira.
--
-- A referência ("ENC-104") era texto solto vindo da semente. Para gerar a
-- próxima é preciso um número comparável, e tem de ser por confeiteira: a
-- Camila e a Sofia contam cada uma a partir do seu lado.

alter table pedidos add column numero integer;

-- Preenche a partir das referências já existentes ("ENC-104" → 104).
update pedidos
set numero = nullif(regexp_replace(referencia, '\D', '', 'g'), '')::integer
where numero is null;

alter table pedidos alter column numero set not null;
alter table pedidos add constraint numero_unico_por_confeiteira
  unique (confeiteira_id, numero);
