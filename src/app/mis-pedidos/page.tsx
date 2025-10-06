"use client";

import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import Table from "../components/table/Table";
import styles from "./mis-pedidos.module.css";
import useMisPedidos from "./useMisPedidos";

const MisPedidos = () => {
  const { rows, columns } = useMisPedidos();

  return (
    <section
      className={styles.section}
      style={{
        width: "80%",
        margin: "30px auto",
        display: "flex",
      }}
    >
      <div className="w-[280px] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <div>
          <span
            className="text-[#bb3d4b]"
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              marginBottom: "10px",
              marginTop: "10px",
              display: "block",
            }}
          >
            Mis pedidos
          </span>
          <Table rowsDataGrid={rows} columnsDataGrid={columns} />
        </div>
      </div>
    </section>
  );
};

export default MisPedidos;
