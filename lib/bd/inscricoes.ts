import type { Executor } from "./cliente";
import type { Moeda, Pais } from "@/lib/tipos";

export type InscricaoNova = {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  pais: Pais;
  moeda: Moeda;
  planoId: string;
  periodo: "mensal" | "anual";
  slugDesejado: string;
  mensagem: string;
};

/**
 * Guarda o pedido de acesso.
 *
 * Quem carrega duas vezes no botão, ou volta ao formulário no dia seguinte,
 * não cria dois pedidos em aberto: o índice único por email em estado "nova"
 * trata disso e o pedido é actualizado com o que ela escreveu agora.
 */
export async function criarInscricao(
  exec: Executor,
  dados: InscricaoNova,
): Promise<void> {
  await exec(
    `insert into inscricoes
       (nome, email, telefone, cidade, pais, moeda,
        plano_id, periodo, slug_desejado, mensagem)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     on conflict (lower(email)) where estado = 'nova'
     do update set nome = excluded.nome,
                   telefone = excluded.telefone,
                   cidade = excluded.cidade,
                   pais = excluded.pais,
                   moeda = excluded.moeda,
                   plano_id = excluded.plano_id,
                   periodo = excluded.periodo,
                   slug_desejado = excluded.slug_desejado,
                   mensagem = excluded.mensagem,
                   criada_em = now()`,
    [
      dados.nome,
      dados.email,
      dados.telefone,
      dados.cidade,
      dados.pais,
      dados.moeda,
      dados.planoId,
      dados.periodo,
      dados.slugDesejado,
      dados.mensagem,
    ],
  );
}

export type EstadoInscricao = "nova" | "contactada" | "aberta" | "recusada";

export type Inscricao = InscricaoNova & {
  id: string;
  estado: EstadoInscricao;
  criadaEm: string;
  contaAberta: string | null;
};

export async function inscricoes(exec: Executor): Promise<Inscricao[]> {
  const linhas = await exec<Record<string, unknown>>(
    `select i.*, c.slug as conta_aberta
     from inscricoes i
     left join confeiteiras c on c.id = i.confeiteira_id
     order by i.criada_em desc`,
  );
  return linhas.map((l) => ({
    id: String(l.id),
    nome: String(l.nome),
    email: String(l.email),
    telefone: String(l.telefone ?? ""),
    cidade: String(l.cidade),
    pais: l.pais as Pais,
    moeda: l.moeda as Moeda,
    planoId: String(l.plano_id),
    periodo: l.periodo as "mensal" | "anual",
    slugDesejado: String(l.slug_desejado ?? ""),
    mensagem: String(l.mensagem ?? ""),
    estado: l.estado as EstadoInscricao,
    criadaEm: String(l.criada_em),
    contaAberta: l.conta_aberta ? String(l.conta_aberta) : null,
  }));
}

export async function mudarEstadoInscricao(
  exec: Executor,
  id: string,
  estado: EstadoInscricao,
): Promise<void> {
  await exec(
    `update inscricoes
        set estado = $2,
            tratada_em = case when $2 = 'nova' then null else now() end
      where id = $1`,
    [id, estado],
  );
}

/** Liga o pedido à conta que foi aberta a partir dele e fecha-o. */
export async function inscricaoAtendida(
  exec: Executor,
  email: string,
  slug: string,
): Promise<void> {
  await exec(
    `update inscricoes i
        set estado = 'aberta',
            tratada_em = now(),
            confeiteira_id = c.id
       from confeiteiras c
      where c.slug = $2
        and lower(i.email) = lower($1)
        and i.estado = 'nova'`,
    [email, slug],
  );
}
