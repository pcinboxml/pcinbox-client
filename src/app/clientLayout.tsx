// app/ClientLayout.tsx
"use client";

import AppWrapper from "./wrapper";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppWrapper>{children}</AppWrapper>;
}
