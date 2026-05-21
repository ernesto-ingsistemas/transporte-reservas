import { prisma } from "@/lib/prisma";

export const EmpresaService = {
  // Para crear la empresa inicialmente
  async registrarEmpresa(nombre: string, telefono: string) {
    return await prisma.empresa.create({
      data: {
        nombre,
        telefono,
        estado: "activa",
        // Calcula 30 días de prueba desde el momento del registro
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  },

  // ESTA ES LA QUE NECESITAS PARA EL FORMULARIO DE USUARIO
  // Nos permite llenar el selector con las empresas registradas
  async obtenerTodas() {
    return await prisma.empresa.findMany({
      orderBy: {
        nombre: 'asc' // Las ordena alfabéticamente para que sea más fácil buscar
      },
      select: {
        id: true,
        nombre: true
      }
    });
  },

  // Para mostrar el nombre en el Dashboard
  async obtenerEmpresaPorId(id: number) {
    return await prisma.empresa.findUnique({
      where: { id },
      select: { nombre: true }
    });
  }
};