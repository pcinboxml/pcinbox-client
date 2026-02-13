// hooks/useProtectedRoute.ts
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Rutas que son SOLO para invitados (no logueados).
// Si un usuario logueado intenta acceder, será redirigido.
const guestOnlyRoutes = ["/register", "/forgotpassword"];

// Opcional: Rutas que son SOLO para usuarios logueados.
// Si un invitado intenta acceder, será redirigido.
// Esto es útil si en el futuro tienes páginas como /perfil, /ajustes, etc.
const protectedRoutes: any[] = []; // <-- Deja esto vacío por ahora. /principal no va aquí.

export default function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isGuestOnlyRoute = guestOnlyRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.includes(pathname);

    // --- LÓGICA PARA USUARIOS AUTENTICADOS (tienen token) ---
    if (token) {
      // Si está logueado y trata de acceder a una ruta SOLO para invitados,
      // lo redirigimos a la página principal.
      if (isGuestOnlyRoute) {
        router.replace("/principal");
      }
      // Si está en /principal o cualquier otra ruta, lo dejamos pasar.
    }
    // --- LÓGICA PARA USUARIOS NO AUTENTICADOS (no tienen token) ---
    else {
      // Si NO está logueado y trata de acceder a una ruta PROTEGIDA,
      // lo redirigimos a la página de registro.
      if (isProtectedRoute) {
        router.replace("/register");
      }
      // Si está en /principal, /register o /forgotpassword, lo dejamos pasar.
    }
  }, [pathname, router]);
}
