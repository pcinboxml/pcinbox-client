"use client";

import { AddressI } from "@/app/interfaces/address/address.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useStorage from "@/app/services/useStorage";
import { CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAutorenew } from "react-icons/md";

const EliminarDomicilio = ({
  address,
  setOptionEnvio,
}: {
  address: AddressI;
  setOptionEnvio: Dispatch<SetStateAction<string>>;
}) => {
  const { requestPost } = useService();
  const { setDataUserAddress, setDataModal } = useTheContext();
  const [loadingRemoveAddress, setLoadingRemoveAddress] =
    useState<boolean>(false);

  const { handleWriteStorageProgressPay } = useStorage();

  return (
    <div className="flex flex-col p-1 items-center justify-center w-full">
      <span className="text-[#808080] text-[20px] font-bold block text-center w-full">
        ¿Seguro que deseas eliminar el domicilio?
      </span>

      <div
        className="flex items-center justify-center gap-2 w-full"
        style={{
          marginTop: "15px",
        }}
      >
        <div className="text-sm">
          <p className="font-semibold text-gray-800">
            {address.street} #{address.noExt}
            {address.noInt && ` Int. ${address.noInt}`}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {address.cologne}, {address.city} • CP {address.postalCode}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button
          type="button"
          className="border rounded p-2 font-bold"
          onClick={() => setDataModal((prev) => ({ ...prev, isOpen: false }))}
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={async () => {
            try {
              setLoadingRemoveAddress(true);
              const resp = await requestPost(
                {
                  idAddress: address.idAddress,
                },
                "/address/removeAddress"
              );
              setLoadingRemoveAddress(false);

              if (resp.status == 200) {
                const data = await resp.data;
                setDataUserAddress(data.data.data);
                setOptionEnvio("");
                handleWriteStorageProgressPay({
                  optionSend: {
                    name: "",
                    address: 0,
                  },
                });

                setDataModal({
                  isOpen: true,
                  message: "El domicilio fue eliminado correctamente",
                  title: "Correcto",
                  type: "success",
                  showActions: true,
                  onClose: () => {
                    setDataModal((prev) => ({ ...prev, isOpen: false }));
                  },
                  onConfirm: () => {
                    setDataModal((prev) => ({ ...prev, isOpen: false }));
                  },
                });
              }
            } catch (error) {}
          }}
          disabled={loadingRemoveAddress}
          className="p-2 bg-[#BB3D4B] text-white font-bold rounded"
        >
          {loadingRemoveAddress ? (
            <MdAutorenew size={20} className="m-auto animate-spin" />
          ) : (
            "Eliminar domicilio"
          )}
        </button>
      </div>
    </div>
  );
};

export default EliminarDomicilio;
