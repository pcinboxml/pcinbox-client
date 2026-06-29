"use client";

import { useTheContext } from "../services/globalContext";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";

type ConfirmRemoveFavoriteOptions = {
  favorite: FavoritesI;
  onConfirmRemove: (favorite: FavoritesI) => void | Promise<void>;
};

export default function useConfirmRemoveFavorite() {
  const { setDataModal } = useTheContext();

  const confirmRemoveFavorite = ({
    favorite,
    onConfirmRemove,
  }: ConfirmRemoveFavoriteOptions) => {
    const productName = favorite.products?.name ?? "este producto";

    setDataModal({
      isOpen: true,
      type: "warning",
      title: "Eliminar de favoritos",
      message: `¿Deseas eliminar "${productName}" de tus favoritos?`,
      showActions: true,
      confirmLabel: "Sí",
      cancelLabel: "No",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
        void onConfirmRemove(favorite);
      },
    });
  };

  return { confirmRemoveFavorite };
}
