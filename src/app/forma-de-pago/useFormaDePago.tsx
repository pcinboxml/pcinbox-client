"use client";

import { useState, ChangeEvent } from "react";
import GridFormaDePago from "./gridFormaDePago";
import { useTheContext } from "../services/globalContext";
import StripeProviderClient from "../components/stripeClient/StripeClientProvider";
import CardForm from "../components/cardForm/CardForm";
import CardFormRemove from "../components/cardFormRemove/CardFormRemove";

const useFormaDePago = () => {
  const { setDataModal } = useTheContext();

  const { methodsPay, optionsPago } = GridFormaDePago();
  const [idMethodPay, setIdMethodPay] = useState<number>(0);

  const handleSelectOptionPay = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIdMethodPay(Number(value));
  };

  const handleSelectOptionPayById = async (value: number) => {
    setIdMethodPay(value);
  };

  const getValuesStorage = () => {
    const stored = localStorage.getItem("progressPay");
    if (stored) {
      const store = JSON.parse(stored);
      setIdMethodPay(store.methodPay.name);
    }
  };

  const handleRegisterCard = () => {
    setDataModal({
      isOpen: true,
      message: "",
      children: (
        <div className="w-full flex justify-center items-center p-2">
          <StripeProviderClient>
            <CardForm userId={Number(localStorage.getItem("idUser"))} />
          </StripeProviderClient>
        </div>
      ),
      type: "info",
      title: "Registrar Tarjeta",
      showActions: false,
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRemoveCard = () => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas eliminar ésta tarjeta?",
      type: "info",
      title: "Eliminar tarjeta",
      children: <CardFormRemove />,
      showActions: false,
      onConfirm: () => {},
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return {
    optionsPago,
    methodsPay,
    idMethodPay,
    handleSelectOptionPay,
    handleSelectOptionPayById,
    handleRegisterCard,
    getValuesStorage,
    handleRemoveCard,
  };
};

export default useFormaDePago;
