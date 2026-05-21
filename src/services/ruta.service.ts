import { prisma } from "@/lib/prisma";

export const RutaService = {
    async obtenerRutasPorEmpresa(empresaId: number) {
        return await prisma.ruta.findMany({
            where: { empresaId },
            orderBy: { origen: 'asc' }
        });
    },

    async contarRutas(empresaId: number) {
        return await prisma.ruta.count({
            where: { empresaId }
        });
    }
};