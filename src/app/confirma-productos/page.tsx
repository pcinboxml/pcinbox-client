"use client";

import { MdAutorenew } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useConfirmaProductos from "./useConfirmaProductos";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import { Alert } from "@mui/material";
import { useMemo } from "react";

const ConfirmaProducts = () => {
  const { formatCurrency, onRouterLink } = useService();
  const {
    columns,
    rows,
    loadingClearCar,
    loadingCotizacion,
    handleGenerateCotizacion,
    handleShowModalVaciarCarrito,
  } = useConfirmaProductos();
  const { dataCart } = useTheContext();

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  return (
    <section>
      {dataCart && dataCart.length > 0 ? (
        <>
          <TimelineComponent activeStep={0} />
          <div className="container-tabla  w-[90%] mx-auto my-3">
            <div
              className="header-container-tabla w-[100%] p-2 bg-[#666666]"
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
              />
            </div>
            {dataCart && dataCart.length > 0 ? (
              <div className="content-tabla-confirma-productos">
                <Table rowsDataGrid={rows} columnsDataGrid={columns} />
              </div>
            ) : (
              <Alert severity="info">No hay datos para mostrar</Alert>
            )}

            {dataCart && dataCart.length > 0 ? (
              <div className="w-full flex justify-end items-center gap-3 py-2">
                <div className="grid grid-cols-[2fr_1fr]">
                  <span
                    className="block text-end"
                    style={{
                      fontWeight: "bold",
                      color: "#666666",
                    }}
                  >
                    Sub total:{" "}
                  </span>
                  <span className="text[#808080] block mx-1">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            ) : null}

            {/* {dataCart && dataCart.length > 0 ? (
              <div className="w-full flex justify-end items-center gap-3 py-2 px-3">
                <div className="grid grid-cols-[2fr_1fr]">
                  <span
                    className="block text-end mx-3"
                    style={{
                      fontWeight: "bold",
                      color: "#B92B3D",
                    }}
                  >
                    Total:
                  </span>
                  <span className="text[#808080] block">
                    {formatCurrency(1200)}
                  </span>
                </div>
              </div>
            ) : null} */}

            {dataCart && dataCart.length > 0 && (
              <div className="w-full flex justify-end items-center  gap-5 mt-4">
                <button
                  className="border py-2 px-3 rounded"
                  onClick={handleShowModalVaciarCarrito}
                  disabled={loadingClearCar}
                >
                  {loadingClearCar ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    "Vaciar carrito"
                  )}
                </button>
                <button
                  disabled={loadingCotizacion}
                  onClick={handleGenerateCotizacion}
                  className="bg-[#666666] py-2 px-4 text-white rounded"
                >
                  {loadingCotizacion ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    "Generar cotización"
                  )}
                </button>
                <button
                  onClick={() => onRouterLink("/opciones-entrega")}
                  className="bg-[#B92B3D] py-2 px-5 text-white rounded"
                >
                  Siguiente paso
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

export default ConfirmaProducts;
