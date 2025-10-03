"use client";

import { Alert } from "@mui/material";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import Table from "../components/table/Table";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import styles from "./ordenes.module.css";
import useOrdenes from "./useOrdenes";

const Ordenes = () => {
  const { formatCurrency, onRouterLink } = useService();
  const { rows, columns, subTotal } = useOrdenes();
  const { dataCart } = useTheContext();

  return (
    <section className={styles.section}>
      <div className="w-[280px] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <span className="text-[#BB3D4B] font-[600] text-[22px] mb-3 block">
          Carrito de compras
        </span>
        {dataCart && dataCart.length > 0 ? (
          <div>
            <Table rowsDataGrid={rows} columnsDataGrid={columns} />
          </div>
        ) : (
          <Alert severity="info">No hay datos para mostrar</Alert>
        )}
        {dataCart && dataCart.length > 0 ? (
          <>
            <div className="w-full p-2 flex justify-end items-center">
              <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
                Sub Total sin IVA:
              </span>
              <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
                {formatCurrency(subTotal)}
              </span>
            </div>

            <div className="w-full mt-3 p-2 flex justify-end items-center">
              <button
                onClick={() => onRouterLink("/confirma-productos")}
                className="rounded bg-[#BB3D4B] text-white font-bold p-3 hover:bg-red-600"
              >
                Proceder con el pago
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Ordenes;
