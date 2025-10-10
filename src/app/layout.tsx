"use client";

import AppWrapper from "./wrapper";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { GlobalProvider } from "./services/globalContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <AppWrapper children={children} />
        </GlobalProvider>
      </body>
    </html>
  );
}
