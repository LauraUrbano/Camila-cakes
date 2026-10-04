import type { Executor } from "./cliente";
import { codigosVitalicios, lojas, planos } from "@/lib/dados";

/**
 * Carrega os dados de exemplo para a base. É escrito para poder correr duas
 * vezes sem duplicar nada: cada inserção usa `on conflict` sobre a chave
 * natural, por isso semear de novo actualiza em vez de rebentar.
 */
/**
 * Os dados de exemplo guardam as datas como texto de ecrã ("16/09"). Na base
 * são datas a sério — e sem isso os pedidos perdiam a ordem entre si, porque
 * ficavam todos com a hora da semente.
 */
function data(diaMes: string, ano = new Date().getUTCFullYear()): string | null {
  const [dia, mes] = diaMes.split("/").map(Number);
  if (!dia || !mes) return null;
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export async function semear(exec: Executor): Promise<void> {
  for (const plano of planos) {
    await exec(
      `insert into planos (id, nome, destaque, ordem) values ($1,$2,$3,$4)
       on conflict (id) do update set nome = excluded.nome,
         destaque = excluded.destaque, ordem = excluded.ordem`,
      [plano.id, plano.nome, plano.destaque ?? false, planos.indexOf(plano)],
    );
    for (const moeda of ["EUR", "CHF", "BRL"] as const) {
      for (const periodo of ["mensal", "anual"] as const) {
        await exec(
          `insert into plano_precos (plano_id, moeda, periodo, valor)
           values ($1,$2,$3,$4)
           on conflict (plano_id, moeda, periodo)
             do update set valor = excluded.valor`,
          [plano.id, moeda, periodo, plano[periodo][moeda]],
        );
      }
    }
  }

  for (const codigo of codigosVitalicios) {
    await exec(
      `insert into codigos_vitalicios (codigo, plano_id, max_usos, usos, nota)
       values ($1,$2,$3,$4,$5)
       on conflict (codigo) do update set max_usos = excluded.max_usos,
         nota = excluded.nota`,
      [
        codigo.codigo,
        codigo.planoId,
        codigo.maxUsos,
        codigo.usos,
        codigo.nota,
      ],
    );
  }

  for (const loja of lojas) {
    const c = loja.confeiteira;
    const [{ id: confeiteiraId }] = await exec<{ id: string }>(
      `insert into confeiteiras
         (slug, nome, tagline, bio, cidade, pais, moeda, whatsapp, instagram,
          dominio_proprio, tema, aceita_personalizado, aviso_pagamento)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       on conflict (slug) do update set
         nome = excluded.nome, tagline = excluded.tagline, bio = excluded.bio,
         cidade = excluded.cidade, pais = excluded.pais, moeda = excluded.moeda,
         whatsapp = excluded.whatsapp, instagram = excluded.instagram,
         dominio_proprio = excluded.dominio_proprio, tema = excluded.tema,
         aceita_personalizado = excluded.aceita_personalizado,
         aviso_pagamento = excluded.aviso_pagamento
       returning id`,
      [
        c.slug,
        c.nome,
        c.tagline,
        c.bio,
        c.cidade,
        c.pais,
        c.moeda,
        c.whatsapp,
        c.instagram,
        c.dominioProprio ?? null,
        JSON.stringify(c.tema),
        c.aceitaPersonalizado,
        c.avisoPagamento,
      ],
    );

    for (const [i, entrega] of c.entregas.entries()) {
      await exec(
        `insert into entregas
           (confeiteira_id, chave, tipo, nome, descricao, taxa, ordem)
         values ($1,$2,$3,$4,$5,$6,$7)
         on conflict (confeiteira_id, chave) do update set
           tipo = excluded.tipo, nome = excluded.nome,
           descricao = excluded.descricao, taxa = excluded.taxa,
           ordem = excluded.ordem`,
        [
          confeiteiraId,
          entrega.id,
          entrega.tipo,
          entrega.nome,
          entrega.descricao,
          entrega.taxa,
          i,
        ],
      );
    }

    const idDoProduto = new Map<string, string>();
    for (const [i, produto] of loja.produtos.entries()) {
      const [{ id: produtoId }] = await exec<{ id: string }>(
        `insert into produtos
           (confeiteira_id, chave, nome, descricao, categoria, foto, cor,
            max_decoracoes, antecedencia_dias, limite_total, limite_vendidos,
            ordem)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         on conflict (confeiteira_id, chave) do update set
           nome = excluded.nome, descricao = excluded.descricao,
           categoria = excluded.categoria, foto = excluded.foto,
           cor = excluded.cor, max_decoracoes = excluded.max_decoracoes,
           antecedencia_dias = excluded.antecedencia_dias,
           limite_total = excluded.limite_total,
           limite_vendidos = excluded.limite_vendidos, ordem = excluded.ordem
         returning id`,
        [
          confeiteiraId,
          produto.id,
          produto.nome,
          produto.descricao,
          produto.categoria,
          produto.foto,
          produto.cor,
          produto.maxDecoracoes,
          produto.antecedenciaDias,
          produto.limite?.total ?? null,
          produto.limite?.vendidos ?? 0,
          i,
        ],
      );
      idDoProduto.set(produto.id, produtoId);

      for (const [j, tamanho] of produto.tamanhos.entries()) {
        await exec(
          `insert into tamanhos
             (produto_id, chave, nome, porcoes, preco, max_recheios, ordem)
           values ($1,$2,$3,$4,$5,$6,$7)
           on conflict (produto_id, chave) do update set
             nome = excluded.nome, porcoes = excluded.porcoes,
             preco = excluded.preco, max_recheios = excluded.max_recheios,
             ordem = excluded.ordem`,
          [
            produtoId,
            tamanho.id,
            tamanho.nome,
            tamanho.porcoes,
            tamanho.preco,
            tamanho.maxRecheios,
            j,
          ],
        );
      }

      const grupos = [
        ["massa", produto.massas],
        ["recheio", produto.recheios],
        ["decoracao", produto.decoracoes],
      ] as const;
      for (const [grupo, opcoes] of grupos) {
        for (const [j, opcao] of opcoes.entries()) {
          await exec(
            `insert into opcoes
               (produto_id, grupo, chave, nome, acrescimo, disponivel, ordem)
             values ($1,$2,$3,$4,$5,$6,$7)
             on conflict (produto_id, grupo, chave) do update set
               nome = excluded.nome, acrescimo = excluded.acrescimo,
               disponivel = excluded.disponivel, ordem = excluded.ordem`,
            [
              produtoId,
              grupo,
              opcao.id,
              opcao.nome,
              opcao.acrescimo,
              opcao.disponivel,
              j,
            ],
          );
        }
      }
    }

    for (const [i, colecao] of loja.colecoes.entries()) {
      const [{ id: colecaoId }] = await exec<{ id: string }>(
        `insert into colecoes
           (confeiteira_id, chave, nome, descricao, periodo, ativa, destaque, ordem)
         values ($1,$2,$3,$4,$5,$6,$7,$8)
         on conflict (confeiteira_id, chave) do update set
           nome = excluded.nome, descricao = excluded.descricao,
           periodo = excluded.periodo, ativa = excluded.ativa,
           destaque = excluded.destaque, ordem = excluded.ordem
         returning id`,
        [
          confeiteiraId,
          colecao.id,
          colecao.nome,
          colecao.descricao,
          colecao.periodo,
          colecao.ativa,
          colecao.destaque,
          i,
        ],
      );
      for (const [j, chave] of colecao.produtoIds.entries()) {
        const produtoId = idDoProduto.get(chave);
        if (!produtoId) continue;
        await exec(
          `insert into colecao_produtos (colecao_id, produto_id, ordem)
           values ($1,$2,$3)
           on conflict (colecao_id, produto_id) do update set ordem = excluded.ordem`,
          [colecaoId, produtoId, j],
        );
      }
    }

    for (const pedido of loja.pedidos) {
      const aceite = ["aguardando", "recusado"].includes(pedido.status)
        ? null
        : new Date().toISOString();
      const criado = data(pedido.criadoEm);
      const [{ id: pedidoId }] = await exec<{ id: string }>(
        `insert into pedidos
           (confeiteira_id, referencia, numero, cliente_nome, telefone,
            criado_em, entrega_em, entrega_nome, entrega_tipo, entrega_taxa,
            status, aceite_em, personalizado)
         values ($1,$2,$3,$4,$5,coalesce($6::timestamptz, now()),$7,$8,$9,$10,$11,$12,$13)
         on conflict (confeiteira_id, referencia) do update set
           criado_em = excluded.criado_em, entrega_em = excluded.entrega_em,
           status = excluded.status, aceite_em = excluded.aceite_em
         returning id`,
        [
          confeiteiraId,
          pedido.id,
          // O número vem da referência ("ENC-104" → 104): é dele que sai o
          // próximo da casa, e a semente tem de o deixar coerente com o que
          // a aplicação depois conta.
          Number(pedido.id.replace(/\D/g, "")),
          pedido.cliente,
          pedido.telefone,
          criado,
          data(pedido.entregaEm),
          pedido.entrega.nome,
          pedido.entrega.tipo,
          pedido.entrega.taxa,
          pedido.status,
          aceite,
          pedido.personalizado ?? null,
        ],
      );
      await exec(`delete from pedido_itens where pedido_id = $1`, [pedidoId]);
      for (const [j, item] of pedido.itens.entries()) {
        await exec(
          `insert into pedido_itens
             (pedido_id, produto_nome, tamanho_nome, massa_nome, recheios,
              decoracoes, observacao, total, ordem)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            pedidoId,
            item.produtoNome,
            item.tamanhoNome,
            item.massaNome,
            item.recheiosNomes,
            item.decoracoesNomes,
            item.observacao ?? null,
            item.total,
            j,
          ],
        );
      }
    }

    for (const [i, mes] of loja.historico.entries()) {
      // O histórico de exemplo só tem o nome do mês; aqui vira uma data real,
      // contada para trás a partir do mês corrente.
      const data = new Date();
      data.setUTCDate(1);
      data.setUTCMonth(data.getUTCMonth() - (loja.historico.length - 1 - i));
      await exec(
        `insert into historico_mensal (confeiteira_id, mes, receita, encomendas)
         values ($1,$2,$3,$4)
         on conflict (confeiteira_id, mes) do update set
           receita = excluded.receita, encomendas = excluded.encomendas`,
        [
          confeiteiraId,
          data.toISOString().slice(0, 10),
          mes.receita,
          mes.encomendas,
        ],
      );
    }

    const a = loja.assinatura;
    await exec(
      `insert into assinaturas
         (confeiteira_id, plano_id, estado, origem, periodo, cartao, codigo)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (confeiteira_id) do update set
         plano_id = excluded.plano_id, estado = excluded.estado,
         origem = excluded.origem, periodo = excluded.periodo,
         cartao = excluded.cartao, codigo = excluded.codigo`,
      [
        confeiteiraId,
        a.planoId,
        a.estado,
        a.origem,
        a.periodo,
        a.cartao ?? null,
        a.codigo ?? null,
      ],
    );

    for (const fatura of a.faturas) {
      await exec(
        `insert into faturas
           (confeiteira_id, referencia, emitida_em, valor, moeda, paga)
         values ($1,$2,$3,$4,$5,$6)
         on conflict (confeiteira_id, referencia) do update set
           valor = excluded.valor, paga = excluded.paga`,
        [
          confeiteiraId,
          fatura.id,
          data(fatura.data) ?? new Date().toISOString().slice(0, 10),
          fatura.valor,
          c.moeda,
          fatura.paga,
        ],
      );
    }
  }
}
