"use client";

import { useState, useTransition } from "react";
import Icone from "@/app/icones";
import { emailDeTeste, testarEmail } from "@/app/admin/accoes";

export type EstadoSmtp = {
  configurado: boolean;
  host: string;
  porta: string;
  seguranca: string;
  utilizador: string;
  temSenha: boolean;
  remetente: string;
};

const variaveis = [
  ["SMTP_HOST", "smtp.o-teu-servidor.com"],
  ["SMTP_PORTA", "587 (ou 465)"],
  ["SMTP_UTILIZADOR", "o utilizador da caixa"],
  ["SMTP_SENHA", "a senha dessa caixa"],
  ["EMAIL_REMETENTE", "Cakelyo <ola@cakelyo.app>"],
];

export default function PainelEmail({ estado }: { estado: EstadoSmtp }) {
  const [aTestar, testar] = useTransition();
  const [resultado, setResultado] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl">Envio de email</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-suave">
        Os avisos de encomenda e as boas-vindas saem por SMTP. A senha vive no
        ambiente, nunca na base de dados — uma fuga da base não pode levar a
        caixa de correio atrás.
      </p>

      <section className="mt-8 rounded-3xl border border-borda bg-cartao p-8">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-9 w-9 place-items-center rounded-full ${
              estado.configurado ? "bg-marca-suave text-marca" : "bg-borda text-suave"
            }`}
          >
            <Icone nome={estado.configurado ? "confirmado" : "conversa"} className="h-4 w-4" />
          </span>
          <p className="font-titulo text-lg">
            {estado.configurado ? "Configurado" : "Por configurar"}
          </p>
        </div>

        {estado.configurado ? (
          <>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Servidor", `${estado.host}:${estado.porta}`],
                ["Segurança", estado.seguranca],
                ["Utilizador", estado.utilizador],
                ["Senha", estado.temSenha ? "definida" : "em falta"],
                ["Remetente", estado.remetente],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className="flex justify-between gap-4 border-t border-borda pt-3">
                  <dt className="text-suave">{rotulo}</dt>
                  <dd className="text-right font-mono text-xs">{valor}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={aTestar}
                onClick={() =>
                  testar(async () => {
                    const r = await testarEmail();
                    setResultado(
                      r.ok ? "Ligação ao servidor de email estabelecida." : `Falhou: ${r.erro}`,
                    );
                  })
                }
                className="rounded-full border border-borda px-5 py-2.5 text-sm disabled:opacity-50"
              >
                Testar ligação
              </button>
              <button
                type="button"
                disabled={aTestar}
                onClick={() =>
                  testar(async () => {
                    const r = await emailDeTeste();
                    setResultado(r.mensagem);
                  })
                }
                className="rounded-full bg-marca px-5 py-2.5 text-sm text-white disabled:opacity-50"
              >
                Enviar email de teste
              </button>
            </div>
            {resultado && <p className="mt-4 text-sm text-marca">{resultado}</p>}
          </>
        ) : (
          <>
            <p className="mt-5 text-sm leading-relaxed text-suave">
              Enquanto faltar, nada sai — e cada tentativa fica escrita no
              registo do servidor, para não se perder nenhuma em silêncio.
              Acrescenta estas variáveis no alojamento:
            </p>
            <ul className="mt-5 space-y-2">
              {variaveis.map(([chave, exemplo]) => (
                <li
                  key={chave}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-t border-borda pt-2 text-xs"
                >
                  <code className="font-mono">{chave}</code>
                  <span className="text-suave">{exemplo}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-suave">
              A porta 587 sobe para TLS com STARTTLS; a 465 fala TLS desde o
              primeiro byte. Trocar as duas dá um erro difícil de perceber, por
              isso o código escolhe conforme a porta que puseres.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
