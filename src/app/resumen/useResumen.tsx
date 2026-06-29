"use client";



import { useMediaQuery } from "@mui/material";

import { useTheContext } from "../services/globalContext";

import GridResumen from "./gridResumen";

import { useState } from "react";

import useService from "../services/useService";

import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";

import FormFactura from "../components/formFactura/FormFactura";

import useCheckoutDraft from "../hooks/useCheckoutDraft";



const useResumen = () => {

  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);

  const { setDataModal } = useTheContext();

  const [selectedFactura, setSelectedFactura] = useState<boolean>(false);

  const [billingData, setBillingData] = useState(null);



  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {

    noSsr: true,

  });



  const { requestGet, totalPrice, productsToShow } = useService();

  const { buildPaymentPayload } = useCheckoutDraft();

  const { requestPostPagos } = usePasarelaDePagos();



  const { columns, rows, totalPagar } = GridResumen({

    isSmallScreen,

  });



  const handleCreateOrder = async (costoTotalEnvio?: number) => {

    const payload = await buildPaymentPayload({

      requiredFactura: selectedFactura,

      products: productsToShow ?? undefined,

    });



    if (!payload) {

      setDataModal({

        isOpen: true,

        type: "error",

        title: "Error",

        message: "No se pudo validar el checkout. Revisa entrega y pago.",

        showActions: true,

        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),

        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),

      });

      return;

    }



    const payName = payload.pay?.name;



    if (payName === "mercadopago") {

      try {

        setLoadingCreateOrder(true);



        const resp = await requestPostPagos(

          {

            userId: payload.userId,

            amount: payload.amount,

            dataPurchase: payload.dataPurchase,

            dataProduct: payload.dataProduct,

            requiredFactura: payload.requiredFactura,

          },

          "/mercadopago/preferencePago",

        );



        if (resp.status == 200) {

          window.location.href = resp.data.data.init_point;

        }

      } catch (error) {

        setLoadingCreateOrder(false);

      }

    } else if (payName === "openpay") {

      try {

        setLoadingCreateOrder(true);

        const resp = await requestPostPagos(

          {

            userId: payload.userId,

            amount: payload.amount,

            dataPurchase: payload.dataPurchase,

            dataProduct: payload.dataProduct,

            requiredFactura: payload.requiredFactura,

          },

          "/openpay/generateLinkOpenPay",

        );

        if (resp.status == 200) {

          location.href = resp.data.data.data.checkout_link;

        }

      } catch (error) {

        setLoadingCreateOrder(false);

      }

    }

  };



  const handleSelectedFactura = async (

    event: React.SyntheticEvent,

    checked: boolean,

  ) => {

    setSelectedFactura(checked);



    if (billingData) {

      return;

    }



    if (checked == true) {

      try {

        const resp = await requestGet("/billing/getBillingByUser");

        if (resp.status == 200) {

          const data = resp.data;



          if (data.data.data == null) {

            setDataModal({

              isOpen: true,

              showActions: false,

              message: <FormFactura />,

              title: "Registro de facturación",

              type: "info",

              onClose: () => {

                setDataModal((prev) => ({ ...prev, isOpen: false }));

                setSelectedFactura(false);

              },

              onConfirm: () => {

                setDataModal((prev) => ({ ...prev, isOpen: false }));

              },

            });

          } else {

            setBillingData(data.data.data);

          }

        }

      } catch (error) {}

    }

  };



  return {

    loadingCreateOrder,

    columns,

    rows,

    totalPrice,

    totalPagar,

    selectedFactura,

    handleCreateOrder,

    handleSelectedFactura,

  };

};



export default useResumen;


