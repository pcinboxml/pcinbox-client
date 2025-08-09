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

  const showNavbarRoutes = ["/dashboard"];

  const showNavbar = showNavbarRoutes.includes(pathname);

  return (
    <section style={{ background: bgActive }}>
      {showNavbar && <Navbar />}
      {children}
      <ModalComponent
        isOpen={dataModal.isOpen}
        title={dataModal.title}
        message={dataModal.message}
        onConfirm={() => dataModal.onConfirm()}
        onClose={() => dataModal.onClose()}
        type={dataModal.type}
      />
    </section>
  );
}
