import { EmpresaService } from "@/services/empresa.service";
import { redirect } from "next/navigation";

export default function RegistroEmpresa() {
  // Esta función se ejecuta solo en el servidor
  async function handleRegister(formData: FormData) {
    "use server";
    
    const nombre = formData.get("nombre") as string;
    const telefono = formData.get("telefono") as string;

    if (!nombre || !telefono) return;

    // Llamamos al servicio que creamos antes
    await EmpresaService.registrarEmpresa(nombre, telefono);

    // Después de guardar, lo mandamos a una página de éxito (o al dashboard)
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-8 shadow-2xl">
        <h1 className="mb-6 text-2xl font-bold text-white text-center">
          Crea Nueva Empresa de Transporte
        </h1>
        
        <form action={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Nombre de la Empresa</label>
            <input
              name="nombre"
              type="text"
              required
              className="mt-1 w-full rounded-lg bg-gray-700 p-3 text-white outline-none ring-blue-500 focus:ring-2"
              placeholder="Ej. Urbanos del Centro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400">Teléfono</label>
            <input
              name="telefono"
              type="text"
              required
              className="mt-1 w-full rounded-lg bg-gray-700 p-3 text-white outline-none ring-blue-500 focus:ring-2"
              placeholder="Ej. 55 1234 5678"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white transition hover:bg-blue-500"
          >
            Crear Empresa
          </button>
        </form>
      </div>
    </main>
  );
}