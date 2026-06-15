import type { Metadata } from "next";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { GlobalProvider } from "./services/globalContext";
import ClientLayout from "./clientLayout";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Suspense } from "react";
import {
  ScrollRestoration,
  experimental_ScrollRestorationBeforeHydration,
} from "next-scroll-restoration";
import { getSiteUrl } from "./lib/getSiteUrl";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "PCInbox",
    template: "%s | PCInbox",
  },
  description:
    "Tienda en línea de tecnología, computadoras y componentes en México.",
  openGraph: {
    siteName: "PCInbox",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <GlobalProvider>
            <Suspense>
              <ClientLayout>{children}</ClientLayout>
            </Suspense>
          </GlobalProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
