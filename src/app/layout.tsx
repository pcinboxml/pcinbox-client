import AppWrapper from "./wrapper";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GlobalProvider } from "./services/globalContext";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";

export const metadata = {
  title: "PCInbox",
  description: "Mi aplicación con diseño responsivo",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <GlobalProvider>
            <AppWrapper children={children} />
          </GlobalProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
