"use client";

import { useTheContext } from "@/app/services/globalContext";
import { useEffect, useState } from "react";
import { MdAutorenew } from "react-icons/md";

const CancelledCompra = ({
  handleCancelPedido,
  historyCompra,
}: {
  handleCancelPedido?: any;
  historyCompra?: any;
}) => {
  const [loadingCancelledCompra, setLoadingCancelledCompra] =
    useState<boolean>(false);

  const { setDataModal } = useTheContext();

  return (
    <div>
      <span className="block text-center my-2 text-[17px]">
        ¿Seguro que deseas cancelar la compra{" "}
        <span className="text-black font-bold">#{historyCompra?.idOrder}</span>{" "}
        ?
      </span>

      <div className="flex justify-around">
        <button
          type="button"
          className="border text-[#808080] rounded px-2 py-1"
          onClick={() => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          Cerrar
        </button>
        <button
          className={` text-white font-bold bg-[#bb3d4b] px-2 py-1 rounded`}
          disabled={loadingCancelledCompra}
          type="button"
          onClick={async () => {
            setLoadingCancelledCompra(true); // activamos el spinner
            try {
              await handleCancelPedido(historyCompra); // llamamos a la función
            } catch (error) {
              console.error("Error al cancelar la compra:", error);
            } finally {
              setLoadingCancelledCompra(false); // desactivamos el spinner siempre
            }
          }}
        >
          {loadingCancelledCompra ? (
            <MdAutorenew size={20} className="m-auto the-spinner" />
          ) : (
            <>Cancelar compra</>
          )}
        </button>
      </div>
    </div>
  );
};

export default CancelledCompra;
