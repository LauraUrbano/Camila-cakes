"use server";

import { revalidatePath } from "next/cache";
import { executorNeon, temBaseDeDados } from "@/lib/bd/cliente";
import { mudarEstadoPedido } from "@/lib/bd/escritas";
import { exigirLoja } from "@/lib/fonte";
import type { StatusPedido } from "@/lib/tipos";

/**
 * Muda o estado de uma encomenda e grava-o. Antes isto era só estado do
 * React: aceitar um pedido e recarregar a página punha-o outra vez pendente.
 */
export async function mudarEstado(
  referencia: string,
  status: StatusPedido,
): Promise<{ ok: boolean }> {
  if (!temBaseDeDados()) return { ok: false };

  const { confeiteira } = await exigirLoja();
  const ok = await mudarEstadoPedido(
    executorNeon(),
    confeiteira.slug,
    referencia,
    status,
  );

  if (ok) {
    revalidatePath("/dashboard/pedidos");
    revalidatePath("/dashboard");
  }
  return { ok };
}
