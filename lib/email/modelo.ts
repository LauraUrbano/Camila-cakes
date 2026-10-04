/**
 * O molde de todos os emails.
 *
 * Emails não são páginas web: o Gmail corta o <head>, o Outlook não entende
 * flexbox e metade dos clientes ignora folhas de estilo. Por isso isto é
 * feito com tabelas e estilos escritos em cada elemento — feio de ler, mas é
 * o que chega igual a toda a gente.
 *
 * As cores entram por parâmetro: um aviso de encomenda sai com a marca da
 * confeitaria, não com a nossa. Quem recebe reconhece de quem é.
 */
export type CoresDoEmail = {
  marca: string;
  marcaSuave: string;
  fundo: string;
  texto: string;
};

export const CORES_CAKELYO: CoresDoEmail = {
  marca: "#A34E62",
  marcaSuave: "#FBE9EC",
  fundo: "#FFF8F4",
  texto: "#4A2E2A",
};

const SUAVE = "#7A6059";
const BORDA = "#EFE2DA";

/**
 * Tipos de letra: o Outlook não carrega fontes da web e o Gmail só as aceita
 * em parte, por isso isto é uma pilha de fontes do sistema. O que importa é
 * não cair em Times New Roman, que é o que acontece a quem não a declara.
 */
const LETRA =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

export type Botao = { texto: string; href: string };

export type Linha = { rotulo: string; valor: string; forte?: boolean };

export function moldar({
  titulo,
  preTexto,
  remetente,
  saudacao,
  paragrafos = [],
  linhas = [],
  botao,
  nota,
  rodape,
  cores = CORES_CAKELYO,
}: {
  titulo: string;
  /** A linha que aparece na caixa de entrada, a seguir ao assunto. */
  preTexto: string;
  /** Quem assina em cima: o nome da confeitaria, ou Cakelyo. */
  remetente: string;
  saudacao?: string;
  paragrafos?: string[];
  /** Uma tabela de dados — a encomenda, o plano, o que for. */
  linhas?: Linha[];
  botao?: Botao;
  nota?: string;
  rodape: string;
  cores?: CoresDoEmail;
}): string {
  const p = (texto: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${SUAVE}">${texto}</p>`;

  const tabela = linhas.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
            style="margin:8px 0 24px;border-collapse:collapse">
         ${linhas
           .map(
             (l) => `<tr>
             <td style="padding:10px 0;border-bottom:1px solid ${BORDA};font-size:14px;color:${SUAVE}">${l.rotulo}</td>
             <td align="right" style="padding:10px 0;border-bottom:1px solid ${BORDA};font-size:14px;word-break:break-word;${
               l.forte
                 ? `font-weight:600;color:${cores.texto}`
                 : `color:${cores.texto}`
             }">${l.valor}</td>
           </tr>`,
           )
           .join("")}
       </table>`
    : "";

  const accao = botao
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px">
         <tr><td style="border-radius:999px;background:${cores.marca}">
           <a href="${botao.href}"
              style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;
                     color:#ffffff;text-decoration:none;border-radius:999px">${botao.texto}</a>
         </td></tr>
       </table>`
    : "";

  const aviso = nota
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
            style="margin:24px 0 0;border-radius:16px;background:${cores.marcaSuave}">
         <tr><td style="padding:18px 20px;font-size:14px;line-height:1.6;color:${cores.texto}">${nota}</td></tr>
       </table>`
    : "";

  return `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background:${cores.fundo};font-family:${LETRA}">
  <!-- O pré-texto aparece na lista da caixa de entrada e depois esconde-se. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${preTexto}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:${cores.fundo};padding:32px 16px;font-family:${LETRA}">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="max-width:560px;background:#ffffff;border:1px solid ${BORDA};border-radius:24px;font-family:${LETRA}">
        <tr><td style="padding:32px 32px 0">
          <p style="margin:0;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:${cores.marca}">${remetente}</p>
          <h1 style="margin:12px 0 20px;font-size:25px;line-height:1.25;font-weight:600;color:${cores.texto}">${titulo}</h1>
        </td></tr>

        <tr><td style="padding:0 32px 32px">
          ${saudacao ? p(saudacao) : ""}
          ${paragrafos.map(p).join("")}
          ${tabela}
          ${accao}
          ${aviso}
        </td></tr>

        <tr><td style="padding:20px 32px 28px;border-top:1px solid ${BORDA}">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${SUAVE}">${rodape}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
