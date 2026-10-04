import { redirect } from "next/navigation";
import { estaAutenticado } from "@/lib/admin/sessao";
import FormularioEntrada from "./formulario";

export default async function Entrar() {
  if (await estaAutenticado()) redirect("/admin");
  return <FormularioEntrada />;
}
