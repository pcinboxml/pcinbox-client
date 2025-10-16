"use client";

import { useEffect } from "react";
import OrderTimeLine from "../components/orderTimeLine/OrderTimeLine";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import { trackingSteps } from "./gridMisCompras";
import useMisCompras from "./useMisCompras";

const MisCompras = () => {
  const { handleMisCompras, dataHistoryCompras } = useMisCompras();

  useEffect(() => {
    handleMisCompras();
  }, []);
  return (
    <section
      className="w-[80%] mx-auto flex border"
      style={{
        width: "80% !important",
        margin: "auto",
        display: "flex",
      }}
    >
      <div className="w-[280px] border ">
        <SidebarMiCuenta />
      </div>

      <main className="w-full p-3">
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
          Mis compras
        </span>
        <p className="text-gray-600 mb-6">
          Compras en curso (
          {dataHistoryCompras &&
            dataHistoryCompras.filter((c) => c.status == "paid").length}
          )
        </p>

        {/* Seguimiento de pedido */}
        <div className="bg-white mb-10">
          <OrderTimeLine steps={trackingSteps} product={dataHistoryCompras} />
        </div>

        {/* Compras pasadas */}
        {/* <div className="my-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Compras anteriores
          </h3>
          {pastPurchases.map((purchase, i) => (
            <PurchaseCard key={i} {...purchase} />
          ))}
        </div> */}
      </main>
    </section>
  );
};

export default MisCompras;
