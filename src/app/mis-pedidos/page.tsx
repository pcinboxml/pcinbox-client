"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import Table from "../components/table/Table";
import styles from "./mis-pedidos.module.css";
import useMisPedidos from "./useMisPedidos";
import { Alert } from "@mui/material";

const MisPedidos = () => {
  const { rows, columns, handleGetPedidosByUser } = useMisPedidos();

  useEffect(() => {
    handleGetPedidosByUser();
  }, []);
  return (
    <section className={styles.section}>
      <div className="w-[280px] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <Alert severity="info">Sin contenido disponible</Alert>
        {/* {rows && rows.length > 0 ? (
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
        ) : (
          <Alert severity="info">Sin contenido disponible</Alert>
        )} */}
      </div>
    </section>
  );
};

export default MisPedidos;
