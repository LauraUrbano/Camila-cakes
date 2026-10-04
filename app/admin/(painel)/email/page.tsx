import { emailConfigurado } from "@/lib/email/enviar";
import PainelEmail from "./painel";

/** O que está definido, sem nunca mostrar a senha. */
function estado() {
  const porta = process.env.SMTP_PORTA ?? "587";
  return {
    configurado: emailConfigurado(),
    host: process.env.SMTP_HOST ?? "",
    porta,
    seguranca: porta === "465" ? "TLS directo" : "STARTTLS",
    utilizador: process.env.SMTP_UTILIZADOR ?? "",
    temSenha: Boolean(process.env.SMTP_SENHA),
    remetente: process.env.EMAIL_REMETENTE ?? "",
  };
}

export default function Email() {
  return <PainelEmail estado={estado()} />;
}
