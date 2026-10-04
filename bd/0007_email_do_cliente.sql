-- Email de quem encomenda.
--
-- Até aqui só se pedia o telefone, que serve para falar mas não para avisar
-- sozinho. Sem email não há como dizer a uma cliente que a encomenda dela
-- foi aceite sem alguém se lembrar de lhe escrever à mão.
--
-- Fica opcional de propósito: quem não o quiser dar continua a encomendar, e
-- o aviso faz-se como sempre se fez.
alter table pedidos  add column email text not null default '';
alter table clientes add column email text not null default '';
