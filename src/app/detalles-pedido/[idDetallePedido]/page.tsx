"use client";

import Table from "../../components/table/Table";
import useService from "../../services/useService";
import useDetallesPedido from "./useDetallesPedido";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Alert } from "@mui/material";

const DetallesPedido = () => {
  const { formatCurrency } = useService();
  const { columns, rows, handleGetSalesByUser } = useDetallesPedido();

  const router = useParams();
  const { idDetallePedido } = router;

  useEffect(() => {
    if (idDetallePedido) {
      handleGetSalesByUser(idDetallePedido);
    }
  }, []);

  return (
    <div className="w-[80%] border p-3 mx-auto" style={{ marginTop: "100px" }}>
      {rows && rows.length > 0 ? (
        <div className="flex items-center p-0">
          <h4>No.Pedido:</h4>
          <h5
            className="mx-2"
            style={{ fontSize: "25px", fontWeight: "bold", color: "#bb3d4b" }}
          >
            #{idDetallePedido}
          </h5>
        </div>
      ) : null}
      <br />

      {rows && rows.length > 0 ? (
        <div>
          <Table rowsDataGrid={rows} columnsDataGrid={columns} />
        </div>
      ) : (
        <Alert severity="info">Sin contenido disponible</Alert>
      )}

      {rows && rows.length > 0 ? (
        <>
          <div className="w-full p-2 flex justify-end items-center">
            <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
              Envio:
            </span>
            <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
              {"Gratis"}
            </span>
          </div>

          <div className="w-full p-2 flex justify-end items-center">
            <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
              Total:
            </span>
            <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
              {formatCurrency(
                Number(
                  rows.reduce((previousVal: any, currentValue: any) => {
                    return previousVal + Number(currentValue.totalPrice);
                  }, 0)
                )
              )}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DetallesPedido;
