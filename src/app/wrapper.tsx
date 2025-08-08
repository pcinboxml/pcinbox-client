import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import { useTheContext } from "./services/globalContext";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bgActive, dataModal } = useTheContext();

  return (
    <section style={{ background: bgActive, height: "100%" }}>
      <Navbar />
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
