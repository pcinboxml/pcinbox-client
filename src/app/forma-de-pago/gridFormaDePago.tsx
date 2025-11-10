"use client";

import { MdAccountBalance, MdCreditCard, MdStore } from "react-icons/md";

const GridFormaDePago = () => {
  const optionsPago = [
    {
      id: 1,
      value: "tarjeta_debito_credito",
      label: " Tarjeta de Débito | Crédito",
      icon: <MdCreditCard size={45} style={{ filter: "grayscale(100%)" }} />,
      cargoBancario: "166",
      color: "#666666",
    },

    // {
    //   id: 2,
    //   value: "transferencia",
    //   label: "Transferencia o Deposito bancario",
    //   icon: (
    //     <MdAccountBalance size={40} style={{ filter: "grayscale(100%)" }} />
    //   ),
    //   cargoBancario: "0",
    //   color: "#BA2B3D",
    // },
    // {
    //   id: 3,
    //   value: "efectivo_al_recoger",
    //   label: "Pago en efectivo al recoger",
    //   subLabel: "(No hay apartado de mercancia)",
    //   icon: <MdStore size={40} style={{ filter: "grayscale(100%)" }} />,
    //   cargoBancario: "166",
    //   color: "#BA2B3D",
    // },

    // {
    //   id: 4,
    //   value: "tarjeta_al_recoger",
    //   label: "Pago con tarjeta al recoger",
    //   subLabel: "(No hay apartado de mercancia)",
    //   icon: <MdCreditCard size={40} style={{ filter: "grayscale(100%)" }} />,
    //   cargoBancario: "166",
    //   color: "#666666",
    // },
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
    // {
    //   id: 6,
    //   value: "mercado_pago",
    //   label: "Mercado Pago",
    //   icon: (
    //     <img
    //       src="/mercadopago.jpg"
    //       style={{
    //         objectFit: "contain",
    //         width: "100px",
    //         height: "50px",
    //       }}
    //     />
    //   ),
    //   cargoBancario: "0",
    //   color: "#666666",
    // },
    {
      id: 7,
      value: "openpay",
      label: " Tarjeta de crédito/débito, Efectivo y Transferencia",
      icon: (
        <img
          src={
            "https://documents.openpay.mx/wp-content/uploads/2022/02/openpay-color.png"
          }
          style={{
            objectFit: "contain",
            width: "100px",
            height: "100px",
          }}
        />
      ),
    },
  ];

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

  return {
    optionsPago,
    methodsPay,
  };
};

export default GridFormaDePago;
