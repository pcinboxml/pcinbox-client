"use client";

import { useMediaQuery } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import GridResumen from "./gridResumen";
import useStorage from "../services/useStorage";
import { useState } from "react";
import useService from "../services/useService";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import FormFactura from "../components/formFactura/FormFactura";

const useResumen = () => {
  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);
  const { dataCart, setDataModal } = useTheContext();
  const [selectedFactura, setSelectedFactura] = useState<boolean>(false);
  const [billingData, setBillingData] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {
    noSsr: true,
  });

  const { requestGet, totalPrice } = useService();

  const { progressPay2 } = useStorage();
  const { requestPostPagos } = usePasarelaDePagos();

  const { columns, rows, totalIVA, totalPagar } = GridResumen({
    dataCart,
    isSmallScreen,
  });

  // const getValuesStorage2 = () => {
  //   if (typeof window !== "undefined") {
  //     const stored = localStorage.getItem("progressPay2");
  //     if (stored) {
  //       const store = JSON.parse(stored);

  //       if (store.optionEnvio) {
  //         setOptionEnvio(store.optionEnvio);
  //       }
  //       if (store.addressByStore) {
  //         setAddressByStore(store.addressByStore);
  //       }
  //       if (store.costoEnvioProductByZone) {
  //         setCostoEnvioProductByZone(store.costoEnvioProductByZone);
  //       }
  //     }
  //   }
  // };

  const handleCreateOrder = async (costoTotalEnvio?: number) => {
    if (progressPay2?.pay?.name == "mercadopago") {
      try {
        setLoadingCreateOrder(true);

        const resp = await requestPostPagos(
          {
            userId: Number(localStorage.getItem("idUser")),
            amount:
              dataCart && dataCart.length > 0
                ? totalPagar + costoTotalEnvio!
                : null,
            dataPurchase: progressPay2?.dataPurchase,
            // optionEnvio:
            //   dataCart && dataCart.length > 0
            //     ? totalPagar <= 1000
            //       ? "sucursal"
            //       : progressPay.optionSend.name
            //     : null,
            // idAddress:
            //   dataCart && dataCart.length > 0
            //     ? totalPagar <= 1000
            //       ? 0
            //       : progressPay.optionSend.address
            //     : null,
            dataProduct: dataCart,
            requiredFactura: selectedFactura,
            // storeId: progressPay?.optionSend?.storeIdDico,
          },
          "/mercadopago/preferencePago",
        );

        if (resp.status == 200) {
          window.location.href = resp.data.data.init_point;
          //window.location.href = resp?.data?.data?.sandbox_init_point;
        }
      } catch (error) {
        setLoadingCreateOrder(false);
      }
    } else if (progressPay2?.pay?.name == "openpay") {
      try {
        setLoadingCreateOrder(true);
        const resp = await requestPostPagos(
          {
            userId: Number(localStorage.getItem("idUser")),
            amount:
              dataCart && dataCart.length > 0
                ? totalPagar + costoTotalEnvio!
                : null,
            dataPurchase: progressPay2?.dataPurchase,
            // optionEnvio:
            //   dataCart && dataCart.length > 0
            //     ? totalPagar <= 1000
            //       ? "sucursal"
            //       : progressPay.optionSend.name
            //     : null,
            // idAddress:
            //   dataCart && dataCart.length > 0
            //     ? totalPagar <= 1000
            //       ? 0
            //       : progressPay.optionSend.address
            //     : null,
            dataProduct: dataCart,
            requiredFactura: selectedFactura,
            // storeId: progressPay?.optionSend?.storeIdDico,
          },
          "/openpay/generateLinkOpenPay",
        );
        if (resp.status == 200) {
          const data = resp.data;
          location.href = data.data.data.checkout_link;
          // setLoadingCreateOrder(false);
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
    totalIVA,
    totalPagar,
    selectedFactura,
    handleCreateOrder,
    handleSelectedFactura,
  };
};

export default useResumen;
