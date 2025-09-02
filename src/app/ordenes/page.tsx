"use client";

import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import Table from "../components/table/Table";
import useService from "../services/useService";
import styles from "./ordenes.module.css";
import useOrdenes from "./useOrdenes";

const Ordenes = () => {
  const { formatCurrency } = useService();
  const { rows, columns } = useOrdenes();

  return (
    <section className={styles.section}>
      <div className="w-[280px] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <div>
          <Table rowsDataGrid={rows} columnsDataGrid={columns} />
        </div>
        <div className="w-full p-2 flex justify-end items-center">
          <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
            Sub Total:
          </span>
          <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
            {formatCurrency(500)}
          </span>
        </div>
        <div className="w-full p-2 flex justify-end items-center">
          <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
            Envio:
          </span>
          <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
            {formatCurrency(185)}
          </span>
        </div>

        <div className="w-full p-2 flex justify-end items-center">
          <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
            Total:
          </span>
          <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
            {formatCurrency(270)}
          </span>
        </div>

        <div className="w-full mt-3 p-2 flex justify-end items-center">
          <button className="rounded bg-[#BB3D4B] text-white font-bold p-3">
            Proceder con el pago
          </button>
        </div>
      </div>
    </section>
  );
};

export default Ordenes;
