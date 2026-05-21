import { prisma } from "@/lib/prisma";

export const OperadorService = {
  // Para la nueva tarjeta de "Total Operadores"
  async contarOperadores(empresaId: number) {
    return await prisma.operador.count({
      where: { empresaId }
    });
  },

  // Para el listado en la pestaña de Operadores
  async obtenerOperadoresPorEmpresa(empresaId: number) {
    return await prisma.operador.findMany({
      where: { empresaId },
      orderBy: { nombre: 'asc' }
    });
  }
};