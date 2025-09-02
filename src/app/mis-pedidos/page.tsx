"use client";

import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import Table from "../components/table/Table";
import styles from "./mis-pedidos.module.css";
import useMisPedidos from "./useMisPedidos";

const MisPedidos = () => {
  const { rows, columns } = useMisPedidos();

  return (
    <section className={styles.section}>
      <div className="w-[280px] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <div>
          <Table rowsDataGrid={rows} columnsDataGrid={columns} />
        </div>
      </div>
    </section>
  );
};

export default MisPedidos;
