"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useProtectedRoute(pathname: string) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ NO autenticado
    // if (!token) {
    //   if (pathname === "/principal") {
    //     router.replace("/register"); // o "/login"
    //   }
    //   return;
    // }

    // ✅ Autenticado
    if (token) {
      if (pathname === "/register" || pathname === "/login") {
        router.replace("/principal");
      }
    }
  }, [pathname, router]);
}
