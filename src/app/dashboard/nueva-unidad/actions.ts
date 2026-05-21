"use server";

import { auth } from "@/auth";
import { UnidadService } from "@/services/unidad.service";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Registrar Unidad
export async function registrarUnidad(formData: FormData) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("No autorizado");
  }

  const empresaId = (session.user as any).empresaId;
  const usuarioId = Number(session.user.id);

  const numero = formData.get("numero") as string;
  const placa = (formData.get("placa") as string).trim();
  const tipo = formData.get("tipo") as string;
  const capacidad = Number(formData.get("capacidad"));
  const operadorIdRaw = formData.get("operadorId");
  const operadorId = operadorIdRaw ? Number(operadorIdRaw) : undefined;

  if (!numero || !placa) {
    throw new Error("Datos obligatorios faltantes");
  }

  try {
    await UnidadService.crearUnidad(
      numero,
      placa,
      tipo,
      capacidad,
      empresaId,
      usuarioId,
      operadorId
    );

    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
    throw new Error("Error al guardar en la base de datos");
  }
}

// 2. ACTUALIZAR UNIDAD
export async function actualizarUnidad(id: number, formData: FormData) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("No autorizado");
  }

  const empresaId = (session.user as any).empresaId;

  const numero = formData.get("numero") as string;
  const placa = (formData.get("placa") as string).trim();
  const tipo = formData.get("tipo") as string;
  const capacidad = Number(formData.get("capacidad"));
  const operadorIdRaw = formData.get("operadorId");

  const operadorId = operadorIdRaw ? Number(operadorIdRaw) : null;

  try {
    await prisma.unidad.update({
      where: {
        id: id,
        empresaId: empresaId
      },
      data: {
        numero,
        placa,
        tipo,
        capacidad,
        operadorId
      }
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar la unidad");
  }
}

// 3. ELIMINAR UNIDAD
export async function eliminarUnidad(id: number) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("No autorizado");
  }

  const empresaId = (session.user as any).empresaId;

  try {
    await prisma.unidad.delete({
      where: {
        id: id,
        empresaId: empresaId
      }
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
    throw new Error(
      "No se pudo eliminar. Verifica que no tenga viajes asociados."
    );
  }
}

export async function asignarOperadorAUnidad(unidadId: number, operadorId: number) {
  try {
    await prisma.unidad.update({
      where: { id: unidadId },
      data: { operadorId: operadorId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al vincular operador" };
  }
}