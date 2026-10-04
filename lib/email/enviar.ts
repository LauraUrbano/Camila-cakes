import nodemailer, { type Transporter } from "nodemailer";

/**
 * Envio de email por SMTP.
 *
 * Sem as variáveis no ambiente nada sai — e isso é dito no registo em vez de
 * ser escondido. É deliberado: um email que falha em silêncio é pior do que
 * um email que não existe, porque a confeitaria fica à espera de um aviso
 * que nunca vem.
 *
 * Nada do que se envia aqui pode fazer falhar o que estava a acontecer. Uma
 * encomenda gravada com sucesso não se perde porque o email não saiu.
 */
export type Email = {
  para: string;
  assunto: string;
  html: string;
  /** Para quem responde: o email da confeitaria, quando o aviso é dela. */
  responderA?: string;
};

export function emailConfigurado(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_UTILIZADOR &&
      process.env.SMTP_SENHA &&
      process.env.EMAIL_REMETENTE,
  );
}

/**
 * A ligação é reaproveitada entre envios.
 *
 * Abrir SMTP é caro — resolução de nome, TLS, autenticação — e numa função
 * sem servidor isso acontecia a cada encomenda. O transporte fica guardado
 * no módulo, que em Node dura o que durar a instância.
 */
let transporte: Transporter | null = null;

function ligacao(): Transporter {
  if (transporte) return transporte;

  const porta = Number(process.env.SMTP_PORTA ?? 587);
  transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: porta,
    // 465 fala TLS desde o primeiro byte; 587 começa em claro e sobe para
    // TLS com STARTTLS. Trocar os dois dá um erro que não se percebe.
    secure: porta === 465,
    auth: {
      user: process.env.SMTP_UTILIZADOR,
      pass: process.env.SMTP_SENHA,
    },
    pool: true,
    maxConnections: 2,
  });
  return transporte;
}

export async function enviar(email: Email): Promise<boolean> {
  if (!email.para.trim()) return false;

  if (!emailConfigurado()) {
    console.warn(
      `[email] por enviar (falta configuração SMTP): "${email.assunto}" para ${email.para}`,
    );
    return false;
  }

  try {
    await ligacao().sendMail({
      from: process.env.EMAIL_REMETENTE,
      to: email.para,
      subject: email.assunto,
      html: email.html,
      ...(email.responderA && { replyTo: email.responderA }),
    });
    return true;
  } catch (erro) {
    console.error("[email] falhou:", erro);
    return false;
  }
}

/** Envia sem nunca deixar rebentar quem chamou. */
export function enviarSemBloquear(email: Email): void {
  void enviar(email).catch(() => false);
}

/** Experimenta a ligação sem mandar nada, para o painel poder dizer se está de pé. */
export async function testarLigacao(): Promise<{ ok: boolean; erro?: string }> {
  if (!emailConfigurado()) return { ok: false, erro: "Falta configuração." };
  try {
    await ligacao().verify();
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : String(erro) };
  }
}
