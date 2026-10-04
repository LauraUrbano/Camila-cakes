import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { acessoDasContas } from "@/lib/bd/acesso";
import { exigirLoja } from "@/lib/fonte";
import { dicionarioActual } from "@/lib/i18n/servidor";
import FormularioSenha from "./formulario";

export default async function Conta() {
  const { confeiteira } = await exigirLoja();
  const t = (await dicionarioActual()).painel.conta;

  const acesso = temBaseDeDados()
    ? (await acessoDasContas(executorNeon()))[confeiteira.slug]
    : undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl">{t.titulo}</h1>
      <p className="mt-2 text-sm leading-relaxed text-suave">{t.subtitulo}</p>

      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-7">
        <h2 className="font-titulo text-lg">{t.quemEntra}</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-suave">{t.email}</dt>
            <dd>{acesso?.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-suave">{t.endereco}</dt>
            <dd className="font-mono">cakelyo.app/{confeiteira.slug}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-suave">{t.mudarEmail}</p>
      </section>

      <FormularioSenha />
    </div>
  );
}
