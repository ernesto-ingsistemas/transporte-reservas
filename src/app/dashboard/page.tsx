// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { EmpresaService } from "@/services/empresa.service";
import { UnidadService } from "@/services/unidad.service";
import { OperadorService } from "@/services/operador.service";
import { prisma } from "@/lib/prisma";

// Interfaz para Ruta
interface Ruta {
    id: number;
    origen: string;
    destino: string;
    precio: number;
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = session.user as any;
    const empresaId = Number(user.empresaId);

    if (!empresaId) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
                <p className="text-slate-400">Error: No se encontró una empresa asociada.</p>
            </div>
        );
    }

    // 1. Ejecutamos todas las consultas en paralelo
    // Eliminamos la lógica de "idsOcupados" para que la tabla muestre a TODOS los operadores
    const [
        datosEmpresa,
        totalUnidades,
        unidades,
        totalOperadores,
        todosLosOperadores, // Ahora traemos a todos
        totalRutas,
        rutas,
        totalViajes,
        viajes
    ] = await Promise.all([
        EmpresaService.obtenerEmpresaPorId(empresaId),
        UnidadService.contarUnidades(empresaId),
        UnidadService.obtenerUnidadesPorEmpresa(empresaId),
        OperadorService.contarOperadores(empresaId),
        // ✅ CAMBIO CLAVE: Consultamos TODOS los operadores de la empresa sin excepción
        prisma.operador.findMany({
            where: {
                empresaId: empresaId,
            },
            orderBy: { nombre: 'asc' }
        }),
        prisma.ruta.count({
            where: { empresaId }
        }),
        prisma.ruta.findMany({
            where: { empresaId },
            orderBy: { origen: 'asc' }
        }),
        prisma.viaje.count({
            where: { empresaId }
        }),
        prisma.viaje.findMany({
            where: { empresaId },
            include: {
                ruta: true,
                unidad: {
                    include: {
                        operador: true,
                        usuario: true
                    }
                },
                operador: true
            },
            orderBy: { fecha: 'asc' }
        }).then((viajes) => viajes.map((viaje) => ({
            id: viaje.id,
            ruta: viaje.ruta,
            unidad: viaje.unidad,
            operador: viaje.operador,
            fecha: viaje.fecha.toISOString(),
            hora: viaje.horaSalida
        })))
    ]);

    return (
        <DashboardClient
            nombreEmpresa={datosEmpresa?.nombre || "Mi Empresa"}
            totalUnidades={totalUnidades}
            unidades={unidades}
            totalOperadores={totalOperadores}
            operadores={todosLosOperadores}
            empresaId={empresaId}
            totalRutas={totalRutas}
            rutas={rutas as unknown as Ruta[]}
            totalViajes={totalViajes}
            viajes={viajes}
        />
    );
}