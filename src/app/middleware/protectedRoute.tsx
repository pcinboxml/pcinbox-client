"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useProtectedRoute(pathname: string) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && pathname == "/register") {
      // si no hay token, redirige a login
      router.replace("/register");
    } else {
      // si hay token y estás en login o register, redirige a home
      if (pathname === "/principal" || pathname === "/register") {
        router.replace("/principal");
      }
    }
  }, [router, pathname]);
}
