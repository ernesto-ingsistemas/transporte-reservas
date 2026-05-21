"use server";

import { UsuarioService } from "@/services/usuario.service";
import bcrypt from "bcryptjs";

/**
 * Genera una contraseña inicial basada en el nombre para facilitar la entrega al usuario.
 */
const generarPasswordInicial = (nombre: string) => {
  const base = nombre.substring(0, 3).replace(/\s/g, '').toLowerCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}!`;
};

export async function registrarAdmin(prevState: any, formData: FormData) {
  // 1. Extraemos los datos del formulario
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const empresaId = Number(formData.get("empresaId"));

  // 2. Generamos la contraseña en texto plano para mostrarla en el cliente
  const passwordOriginal = generarPasswordInicial(nombre);

  try {
    // 3. Encriptamos la contraseña para la Base de Datos
    // Esto evita el error de "Credenciales incorrectas" al loguear
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(passwordOriginal, salt);

    // 4. Guardamos en la base de datos a través del servicio
    await UsuarioService.crearAdmin(nombre, email, passwordHasheada, empresaId);
    
    // 5. IMPORTANTE: Retornamos el objeto de éxito. 
    // No usamos redirect() aquí directamente para que useActionState pueda capturar los datos.
    return { 
      success: true, 
      mensaje: "¡Usuario creado con éxito!",
      datos: {
        email,
        password: passwordOriginal, // Enviamos la original (texto plano) para mostrarla UNA VEZ
        nombre
      }
    };

  } catch (error: any) {
    // Manejo de error de correo duplicado en Prisma
    if (error.code === 'P2002') {
      return { 
        error: "Este correo electrónico ya está registrado. Intenta con otro." 
      };
    }
    
    console.error("Error en el servidor:", error);
    return { 
      error: "Ocurrió un error inesperado en el servidor." 
    };
  }
}