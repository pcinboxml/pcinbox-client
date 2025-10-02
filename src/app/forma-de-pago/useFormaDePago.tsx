"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { CardDataI, CardI } from "../interfaces/card/card.interface";
import GridFormaDePago from "./gridFormaDePago";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { createCardToken } from "@mercadopago/sdk-react/esm/coreMethods";
import { useTheContext } from "../services/globalContext";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";

initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "");

const useFormaDePago = () => {
  const { setDataModal } = useTheContext();
  const { requestPostPagos } = usePasarelaDePagos();

  const { methodsPay, optionsPago } = GridFormaDePago();
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

  const [loadingRegisterCard, setLoadingRegisterCard] =
    useState<boolean>(false);

  const handleSelectOptionPay = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIdMethodPay(Number(value));
  };

  const handleSelectOptionPayById = (value: number) => {
    setIdMethodPay(value);
  };

  const handleRegisterCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingRegisterCard(true);

    try {
      const cardTokenResponse = await createCardToken({
        cardholderName: saveCard.cardholderName,
        cardExpirationMonth: saveCard.cardExpirationMonth,
        cardNumber: saveCard.cardNumber,
        cardExpirationYear: saveCard.cardExpirationYear,
        securityCode: saveCard.securityCode,
      });

      if (cardTokenResponse && cardTokenResponse.id) {
        const response = await requestPostPagos(
          {
            cardToken: cardTokenResponse.id,
            email: localStorage.getItem("email"),
            userId: localStorage.getItem("idUser"),
            lastFourDigits: cardTokenResponse.last_four_digits,
            expMonth: cardTokenResponse.expiration_month,
            expYear: cardTokenResponse.expiration_year,
          },
          "/mp/saveCard"
        );
        setLoadingRegisterCard(false);
        if (response.status == 200) {
          const data = await response.data;
          event.currentTarget.reset();

          setDataCard(data.data.data);
          setDataModal({
            isOpen: true,
            message: "Se registró tu tarjeta exitosamente",
            title: "Correcto",
            type: "success",
            onClose: () => {
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
            onConfirm: () => {
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
          });
        }
      }

      // Aquí puedes enviar cardTokenResponse.id a tu backend para crear el pago, etc.
    } catch (error) {
      setLoadingRegisterCard(false);
      setDataModal({
        isOpen: true,
        message:
          "Ocurrió un error inesperado al registrar la tarjeta, intentelo de nuevo.",
        title: "Error",
        type: "error",
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
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
    loadingRegisterCard,
    dataCard,
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
