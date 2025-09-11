"use client";

import { MdAutorenew, MdStore } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";

const OpcionesEntrega = () => {
  const { formatCurrency, onRouterLink } = useService();
  //   const { columns, rows, loadingClearCar, handleShowModalVaciarCarrito } =
  //     useConfirmaProductos();
  const { dataCart } = useTheContext();

  return (
    <section className="w-[80%] mx-auto my-5">
      <TimelineComponent activeStep={1} />
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
        <div className="content-tabla-opciones-entrega">
          <div className="grid grid-cols-[auto_auto] w-full">
            <div className="productos p-2">
              <span className="text-[#666666] text-sm">
                djaskdjaldjakldjakl
              </span>
              <hr />
            </div>

            <div className="opcion-de-envio ">
              <div className="flex">
                <input
                  type="radio"
                  name="sucursal"
                  id="sucursal"
                  className="mx-2"
                />
                <MdStore size={26} color="gray" />
                <label className="form-check-label" htmlFor="sucursal">
                  <span className="text-[#666666] text-sm mx-2">
                    Recoger en sucursal
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end items-center gap-3 py-2 px-3">
          <div className="grid grid-cols-[2fr_1fr]">
            <span
              className="block text-end mx-3"
              style={{
                fontWeight: "bold",
                color: "#666666",
              }}
            >
              Sub total:
            </span>
            <span className="text[#808080] block">{formatCurrency(1200)}</span>
          </div>
        </div>

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
            <span className="text[#808080] block">{formatCurrency(1200)}</span>
          </div>
        </div>

        {dataCart && dataCart.length > 0 && (
          <div className="w-full flex justify-end items-center  gap-5 mt-4">
            <button
              className="border py-2 px-3 rounded"
              // onClick={handleShowModalVaciarCarrito}
              // disabled={loadingClearCar}
            >
              {/* {loadingClearCar ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : (
                "Vaciar carrito"
              )} */}
            </button>
            <button className="bg-[#666666] py-2 px-4 text-white rounded">
              Generar cotización
            </button>
            <button
              onClick={() => onRouterLink("/confirma-productos")}
              className="bg-[#ccc] py-2 px-5 text-white rounded"
            >
              Regresar
            </button>
            <button className="bg-[#B92B3D] py-2 px-5 text-white rounded">
              Siguiente paso
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OpcionesEntrega;
