"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { MdAccountBalance, MdCreditCard, MdStore } from "react-icons/md";
import { CardDataI, CardI } from "../interfaces/card/card.interface";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
const optionsPago = [
  {
    id: 1,
    value: "tarjeta_debito_credito",
    label: " Tarjeta de Débito | Crédito",
    icon: <MdCreditCard size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "166",
    color: "#666666",
  },

  {
    id: 2,
    value: "transferencia",
    label: "Transferencia o Deposito bancario",
    icon: <MdAccountBalance size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "0",
    color: "#BA2B3D",
  },
  {
    id: 3,
    value: "efectivo_al_recoger",
    label: "Pago en efectivo al recoger",
    subLabel: "(No hay apartado de mercancia)",
    icon: <MdStore size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "166",
    color: "#BA2B3D",
  },

  {
    id: 4,
    value: "tarjeta_al_recoger",
    label: "Pago con tarjeta al recoger",
    subLabel: "(No hay apartado de mercancia)",
    icon: <MdCreditCard size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "166",
    color: "#666666",
  },
  {
    id: 5,
    value: "efectivo",
    label: "OXXO | Pay",
    icon: (
      <img
        src="/oxxo.png"
        style={{
          objectFit: "contain",
          width: "50px",
          height: "50px",
        }}
      />
    ),
    cargoBancario: "0",
    color: "#666666",
  },
];
declare global {
  interface Window {
    MercadoPago: any;
  }
}

const useFormaDePago = () => {
  const methodsPay = [
    {
      id: 1,
      method: "card",
      form: [
        {
          label: "Nombre del titular:",
          input: "text",
          name: "titular",
        },
        {
          label: "Número de tarjeta (16 digitos):",
          input: "number",
          name: "card",
        },
        {
          label: "Fecha de vencimiento:",
          input: "month",
          name: "dataExpired",
        },
        {
          label: "CVV:",
          input: "number",
          name: "cvv",
        },
      ],
    },
    {
      id: 2,
      method: "transferenciaBancaria",
      form: [
        {
          label: "Nombre completo:",
          input: "text",
          name: "name",
        },
        {
          label: "Correo electrónico:",
          input: "email",
          name: "email",
        },
        {
          label: "Monto transferido:",
          input: "number",
          name: "monto",
        },
        {
          label: "Banco desde el cual se realizo la transferencia:",
          input: "text",
          name: "banco",
        },
        {
          label: "Número de referencia o comprobante:",
          input: "number",
          name: "number",
        },
        {
          label: "comentario (opcional):",
          input: "textarea",
          name: "comentario",
        },
      ],
    },
  ];
  const [dataCard, setDataCard] = useState<CardI[]>([]);
  const [idMethodPay, setIdMethodPay] = useState<number>(0);
  const [saveCard, setSaveCard] = useState<CardDataI>({
    cardNumber: "",
    cardholderName: "",
    cardExpirationMonth: "",
    cardExpirationYear: "",
    securityCode: "",
    identificationType: "DNI",
    identificationNumber: "",
  });

  const handleSelectOptionPay = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIdMethodPay(Number(value));
  };

  const handleSelectOptionPayById = (value: number) => {
    setIdMethodPay(value);
  };

  const handleRegisterCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(saveCard);
    // if (!window.MercadoPago) {
    //   console.log("sdk de mercado pago no cargado");
    //   return;
    // }
    // const mp = new window.MercadoPago(
    //   process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!
    // );
  };

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSaveCard((prev) => {
      switch (name) {
        case "card":
          return { ...prev, cardNumber: value.replace(/\s+/g, "").trim() };
        case "dataExpired":
          const [year, month] = value.split("-");
          return {
            ...prev,
            cardExpirationMonth: month,
            cardExpirationYear: year,
          };
        case "titular":
          return { ...prev, cardholderName: value };
        case "cvv":
          return { ...prev, securityCode: value };
        default:
          return prev;
      }
    });
  };

  const getValuesStorage = () => {
    const stored = localStorage.getItem("progressPay");
    if (stored) {
      const store = JSON.parse(stored);
      setIdMethodPay(store.methodPay.name);
    }
  };

  return {
    optionsPago,
    methodsPay,
    idMethodPay,
    setDataCard,
    handleSelectOptionPay,
    handleSelectOptionPayById,
    handleOnChange,
    handleRegisterCard,
    setSaveCard,
    getValuesStorage,
  };
};

export default useFormaDePago;
