import Link from "next/link";
import Logo from "@/app/logo";
import { SeletorLingua } from "@/app/lingua";
import { dicionarioActual } from "@/lib/i18n/servidor";
import { lojaDoPainel } from "@/lib/fonte";
import { redirect } from "next/navigation";
import FormularioEntrar from "./formulario";

export default async function Entrar() {
  // Quem já entrou não precisa de voltar a entrar.
  if (await lojaDoPainel()) redirect("/dashboard");
  const t = await dicionarioActual();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/precos" className="text-sm text-suave hover:text-texto">
            {t.comum.precos}
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl grow items-center gap-16 px-6 py-16 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl leading-tight">{t.entrar.titulo}</h1>
          <p className="mt-5 leading-relaxed text-suave">{t.entrar.subtitulo}</p>

          <p className="mt-10 rounded-2xl bg-marca-suave p-5 text-sm leading-relaxed">
            {t.entrar.semConta}{" "}
            <Link href="/assinar" className="font-medium underline underline-offset-2">
              {t.entrar.pedirAcesso}
            </Link>
          </p>
        </div>

        <FormularioEntrar />
      </main>

      <footer className="border-t border-borda py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-suave">
          <Link href="/admin/entrar" className="hover:text-texto">
            {t.entrar.plataforma}
          </Link>
          <SeletorLingua />
        </div>
      </footer>
    </div>
  );
}
