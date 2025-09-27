"use client";

import { MdAutorenew } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import useStorage from "../services/useStorage";
import useResumen from "./useResumen";
import { Alert } from "@mui/material";

const Resumen = () => {
  const { dataCart } = useTheContext();
  const { onRouterLink, formatCurrency } = useService();
  const { rows, columns, loadingCreateOrder, totalPrice, handleCreateOrder } =
    useResumen();
  const { progressPay } = useStorage();

  return (
    <section className="w-[80%] mx-auto my-5">
      {dataCart && dataCart.length > 0 ? (
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
              />

              <span className="text-[white] mx-2"> | RESUMEN</span>
            </div>

            <div className="grid grid-cols-[1fr]">
              <Table rowsDataGrid={rows} columnsDataGrid={columns} />
            </div>

            <div className="w-full mt-2 grid grid-cols-[4fr_1fr]">
              <div className="flex flex-col justify-center items-end pr-2 gap-2">
                <span className="text-[#808080] text-sm">Productos</span>

                <span className="text-[#808080] text-sm">Envió: </span>

                <span className="text-[#808080] text-sm">
                  Tipo de pago: {progressPay.methodPay.typeMethod}
                </span>

                <span className="text-[#808080] text-sm">IVA: </span>
              </div>

              <div className="flex flex-col justify-end items-center gap-2">
                <span className="text-[#808080] text-sm">
                  {formatCurrency(0)}
                </span>
                <span className="text-[#808080] text-sm">
                  {formatCurrency(totalPrice)}
                </span>
                <span className="text-[#808080] text-sm">
                  {formatCurrency(Math.floor(totalPrice * 0.16))}
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
                  {formatCurrency(totalPrice + totalPrice * 0.16)}
                </span>
              </div>
            </div>

            {dataCart && dataCart.length > 0 && (
              <div className="w-full flex justify-end items-center  gap-5 mt-4">
                <button
                  onClick={() => onRouterLink("/forma-de-pago")}
                  className="border py-2 px-5 text-black rounded"
                >
                  Atrás
                </button>
                <button
                  disabled={loadingCreateOrder}
                  className="bg-[#B92B3D] py-2 px-5 text-white rounded"
                  onClick={handleCreateOrder}
                >
                  {loadingCreateOrder ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    <>Confirmar orden</>
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
