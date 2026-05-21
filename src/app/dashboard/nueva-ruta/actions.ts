"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearRuta(formData: { origen: string, destino: string, precio: number }) {
    const session = await auth();
    if (!session || !session.user) return { error: "No autorizado" };

    const empresaId = (session.user as any).empresaId;

    try {
        await prisma.ruta.create({
            data: {
                origen: formData.origen,
                destino: formData.destino,
                precio: formData.precio,
                empresaId: empresaId, // Usamos el ID de la sesión
            },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al crear la ruta" };
    }
}

export async function actualizarRuta(id: number, formData: { origen: string, destino: string, precio: number }) {
    const session = await auth();
    if (!session || !session.user) return { error: "No autorizado" };

    const empresaId = (session.user as any).empresaId;

    try {
        await prisma.ruta.update({
            where: {
                id: id,
                empresaId: empresaId // Seguridad: validamos contra la sesión
            },
            data: {
                origen: formData.origen,
                destino: formData.destino,
                precio: formData.precio,
            },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al actualizar la ruta" };
    }
}

export async function eliminarRuta(id: number) {
    const session = await auth();
    if (!session || !session.user) return { error: "No autorizado" };

    const empresaId = (session.user as any).empresaId;

    try {
        await prisma.ruta.delete({
            where: { 
                id: id,
                empresaId: empresaId // Seguridad: validamos contra la sesión
            },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: "No se pudo eliminar la ruta. Verifique que no tenga viajes asociados."
        };
    }
}