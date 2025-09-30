"use client";

import { useEffect } from "react";
import OrderTimeLine from "../components/orderTimeLine/OrderTimeLine";
import PurchaseCard from "../components/purchaseCard/PurchaseCard";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import { pastPurchases, trackingSteps, producto } from "./gridMisCompras";
import useSocket from "../services/ioClient";

const MisCompras = () => {
  const { socketPagos } = useSocket();

  useEffect(() => {}, []);
  return (
    <section className="w-[80%] mx-auto my-3 flex border">
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
        <p className="text-gray-600 mb-6">Compras en curso (1)</p>

        {/* Seguimiento de pedido */}
        <div className="bg-white mb-10">
          <OrderTimeLine
            steps={trackingSteps}
            product={producto}
            onCancel={() => {}}
          />
        </div>

        {/* Compras pasadas */}
        <div className="my-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Compras anteriores
          </h3>
          {pastPurchases.map((purchase, i) => (
            <PurchaseCard key={i} {...purchase} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default MisCompras;
