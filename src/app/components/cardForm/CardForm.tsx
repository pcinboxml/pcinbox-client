"use client";

import { useTheContext } from "@/app/services/globalContext";
import usePasarelaDePagos from "@/app/services/pasarela-de-pagos/usePasarelaDePagos";
import {
  useStripe,
  useElements,
  CardElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { MdAutorenew } from "react-icons/md";

const CardForm = ({ userId }: { userId: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const { requestPostPagos } = usePasarelaDePagos();
  const { setDataModal, setDataCard } = useTheContext();

  const [loadingRegisterCard, setLoadingRegisterCard] =
    useState<boolean>(false);

  const handleRegisterCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const cardNumberElement = elements?.getElement(CardNumberElement);

      if (!stripe || !elements || !cardNumberElement) {
        console.error("Stripe.js no está listo o cardElement es null");
        return;
      }

      setLoadingRegisterCard(true);

      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: `${localStorage.getItem("name")} ${
            !localStorage.getItem("lastname")
              ? ""
              : localStorage.getItem("lastname")
          }`,
          email: localStorage.getItem("email"),
        },
      });

      if (paymentMethod) {
        const response = await requestPostPagos(
          {
            userId: userId,
            paymentMethodId: paymentMethod.id,
          },
          "/stripe/saveCard"
        );

        setLoadingRegisterCard(false);
        if (response.status == 200) {
          event.currentTarget.reset();
          const dataResponse = await response.data;
          setDataCard(dataResponse.data.data);

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

  return (
    <form onSubmit={handleRegisterCard}>
      <div className="flex flex-col gap-2 items-center mt-4 relative">
        <label
          htmlFor=""
          className="text-[#808080] text-base text-left block w-full"
        >
          Nombre del titular:
        </label>
        <input
          type="text"
          placeholder="Nombre del titular"
          className="form-control"
          name={"titular"}
          // onChange={handleOnChange}
        />
      </div>

      <div className="flex flex-col gap-2 items-center mt-4 relative">
        <label
          htmlFor=""
          className="text-[#808080] text-base text-left block w-full"
        >
          Número de tarjeta:
        </label>
        <CardNumberElement
          options={{ style: { base: { fontSize: "16px" } }, showIcon: false }}
          className="form-control"
        />
      </div>

      <div className="flex flex-col gap-2 items-center mt-4 relative">
        <label
          htmlFor=""
          className="text-[#808080] text-base text-left block w-full"
        >
          Fecha de expiración:
        </label>
        <CardExpiryElement
          options={{ style: { base: { fontSize: "16px" } } }}
          className="form-control"
        />
      </div>

      <div className="flex flex-col gap-2 items-center mt-4 relative">
        <label
          htmlFor=""
          className="text-[#808080] text-base text-left block w-full"
        >
          CVC:
        </label>
        <CardCvcElement
          options={{ style: { base: { fontSize: "16px" } } }}
          className="form-control"
        />
      </div>

      <button
        type="submit"
        disabled={loadingRegisterCard}
        className="rounded p-2 bg-[#BA2B3D] text-white font-bold my-4 w-full"
      >
        {loadingRegisterCard ? (
          <MdAutorenew size={20} className="m-auto the-spinner" />
        ) : (
          "Registrar tarjeta"
        )}
      </button>
    </form>
  );
};

export default CardForm;
