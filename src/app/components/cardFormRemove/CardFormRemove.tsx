"use client";
import { useTheContext } from "@/app/services/globalContext";
import usePasarelaDePagos from "@/app/services/pasarela-de-pagos/usePasarelaDePagos";
import { useState } from "react";
import { MdAutorenew } from "react-icons/md";

const CardFormRemove = () => {
  const { setDataModal, selectedCard, setDataCard } = useTheContext();
  const [loadingRemoveCard, setLoadingRemoveCard] = useState<boolean>(false);

  const { requestPostPagos } = usePasarelaDePagos();

  return (
    <div className="flex justify-evenly">
      <button
        onClick={() => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        }}
        className="cursor-pointer text-white border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#808080]"
      >
        Cancelar
      </button>
      <button
        onClick={async () => {
          try {
            setLoadingRemoveCard(true);
            const resp = await requestPostPagos(
              {
                idUser: Number(localStorage.getItem("idUser")),
                pmIdCard: selectedCard,
              },
              "/stripe/removeCardByUser"
            );
            setLoadingRemoveCard(false);
            setDataModal((prev) => ({ ...prev, isOpen: false }));

            const data = resp.data;
            setDataCard(data.data.data);

            setDataModal({
              isOpen: true,
              message: "Tarjeta eliminada correctamente",
              type: "success",
              title: "Correcto",
              onClose: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
              onConfirm: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
            });
          } catch (error) {
            setLoadingRemoveCard(false);
          }
        }}
        disabled={loadingRemoveCard}
        className="cursor-pointer border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#990000] text-white font-bold"
      >
        {loadingRemoveCard ? (
          <MdAutorenew size={20} className="m-auto the-spinner" />
        ) : (
          "Eliminar"
        )}
      </button>
    </div>
  );
};

export default CardFormRemove;
