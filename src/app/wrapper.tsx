"use client";

import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import { useTheContext } from "./services/globalContext";
import { SessionProvider } from "next-auth/react";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dataModal } = useTheContext();

  return (
    <SessionProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          minHeight: "100vh",
        }}
      >
        <Navbar />

        <main style={{ flex: 1 }}>
          {children}

          <ModalComponent
            isOpen={dataModal.isOpen}
            title={dataModal.title}
            message={dataModal.message}
            onConfirm={() => dataModal.onConfirm()}
            onClose={() => dataModal.onClose()}
            type={dataModal.type}
            children={dataModal.children}
          />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
