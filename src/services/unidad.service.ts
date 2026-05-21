import { prisma } from "@/lib/prisma";

export const UnidadService = {
  /**
   * Obtiene los IDs de operadores que ya tienen una unidad asignada.
   */
  async obtenerIdsOperadoresOcupados(empresaId: number) {
    const unidadesConOperador = await prisma.unidad.findMany({
      where: {
        empresaId,
        operadorId: { not: null }
      },
      select: { operadorId: true }
    });
    return unidadesConOperador.map(u => u.operadorId).filter(id => id !== null) as number[];
  },

  async crearUnidad(
    numero: string,
    placa: string,
    tipo: string,
    capacidad: number,
    empresaId: number,
    usuarioId: number,
    operadorId?: number
  ) {
    return await prisma.unidad.create({
      data: {
        numero,
        placa,
        tipo,
        capacidad,
        empresa: { connect: { id: empresaId } },
        usuario: { connect: { id: usuarioId } },
        ...(operadorId && {
          operador: { connect: { id: operadorId } }
        })
      },
    });
  },

  async obtenerUnidadesPorEmpresa(empresaId: number) {
    try {
      return await prisma.unidad.findMany({
        where: { empresaId: empresaId },
        include: {
          usuario: { select: { nombre: true } },
          // AÑADIR ESTO: Para que el nombre del operador aparezca en la tabla
          operador: { select: { nombre: true } }
        },
        orderBy: { id: 'desc' }
      });
    } catch (error) {
      console.error("Error al obtener lista de unidades:", error);
      return [];
    }
  },

  async contarUnidades(empresaId: number) {
    try {
      return await prisma.unidad.count({ where: { empresaId } });
    } catch (error) {
      return 0;
    }
  }
};