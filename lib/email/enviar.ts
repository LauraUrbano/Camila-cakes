/**
 * Envio de email.
 *
 * Sem RESEND_API_KEY no ambiente, nada sai — e isso é dito no registo em vez
 * de ser escondido. É deliberado: um email que falha em silêncio é pior do
 * que um email que não existe, porque a confeitaria fica à espera de um
 * aviso que nunca vem.
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
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_REMETENTE);
}

export async function enviar(email: Email): Promise<boolean> {
  if (!email.para.trim()) return false;

  if (!emailConfigurado()) {
    console.warn(
      `[email] por enviar (falta RESEND_API_KEY ou EMAIL_REMETENTE): "${email.assunto}" para ${email.para}`,
    );
    return false;
  }

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_REMETENTE,
        to: [email.para],
        subject: email.assunto,
        html: email.html,
        ...(email.responderA && { reply_to: email.responderA }),
      }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      console.error(`[email] recusado (${resposta.status}): ${await resposta.text()}`);
      return false;
    }
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
