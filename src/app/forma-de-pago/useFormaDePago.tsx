"use client";

import { useState, useEffect } from "react";
import { MdAccountBalance, MdCreditCard, MdStore } from "react-icons/md";
import { CardI } from "../interfaces/card/card.interface";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
const optionsPago = [
  {
    value: "tarjeta_debito_credito",
    label: " Tarjeta de Débito | Crédito",
    icon: <MdCreditCard size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "166",
    color: "#666666",
  },

  {
    value: "transferencia",
    label: "Transferencia o Deposito bancario",
    icon: <MdAccountBalance size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "0",
    color: "#BA2B3D",
  },
  {
    value: "efectivo_al_recoger",
    label: "Pago en efectivo al recoger",
    subLabel: "(No hay apartado de mercancia)",
    icon: <MdStore size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "166",
    color: "#BA2B3D",
  },

  {
    value: "tarjeta_al_recoger",
    label: "Pago con tarjeta al recoger",
    subLabel: "(No hay apartado de mercancia)",
    icon: <MdCreditCard size={40} style={{ filter: "grayscale(100%)" }} />,
    cargoBancario: "166",
    color: "#666666",
  },
  {
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
const useFormaDePago = () => {
  const [dataCard, setDataCard] = useState<CardI[]>([]);

  return {
    optionsPago,
    setDataCard,
  };
};

export default useFormaDePago;
