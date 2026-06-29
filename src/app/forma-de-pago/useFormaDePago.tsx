"use client";



import { useState, ChangeEvent } from "react";

import GridFormaDePago from "./gridFormaDePago";

import { useTheContext } from "../services/globalContext";

import useCheckoutDraft from "../hooks/useCheckoutDraft";



const useFormaDePago = () => {

  const { setDataModal } = useTheContext();

  const { getDraft } = useCheckoutDraft();



  const { methodsPay, optionsPago } = GridFormaDePago();

  const [idMethodPay, setIdMethodPay] = useState<number>(0);



  const handleSelectOptionPay = (event: ChangeEvent<HTMLInputElement>) => {

    const { value } = event.target;

    setIdMethodPay(Number(value));

  };



  const handleSelectOptionPayById = async (value: number) => {

    setIdMethodPay(value);

  };



  const getValuesStorage2 = async () => {

    const draft = await getDraft();

    if (draft?.paymentMethod?.id) {

      setIdMethodPay(Number(draft.paymentMethod.id));

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


