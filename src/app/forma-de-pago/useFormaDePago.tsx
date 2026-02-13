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

  const getValuesStorage2 = () => {
    const stored = localStorage.getItem("progressPay2");
    if (stored) {
      const store = JSON.parse(stored);
      setIdMethodPay(store?.pay?.id);
    }
  };

  return {
    optionsPago,
    methodsPay,
    idMethodPay,
    handleSelectOptionPay,
    handleSelectOptionPayById,

    getValuesStorage2,
  };
};

export default useFormaDePago;
