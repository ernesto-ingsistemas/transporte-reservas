"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registrarOperador(formData: FormData) {
    // 1. Verificación de Sesión
    const session = await auth();
    if (!session || !session.user) return { success: false, error: "No autorizado" };
    
    const empresaId = (session.user as any).empresaId;

    // 2. Limpieza de datos
    const nombre = (formData.get("nombre") as string).trim();
    const telefono = (formData.get("telefono") as string).trim();

    // 3. Validación de formato de teléfono
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
        return {
            success: false,
            error: "El teléfono debe contener exactamente 10 dígitos numéricos."
        };
    }

    try {
        // 4. Validación de duplicados dentro de la misma empresa
        const operadorExistente = await prisma.operador.findFirst({
            where: {
                nombre: {
                    equals: nombre,
                    mode: 'insensitive'
                },
                empresaId: empresaId
            }
        });

        if (operadorExistente) {
            return {
                success: false,
                error: "Ya existe un operador registrado con este nombre en tu empresa."
            };
        }

        // 5. Creación del registro
        await prisma.operador.create({
            data: {
                nombre,
                telefono,
                empresaId,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Error al crear operador:", error);
        return {
            success: false,
            error: "Ocurrió un error inesperado al registrar el operador."
        };
    }
}

export async function actualizarOperador(id: number, formData: FormData) {
    // 1. Verificación de Sesión
    const session = await auth();
    if (!session || !session.user) return { success: false, error: "No autorizado" };
    
    const empresaId = (session.user as any).empresaId;

    const nombre = (formData.get("nombre") as string).trim();
    const telefono = (formData.get("telefono") as string).trim();

    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
        return { success: false, error: "El teléfono debe contener 10 dígitos." };
    }

    try {
        // 2. Validación de duplicados (excepto el actual)
        const duplicado = await prisma.operador.findFirst({
            where: {
                nombre: { equals: nombre, mode: 'insensitive' },
                empresaId: empresaId,
                id: { not: id } 
            }
        });

        if (duplicado) {
            return { success: false, error: "Ya existe otro operador con ese nombre." };
        }

        // 3. Actualización con validación de empresaId
        await prisma.operador.update({
            where: { 
                id, 
                empresaId: empresaId // Seguridad: Solo si pertenece a la empresa de la sesión
            },
            data: { nombre, telefono }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al actualizar el operador." };
    }
}

export async function eliminarOperador(id: number) {
    // 1. Verificación de Sesión
    const session = await auth();
    if (!session || !session.user) return { success: false, error: "No autorizado" };
    
    const empresaId = (session.user as any).empresaId;

    try {
        // 2. Eliminación con validación de empresaId
        await prisma.operador.delete({
            where: { 
                id, 
                empresaId: empresaId // Seguridad: No permite borrar operadores de otras empresas
            }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            error: "No se puede eliminar. Verifique que no tenga una unidad asignada o viajes asociados." 
        };
    }
}