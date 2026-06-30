"use client";

import { useTheContext } from "../services/globalContext";

type ConfirmEmptyCartOptions = {
  onConfirmEmpty: () => void | Promise<void>;
  title?: string;
  message?: string;
};

export default function useConfirmEmptyCart() {
  const { setDataModal } = useTheContext();

  const confirmEmptyCart = ({
    onConfirmEmpty,
    title = "Vaciar carrito",
    message = "Se eliminarán todos los productos de tu carrito. ¿Deseas continuar? Esta acción no se puede deshacer.",
  }: ConfirmEmptyCartOptions) => {
    setDataModal({
      isOpen: true,
      type: "warning",
      title,
      message,
      showActions: true,
      confirmLabel: "Sí",
      cancelLabel: "No",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
        void onConfirmEmpty();
      },
    });
  };

  return { confirmEmptyCart };
}
