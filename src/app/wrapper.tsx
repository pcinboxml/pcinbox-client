import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import { useTheContext } from "./services/globalContext";
import { usePathname } from "next/navigation";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bgActive, dataModal } = useTheContext();

  const pathname = usePathname();

  const showNavbarAndFooterRoutes =
    pathname !== "/" && pathname !== "/register";

  return (
    <section style={{ background: bgActive }}>
      {showNavbarAndFooterRoutes && <Navbar />}
      {children}
      <ModalComponent
        isOpen={dataModal.isOpen}
        title={dataModal.title}
        message={dataModal.message}
        onConfirm={() => dataModal.onConfirm()}
        onClose={() => dataModal.onClose()}
        type={dataModal.type}
      />
      {showNavbarAndFooterRoutes && <Footer />}
    </section>
  );
}
