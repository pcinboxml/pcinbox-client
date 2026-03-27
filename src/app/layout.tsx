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
