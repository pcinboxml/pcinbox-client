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
    message = "¿Estás seguro de que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer.",
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
