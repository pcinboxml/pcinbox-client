"use client";

import { useState, ChangeEvent, FormEvent, ChangeEventHandler } from "react";
import { CardDataI, CardI } from "../interfaces/card/card.interface";
import GridFormaDePago from "./gridFormaDePago";
// import { initMercadoPago } from "@mercadopago/sdk-react";
// import { createCardToken } from "@mercadopago/sdk-react/esm/coreMethods";
import { useTheContext } from "../services/globalContext";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import StripeProviderClient from "../components/stripeClient/StripeClientProvider";
import CardForm from "../components/cardForm/CardForm";

// initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "");

const useFormaDePago = () => {
  const { setDataModal } = useTheContext();
  const { requestPostPagos } = usePasarelaDePagos();

  const { methodsPay, optionsPago } = GridFormaDePago();
  const [idMethodPay, setIdMethodPay] = useState<number>(0);

  const [loadingTransferBank, setLoadingTransferBank] =
    useState<boolean>(false);

  // const [dataTransferBank, setDataTransfer] = useState({
  //   name: "",
  //   email: "",
  //   monto: 0,
  //   banco: "",
  // });

  const handleSelectOptionPay = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIdMethodPay(Number(value));
  };

  const handleSelectOptionPayById = (value: number) => {
    setIdMethodPay(value);
  };

  // const handleRegisterTransferBank = async (
  //   event: FormEvent<HTMLFormElement>
  // ) => {
  //   event.preventDefault();
  //   setLoadingTransferBank(true);

  //   // try {
  //   //   const cardElement = elements?.getElement(CardElement);

  //   //   if (!stripe || !elements || !cardElement) {
  //   //     console.error("Stripe.js no está listo o cardElement es null");
  //   //     return;
  //   //   }

  //   //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //   //     type: "card",
  //   //     card: cardElement,
  //   //     billing_details: {
  //   //       name: `${localStorage.getItem("name")} ${
  //   //         !localStorage.getItem("lastname")
  //   //           ? ""
  //   //           : localStorage.getItem("lastname")
  //   //       }`,
  //   //       email: localStorage.getItem("email"),
  //   //     },
  //   //   });

  //   //   if (paymentMethod) {
  //   //     const response = await requestPostPagos(
  //   //       {
  //   //         userId: localStorage.getItem("idUser"),
  //   //         paymentMethodId: paymentMethod.id,
  //   //       },
  //   //       "/stripe/saveCard"
  //   //     );

  //   //     if (response.status == 200) {
  //   //       const dataResponse = await response.data;
  //   //       console.log(dataResponse);
  //   //     }
  //   //   }

  //   //   // if (cardTokenResponse && cardTokenResponse.id) {
  //   //   //   const response = await requestPostPagos(
  //   //   //     {
  //   //   //       cardToken: cardTokenResponse.id,
  //   //   //       email: localStorage.getItem("email"),
  //   //   //       userId: localStorage.getItem("idUser"),
  //   //   //       lastFourDigits: cardTokenResponse.last_four_digits,
  //   //   //       expMonth: cardTokenResponse.expiration_month,
  //   //   //       expYear: cardTokenResponse.expiration_year,
  //   //   //     },
  //   //   //     "/mp/saveCard"
  //   //   //   );
  //   //   //   setLoadingRegisterCard(false);
  //   //   //   if (response.status == 200) {
  //   //   //     const data = await response.data;
  //   //   //     event.currentTarget.reset();

  //   //   //     setDataCard(data.data.data);
  //   //   //     setDataModal({
  //   //   //       isOpen: true,
  //   //   //       message: "Se registró tu tarjeta exitosamente",
  //   //   //       title: "Correcto",
  //   //   //       type: "success",
  //   //   //       onClose: () => {
  //   //   //         setDataModal((prev) => ({ ...prev, isOpen: false }));
  //   //   //       },
  //   //   //       onConfirm: () => {
  //   //   //         setDataModal((prev) => ({ ...prev, isOpen: false }));
  //   //   //       },
  //   //   //     });
  //   //   //   }
  //   //   // }

  //   //   // Aquí puedes enviar cardTokenResponse.id a tu backend para crear el pago, etc.
  //   // } catch (error) {
  //   //   setLoadingRegisterCard(false);
  //   //   setDataModal({
  //   //     isOpen: true,
  //   //     message:
  //   //       "Ocurrió un error inesperado al registrar la tarjeta, intentelo de nuevo.",
  //   //     title: "Error",
  //   //     type: "error",
  //   //     onClose: () => {
  //   //       setDataModal((prev) => ({ ...prev, isOpen: false }));
  //   //     },
  //   //     onConfirm: () => {
  //   //       setDataModal((prev) => ({ ...prev, isOpen: false }));
  //   //     },
  //   //   });
  //   // }
  // };

  const getValuesStorage = () => {
    const stored = localStorage.getItem("progressPay");
    if (stored) {
      const store = JSON.parse(stored);
      setIdMethodPay(store.methodPay.name);
    }
  };

  // const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  // };

  // const handleOnChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
  //   const { name, value } = event.target;
  // };

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

  return {
    optionsPago,
    methodsPay,
    idMethodPay,
    loadingTransferBank,
    handleSelectOptionPay,
    handleSelectOptionPayById,
    handleRegisterCard,
    // handleRegisterTransferBank,
    // handleOnChange,
    getValuesStorage,
    // handleOnChangeTextArea,
  };
};

export default useFormaDePago;
