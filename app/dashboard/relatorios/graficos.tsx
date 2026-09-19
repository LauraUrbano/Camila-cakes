"use client";

import { useState } from "react";
import { useT } from "@/app/lingua";
import { moeda } from "@/lib/precos";
import type { Moeda } from "@/lib/tipos";

/**
 * Gráficos em SVG, sem biblioteca. Regras que valem para os dois:
 * barra fina (no máximo 24px), ponta arredondada só do lado do valor,
 * grelha de um fio, e o rótulo só onde ele conta — o resto está na
 * dica ao passar o rato e na tabela.
 */

type Ponto = { rotulo: string; valor: number };

/**
 * A formatação não pode vir como função do lado do servidor, por isso cada
 * gráfico recebe só o código da moeda — sem ele, o valor sai como número.
 */
function formatador(codigo?: Moeda) {
  return (valor: number) =>
    codigo ? moeda(valor, codigo) : String(Math.round(valor));
}

/** Caminho de barra com só duas pontas arredondadas, do lado do valor. */
function barraVertical(x: number, y: number, l: number, a: number, r = 4) {
  const raio = Math.min(r, a);
  return `M${x} ${y + a} L${x} ${y + raio} Q${x} ${y} ${x + raio} ${y} L${x + l - raio} ${y} Q${x + l} ${y} ${x + l} ${y + raio} L${x + l} ${y + a} Z`;
}

function barraHorizontal(x: number, y: number, l: number, a: number, r = 4) {
  const raio = Math.min(r, l);
  return `M${x} ${y} L${x + l - raio} ${y} Q${x + l} ${y} ${x + l} ${y + raio} L${x + l} ${y + a - raio} Q${x + l} ${y + a} ${x + l - raio} ${y + a} L${x} ${y + a} Z`;
}

/** Arredonda o topo da escala para um número limpo. */
function tecto(maximo: number) {
  const passo = Math.pow(10, Math.floor(Math.log10(maximo))) / 2;
  return Math.ceil(maximo / passo) * passo;
}

export function Colunas({
  dados,
  codigo,
}: {
  dados: Ponto[];
  codigo?: Moeda;
}) {
  const t = useT();
  const [sobre, setSobre] = useState<number | null>(null);
  const formata = formatador(codigo);

  const L = 560;
  const A = 210;
  const baixo = 26;
  // Espaço no topo para o rótulo da grelha e o valor da barra mais alta,
  // que de outra forma saíam fora do viewBox e eram cortados.
  const topo = 20;
  const alturaPlot = A - baixo;
  const max = tecto(Math.max(...dados.map((d) => d.valor)));
  const faixa = L / dados.length;
  const largura = Math.min(24, faixa * 0.4);
  const maiorIndice = dados.reduce(
    (melhor, ponto, i) => (ponto.valor > dados[melhor].valor ? i : melhor),
    0,
  );

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${L} ${A}`}
        className="w-full"
        role="img"
        aria-label={t.painel.relatorios.receitaMes}
      >
        {[0, 0.5, 1].map((fracao) => {
          const y = alturaPlot - fracao * (alturaPlot - topo);
          return (
            <g key={fracao}>
              <line
                x1="0"
                x2={L}
                y1={y}
                y2={y}
                stroke="var(--borda)"
                strokeWidth="1"
              />
              <text
                x="0"
                y={y - 6}
                fontSize="11"
                fill="var(--suave)"
                className="tabular-nums"
              >
                {fracao === 0 ? "0" : formata(max * fracao)}
              </text>
            </g>
          );
        })}

        {dados.map((ponto, i) => {
          const altura = (ponto.valor / max) * (alturaPlot - topo);
          const x = i * faixa + (faixa - largura) / 2;
          const y = alturaPlot - altura;
          return (
            <g
              key={ponto.rotulo}
              onMouseEnter={() => setSobre(i)}
              onMouseLeave={() => setSobre(null)}
            >
              {/* Alvo de rato do tamanho da faixa, não da barra. */}
              <rect
                x={i * faixa}
                y="0"
                width={faixa}
                height={alturaPlot}
                fill="transparent"
              />
              <path
                d={barraVertical(x, y, largura, altura)}
                fill="var(--marca)"
                opacity={sobre === null || sobre === i ? 1 : 0.45}
              />
              {i === maiorIndice && (
                <text
                  x={x + largura / 2}
                  y={y - 8}
                  fontSize="11"
                  textAnchor="middle"
                  fill="var(--texto)"
                >
                  {formata(ponto.valor)}
                </text>
              )}
              <text
                x={i * faixa + faixa / 2}
                y={A - 8}
                fontSize="11"
                textAnchor="middle"
                fill="var(--suave)"
              >
                {ponto.rotulo}
              </text>
            </g>
          );
        })}
      </svg>

      {sobre !== null && (
        <div
          className="pointer-events-none absolute -top-2 rounded-xl border border-borda bg-cartao px-3 py-2 text-xs shadow-sm"
          style={{
            left: `${((sobre + 0.5) / dados.length) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          <span className="block text-suave">{dados[sobre].rotulo}</span>
          <span className="block font-medium">
            {formata(dados[sobre].valor)}
          </span>
        </div>
      )}
    </div>
  );
}

export function Barras({ dados, codigo }: { dados: Ponto[]; codigo?: Moeda }) {
  const t = useT();
  const formata = formatador(codigo);
  const L = 560;
  const linha = 40;
  const A = dados.length * linha;
  const max = Math.max(...dados.map((d) => d.valor));
  const recuo = 150;
  const util = L - recuo - 70;

  return (
    <svg
      viewBox={`0 0 ${L} ${A}`}
      className="w-full"
      role="img"
      aria-label={t.painel.relatorios.maisSai}
    >
      {dados.map((ponto, i) => {
        const largura = Math.max(3, (ponto.valor / max) * util);
        const y = i * linha + (linha - 16) / 2;
        return (
          <g key={ponto.rotulo}>
            <text x="0" y={y + 12} fontSize="12" fill="var(--texto)">
              {ponto.rotulo}
            </text>
            <path
              d={barraHorizontal(recuo, y, largura, 16)}
              fill="var(--marca)"
            />
            <text
              x={recuo + largura + 10}
              y={y + 12}
              fontSize="12"
              fill="var(--suave)"
            >
              {formata(ponto.valor)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Tabela({
  cabecalhos,
  linhas,
}: {
  cabecalhos: string[];
  linhas: string[][];
}) {
  const t = useT();
  const [aberta, setAberta] = useState(false);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setAberta((estado) => !estado)}
        className="text-xs text-suave underline underline-offset-2"
      >
        {aberta ? t.painel.relatorios.esconderTabela : t.painel.relatorios.verTabela}
      </button>
      {aberta && (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-borda text-left text-xs text-suave">
              {cabecalhos.map((titulo) => (
                <th key={titulo} className="pb-2 font-normal">
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {linhas.map((linha) => (
              <tr key={linha[0]} className="border-b border-borda/60">
                {linha.map((celula, i) => (
                  <td key={i} className="py-2">
                    {celula}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
