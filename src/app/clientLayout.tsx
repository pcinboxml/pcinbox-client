// app/ClientLayout.tsx (CORREGIDO)

"use client";

import AppWrapper from "./wrapper";

// 1. Usamos "...props" para capturar CUALQUIER propiedad que le pasemos,
// como "id", "className", etc.
export default function ClientLayout({
  children,
  ...props
}: {
  children: React.ReactNode;
  // Las demás propiedades (como id) están en "...props"
}) {
  // 2. Le pasamos todas esas propiedades al siguiente componente, AppWrapper
  return <AppWrapper {...props}>{children}</AppWrapper>;
}
