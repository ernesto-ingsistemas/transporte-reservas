import { EmpresaService } from "@/services/empresa.service";
import NuevoUsuarioForm from "./NuevoUsuarioForm"; // Importaremos el formulario

export default async function NuevoUsuarioPage() {
  // Traemos las empresas desde el servidor (seguro)
  const empresas = await EmpresaService.obtenerTodas();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white p-4">
      {/* Pasamos las empresas al componente de cliente */}
      <NuevoUsuarioForm empresas={empresas} />
    </div>
  );
}