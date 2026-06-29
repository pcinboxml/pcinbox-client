"use client";

import { MdAutorenew } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import useResumen from "./useResumen";
import useCheckoutDraft from "../hooks/useCheckoutDraft";
import useStorage from "../services/useStorage";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import { useCheckoutGuard } from "../hooks/useCheckoutGuard";
import style from "./resumen.module.css";

const Resumen = () => {
  useCheckoutGuard(CheckoutStep.RESUMEN);

  const { dataCart, buyNowProduct, hasToken, setDataModal } = useTheContext();
  const { checkoutMode } = useStorage();
  const { fetchSummary, summary, loadingSummary } = useCheckoutDraft();
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

  const [costoTotalEnvio, setCostoTotalEnvio] = useState<number>(0);

  useEffect(() => {
    if (!productsToShow?.length) {
      setCostoTotalEnvio(0);
      return;
    }

    void fetchSummary(productsToShow).then((data) => {
      if (data) {
        setCostoTotalEnvio(Number(data.shippingTotal) || 0);
      }
    });
  }, [productsToShow, fetchSummary]);

  return (
    <section>
      {productsToShow && productsToShow.length > 0 ? ( //Antes dataCart
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
                  {summary?.paymentMethod?.name == "tarjeta_debito_credito"
                    ? "Tarjeta Crédito/Débito"
                    : summary?.paymentMethod?.name == "transferencia"
                      ? "Transferencia"
                      : summary?.paymentMethod?.name == "efectivo_al_recoger"
                        ? "Efectivo en sucursal"
                        : summary?.paymentMethod?.name == "tarjeta_al_recoger"
                          ? "Tarjeta Crédito/Débito en sucursal"
                          : summary?.paymentMethod?.name == "efectivo"
                            ? "Efectivo (OXXO)"
                            : summary?.paymentMethod?.name == "mercadopago"
                              ? "Mercado Pago"
                              : summary?.paymentMethod?.name ?? "—"}
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

            {productsToShow &&
              productsToShow?.length > 0 && ( //Antes dataCart
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
                    onClick={() => {
                      if (!hasToken) {
                        setDataModal({
                          isOpen: true,
                          message:
                            "Tu sesión expiró, debes iniciar sesión nuevamente.",
                          title: "Sesión expirada",

                          onClose: () => {
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            }));
                          },

                          onConfirm: async () => {
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            }));
                          },

                          type: "info",
                        });
                      } else {
                        handleCreateOrder(costoTotalEnvio);
                      }
                    }}
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
