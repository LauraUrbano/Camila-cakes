/** Carrega os dados de exemplo para a base apontada por DATABASE_URL. */
import { executorNeon, urlDaAplicacao } from "@/lib/bd/cliente";
import { semear } from "@/lib/bd/semente";

if (!urlDaAplicacao()) {
  console.error("Falta DATABASE_URL.");
  process.exit(1);
}

await semear(executorNeon());
console.log("✓ semeado");
