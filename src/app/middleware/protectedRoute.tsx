"use client";

// pages/register.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/principal");
    }
  }, []);
}
