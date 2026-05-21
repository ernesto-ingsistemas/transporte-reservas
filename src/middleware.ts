import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Creamos una variable que identifique si la ruta actual debe estar protegida
  const isProtectedRoute = 
    nextUrl.pathname.startsWith("/dashboard") || 
    nextUrl.pathname.startsWith("/admin");

  // Si es una ruta protegida y NO está logueado, lo mandamos al login
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  // El matcher le dice a Next.js en qué rutas debe ejecutarse este archivo
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};