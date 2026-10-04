import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { avaliacoesDaConfeiteira } from "@/lib/bd/avaliacoes";
import { exigirLoja } from "@/lib/fonte";
import { dicionarioActual, linguaActual } from "@/lib/i18n/servidor";
import PainelAvaliacoes from "./painel";

export default async function Avaliacoes() {
  const { confeiteira } = await exigirLoja();
  const t = (await dicionarioActual()).painel.avaliacoes;

  const lista = temBaseDeDados()
    ? await avaliacoesDaConfeiteira(executorNeon(), confeiteira.slug)
    : [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl">{t.titulo}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        {t.subtitulo}
      </p>
      <PainelAvaliacoes lista={lista} lingua={await linguaActual()} />
    </div>
  );
}
