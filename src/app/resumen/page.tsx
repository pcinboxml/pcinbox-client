"use client";

import { MdAutorenew } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import useStorage from "../services/useStorage";
import useResumen from "./useResumen";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import { useCheckoutGuard } from "../hooks/useCheckoutGuard";
import style from "./resumen.module.css";

const Resumen = () => {
  useCheckoutGuard(CheckoutStep.RESUMEN);
  const { dataCart, buyNowProduct } = useTheContext();
  const { checkoutMode } = useStorage();
  const {
    onRouterLink,
    formatCurrency,
    tarifasPaqueteExpress,
    // calcPesoPaquetExpress,
    productsToShow,
  } = useService();
  const {
    rows,
    columns,
    loadingCreateOrder,
    totalPagar,
    selectedFactura,
    handleCreateOrder,
    handleSelectedFactura,
  } = useResumen();

  const { progressPay2 } = useStorage();

  const [costoTotalEnvio, setCostoTotalEnvio] = useState<number>(0);
  // const productsToShow =
  //   checkoutMode === "buy_now" && buyNowProduct != null
  //     ? [buyNowProduct]
  //     : dataCart;

  // useEffect(() => {
  //   if (!dataCart?.length) {
  //     setEnvio(0);
  //     return;
  //   }

  //   const optionSend = progressPay?.optionSend?.name;

  //   // Si aún no está definido, no calcules nada
  //   if (!optionSend) return;

  //   // Entrega en sucursal
  //   if (totalPagar <= 1000 || optionSend === "sucursal") {
  //     setEnvio(0);
  //     return;
  //   }

  //   if (optionSend === "paqueteexpress" && tarifasPaqueteExpress?.length > 0) {
  //     const pesoTotal = dataCart.reduce(
  //       (total, product) => total + calcPesoVolumetrico(product),
  //       0,
  //     );

  //     const tarifa = tarifasPaqueteExpress.find(
  //       (t) => pesoTotal >= t.de && pesoTotal <= t.a,
  //     );

  //     setEnvio(tarifa?.price ?? 0);
  //   }
  // }, [
  //   progressPay?.optionSend?.name,
  //   dataCart,
  //   tarifasPaqueteExpress,
  //   totalPagar,
  // ]);

  // useEffect(() => {
  //   const pesoTotal = calcPesoPaquetExpress(dataCart).reduce(
  //     (acc, item) => acc + (item?.pesoVolumetrico ?? 0),
  //     0,
  //   );

  //   const pesoRedondeado = Math.ceil(pesoTotal);

  //   const tarifa = tarifasPaqueteExpress.find(
  //     (t) => pesoRedondeado >= t.de && pesoRedondeado <= t.a,
  //   );

  //   const precio = tarifa?.price ?? 0;

  //   console.log(precio);
  // }, [dataCart]);

  useEffect(() => {
    if (productsToShow) {
      //antes dataCart
      let costoEnvioPurchase = Object.entries(progressPay2?.dataPurchase!)
        .map((d: any) => {
          let key = d[0].toString().split("-");
          let objData = d[1];

          return {
            storeId: key[0],
            provider: key[1],
            data: objData,
          };
        })
        .reduce((acc, item) => {
          const envio = item.data.costoEnvioProductByZone ?? 0;
          const seguro = item.data.costoSeguroEnvio ?? 0;
          return acc + envio + seguro;
        }, 0);

      setCostoTotalEnvio(Number(costoEnvioPurchase));
    }
  }, [progressPay2, dataCart, buyNowProduct]);

  return (
    <section>
      {productsToShow ? ( //Antes dataCart
        <>
          <TimelineComponent activeStep={3} />
          <div className="container-tabla  w-[90%] mx-auto my-3">
            <div
              className="header-container-tabla w-[100%] p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <img
                src="/logo_blanco_pcinbox.png"
                width={70}
                height={70}
                style={{ objectFit: "contain", marginLeft: "10px" }}
                loading="lazy"
              />

              <span className="text-[white] mx-2"> | RESUMEN</span>
            </div>

            <div className="grid grid-cols-[1fr]">
              <Table rowsDataGrid={rows} columnsDataGrid={columns} />
            </div>

            <div className="w-full mt-2 grid grid-cols-[4fr_1fr]">
              <div className="flex flex-col justify-center items-end pr-2 gap-2">
                <span className="text-[#808080] text-sm">Envío: </span>

                <span className="text-[#808080] text-sm">Tipo de pago:</span>
              </div>

              <div className="flex flex-col justify-end items-center gap-2">
                <span className="text-[#808080] text-sm">
                  {/* {formatCurrency(envio)} */}
                  {productsToShow //Antes dataCart
                    ? formatCurrency(Number(costoTotalEnvio))
                    : null}
                </span>

                <span className="text-[#808080] text-sm">
                  {progressPay2.pay?.name == "tarjeta_debito_credito"
                    ? "Tarjeta Crédito/Débito"
                    : progressPay2.pay?.name == "transferencia"
                      ? "Transferencia"
                      : progressPay2.pay?.name == "efectivo_al_recoger"
                        ? "Efectivo en sucursal"
                        : progressPay2.pay?.name == "tarjeta_al_recoger"
                          ? "Tarjeta Crédito/Débito en sucursal"
                          : progressPay2.pay?.name == "efectivo"
                            ? "Efectivo (OXXO)"
                            : progressPay2.pay?.name == "mercadopago"
                              ? "Mercado Pago"
                              : progressPay2.pay?.name}
                </span>
              </div>
            </div>
            <hr />

            <div className="w-full grid grid-cols-[4fr_1fr]">
              <div className="flex flex-col justify-center items-end pr-2 gap-2">
                <span className="text-[#666666]" style={{ fontWeight: "bold" }}>
                  Total a pagar:{" "}
                </span>
              </div>

              <div className="flex flex-col justify-center items-center pr-2 gap-2">
                <span className="text-[#666666]" style={{ fontWeight: "bold" }}>
                  {productsToShow //antes dataCart
                    ? formatCurrency(totalPagar + costoTotalEnvio)
                    : null}
                </span>
              </div>
            </div>

            {productsToShow && ( //Antes dataCart
              <div
                className={`w-full flex justify-end items-center gap-5 mt-4 ${style.rowButtonsActions}`}
              >
                <FormControlLabel
                  disabled={loadingCreateOrder}
                  control={<Checkbox checked={selectedFactura} />}
                  label="Generar Factura"
                  onChange={handleSelectedFactura}
                />

                <button
                  disabled={loadingCreateOrder}
                  onClick={() => onRouterLink("/forma-de-pago")}
                  className="border py-2 px-5 text-black rounded"
                >
                  Atrás
                </button>
                <button
                  disabled={loadingCreateOrder}
                  className="bg-[#B92B3D] py-2 px-5 text-white rounded"
                  onClick={() => handleCreateOrder(costoTotalEnvio)}
                >
                  {loadingCreateOrder ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    <>Confirmar compra</>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <Alert severity="info">Sin contenido disponible</Alert>
      )}
    </section>
  );
};

export default Resumen;
