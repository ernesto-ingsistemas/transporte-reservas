import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    // 1. Agregamos el secret aquí para que lea la variable del .env
    secret: process.env.AUTH_SECRET, 
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await prisma.usuario.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password as string, user.password);

                if (isValid) {
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.nombre,
                        empresaId: user.empresaId
                    };
                }
                return null;
            },
        }),
    ],
    // 2. Definimos las páginas personalizadas para que el middleware sepa a dónde mandar al usuario
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.empresaId = user.empresaId;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.empresaId = token.empresaId;
            }
            return session;
        },
    },
});