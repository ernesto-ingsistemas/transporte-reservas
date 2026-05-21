import { prisma } from "@/lib/prisma";

export const UsuarioService = {
  // VERIFICA QUE ESTÉN LOS 4 ARGUMENTOS AQUÍ:
  async crearAdmin(nombre: string, email: string, password: string, empresaId: number) {
    return await prisma.usuario.create({
      data: {
        nombre,
        email,
        password,
        rol: "admin",
        empresaId,
      },
    });
  },
};