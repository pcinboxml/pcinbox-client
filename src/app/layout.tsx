import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { GlobalProvider } from "./services/globalContext";
import ClientLayout from "./clientLayout";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
            <ClientLayout>{children}</ClientLayout>
          </GlobalProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
