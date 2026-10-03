import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";

const db = await new PGlite();
const sql = fs.readFileSync("/home/user/Camila-cakes/bd/0001_esquema.sql", "utf8");
await db.exec(sql);
console.log("✓ esquema aplicou sem erros");

const tabelas = await db.query(
  "select table_name from information_schema.tables where table_schema='public' order by 1",
);
console.log("tabelas:", tabelas.rows.map((r) => r.table_name).join(", "));

// --- As restrições fazem mesmo o que dizem? ---
const falha = async (rotulo, fn) => {
  try { await fn(); console.log("✗ DEIXOU PASSAR:", rotulo); }
  catch (e) { console.log("✓ barrou:", rotulo, "—", e.message.split("\n")[0].slice(0, 70)); }
};

await db.query(`insert into planos (id, nome) values ('prova','Prova'),('pastelaria','Pastelaria')`);
await db.query(`insert into confeiteiras (slug,nome,cidade,pais,moeda,tema)
  values ('camila-cakes','Camila Cakes','Lisboa','PT','EUR','{}'::jsonb)`);
const { rows: [c] } = await db.query(`select id from confeiteiras`);

await falha("moeda inventada", () => db.query(
  `insert into confeiteiras (slug,nome,cidade,pais,moeda,tema) values ('x','X','Y','PT','GBP','{}')`));
await falha("vendidos acima do limite", () => db.query(
  `insert into produtos (confeiteira_id,chave,nome,limite_total,limite_vendidos)
   values ($1,'p','P',10,11)`, [c.id]));
await falha("aceite sem data em pedido aceito", () => db.query(
  `insert into pedidos (confeiteira_id,referencia,cliente_nome,status)
   values ($1,'ENC-1','Ana','aceito')`, [c.id]));
await falha("data de aceite num pedido que aguarda", () => db.query(
  `insert into pedidos (confeiteira_id,referencia,cliente_nome,status,aceite_em)
   values ($1,'ENC-2','Ana','aguardando',now())`, [c.id]));
await falha("assinatura por código sem código", () => db.query(
  `insert into assinaturas (confeiteira_id,plano_id,estado,origem)
   values ($1,'prova','vitalicia','codigo')`, [c.id]));

// O mesmo slug de produto em duas confeiteiras diferentes tem de passar.
await db.query(`insert into confeiteiras (slug,nome,cidade,pais,moeda,tema)
  values ('doces-sofia','Doces da Sofia','Genebra','CH','CHF','{}')`);
const { rows: duas } = await db.query(`select id from confeiteiras order by slug`);
for (const r of duas) {
  await db.query(`insert into produtos (confeiteira_id,chave,nome) values ($1,'bolo-festa','Bolo de festa')`, [r.id]);
}
console.log("✓ a mesma chave de produto convive em duas confeiteiras");

// --- Resgate de código: dois ao mesmo tempo não podem passar do tecto ---
await db.query(`insert into codigos_vitalicios (codigo,plano_id,max_usos,usos)
  values ('UNICO','pastelaria',1,0)`);
const resgatar = () => db.query(
  `update codigos_vitalicios set usos = usos + 1
   where codigo = 'UNICO' and usos < max_usos returning plano_id`);
const a = await resgatar();
const bRes = await resgatar();
console.log("✓ resgate atómico:", a.rows.length, "primeiro,", bRes.rows.length, "segundo (tem de ser 1 e 0)");
