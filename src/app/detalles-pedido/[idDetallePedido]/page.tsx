"use client";

import Table from "../../components/table/Table";
import useService from "../../services/useService";
import useDetallesPedido from "./useDetallesPedido";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const DetallesPedido = () => {
  const { formatCurrency } = useService();
  const { columns, rows, subTotal } = useDetallesPedido();

  const router = useParams();
  const { idDetallePedido } = router;

  useEffect(() => {
    if (idDetallePedido) {
      console.log(idDetallePedido);
    }
  }, []);

  return (
    <div className="w-[80%] border p-3 mx-auto my-4">
      <div className="flex items-center p-0">
        <h4>No.Pedido:</h4>
        <h5
          className="mx-2"
          style={{ fontSize: "25px", fontWeight: "bold", color: "#bb3d4b" }}
        >
          #00001
        </h5>
      </div>
      <br />

      <div>
        <Table rowsDataGrid={rows} columnsDataGrid={columns} />
      </div>

      <>
        <div className="w-full p-2 flex justify-end items-center">
          <span className="text-[#BB3D4B] font-[600] text-[18px]  block">
            Sub Total:
          </span>
          <span className="mx-2 block text-[#808080] font-[600] text-[15px]">
            {formatCurrency(subTotal)}
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
            {formatCurrency(Number(subTotal + 185))}
          </span>
        </div>
      </>
    </div>
  );
};

export default DetallesPedido;
