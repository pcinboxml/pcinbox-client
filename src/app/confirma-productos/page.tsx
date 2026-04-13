"use client";

import { MdAutorenew } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useConfirmaProductos from "./useConfirmaProductos";
import useService from "../services/useService";
import { Alert } from "@mui/material";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import { useCheckoutGuard } from "../hooks/useCheckoutGuard";
import style from "./confirma-productos.module.css";
import { useEffect, useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";

const ConfirmaProducts = () => {
  const [runCheckoutSync, setRunCheckoutSync] = useState(false);

  const { dataCart, buyNowProduct } = useTheContext();
  const { formatCurrency, onRouterLink, productsToShow } = useService();

  useCheckoutGuard(CheckoutStep.CONFIRMAR_PRODUCTOS);

  const {
    columns,
    rowsConfirmProducts,
    loadingClearCar,
    loadingCotizacion,
    handleGenerateCotizacion,
    handleShowModalVaciarCarrito,
  } = useConfirmaProductos();

  // -------------------------------
  // MODE (cart / buy_now)
  // -------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mode = localStorage.getItem("checkout_mode");

    if (!mode) {
      if (buyNowProduct === null && dataCart?.length > 0) {
        localStorage.setItem("checkout_mode", "cart");
      } else if (buyNowProduct !== null && dataCart?.length === 0) {
        localStorage.setItem("checkout_mode", "buy_now");
      } else if (buyNowProduct === null && dataCart.length === 0) {
        localStorage.removeItem("checkout_mode");
      }
    }
  }, [dataCart, buyNowProduct]);

  // -------------------------------
  // MANUAL SYNC (vaciar / cambios)
  // -------------------------------
  useEffect(() => {
    if (!runCheckoutSync) return;

    const snapshot = productsToShow?.map((p) => ({
      id: p.idProduct,
      quantity: p.quantity,
      storeId: p.storeId ?? null,
    }));

    if (buyNowProduct != null && dataCart?.length === 0) {
      localStorage.setItem("checkout_mode", "buy_now");
    }

    if (dataCart?.length > 0 && buyNowProduct === null) {
      localStorage.setItem("checkout_mode", "cart");
    }

    if (buyNowProduct === null && dataCart.length === 0) {
      localStorage.removeItem("checkout_mode");
      localStorage.removeItem("checkout_products_snapshot");
    }

    if (snapshot) {
      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(snapshot),
      );
    }

    setRunCheckoutSync(false);
  }, [runCheckoutSync, buyNowProduct, dataCart, productsToShow]);

  // -------------------------------
  // SNAPSHOT INITIAL ONLY
  // -------------------------------
  useEffect(() => {
    if (!productsToShow?.length) return;

    const step = Number(localStorage.getItem("checkout_step"));

    if (step !== CheckoutStep.CONFIRMAR_PRODUCTOS) return;

    const existing = localStorage.getItem("checkout_products_snapshot");

    if (existing) return;

    const snapshot = productsToShow.map((p) => ({
      id: p.idProduct,
      quantity: p.quantity,
      storeId: p.storeId ?? null,
    }));

    localStorage.setItem(
      "checkout_products_snapshot",
      JSON.stringify(snapshot),
    );
  }, [productsToShow]);

  // -------------------------------
  // SUBTOTAL
  // -------------------------------
  const subTotal = useMemo(() => {
    if (!productsToShow) return 0;

    const total = productsToShow
      .filter((item) => item.stock !== 0)
      .map((item) => Number(item.price) * item.quantity)
      .reduce((sum, current) => sum + current, 0);

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [productsToShow]);

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <section>
      {productsToShow && productsToShow.length > 0 ? (
        <>
          <TimelineComponent activeStep={0} />

          <div className="container-tabla w-[90%] mx-auto my-3">
            <div className="header-container-tabla w-full p-2 bg-[#666666] rounded-t-lg">
              <img
                src="/logo_blanco_pcinbox.png"
                width={70}
                height={70}
                style={{ objectFit: "contain", marginLeft: "10px" }}
                loading="lazy"
              />
            </div>

            <div className="content-tabla-confirma-productos">
              <Table
                rowsDataGrid={rowsConfirmProducts}
                columnsDataGrid={columns}
              />
            </div>

            {/* SUBTOTAL */}
            <div className="w-full flex justify-end items-center gap-3 py-2">
              <div className="grid grid-cols-[1fr_2fr_1fr]">
                <img
                  src="compra_segura_gris.png"
                  width="150"
                  height="100"
                  style={{ objectFit: "contain" }}
                />
                <span className="text-end font-bold text-[#666666]">
                  Sub total:
                </span>
                <span className="mx-1">{formatCurrency(subTotal)}</span>
              </div>
            </div>

            {/* BOTONES */}
            <div
              className={`w-full flex justify-end items-center gap-5 mt-4 ${style.containerButtonsActions}`}
            >
              <button
                className="border py-2 px-3 rounded"
                onClick={() => {
                  handleShowModalVaciarCarrito();
                  setRunCheckoutSync(false);
                }}
                disabled={loadingClearCar}
              >
                {loadingClearCar ? (
                  <MdAutorenew className="m-auto animate-spin" />
                ) : (
                  "Vaciar carrito"
                )}
              </button>

              <button
                disabled={loadingCotizacion}
                onClick={handleGenerateCotizacion}
                className="bg-[#666666] py-2 px-4 text-white rounded"
              >
                {loadingCotizacion ? (
                  <MdAutorenew className="m-auto animate-spin" />
                ) : (
                  "Generar cotización"
                )}
              </button>

              <button
                onClick={() => {
                  localStorage.setItem(
                    "checkout_step",
                    String(CheckoutStep.OPCIONES_ENTREGA),
                  );

                  onRouterLink("/opciones-entrega");
                }}
                className="bg-[#B92B3D] py-2 px-5 text-white rounded"
              >
                Siguiente paso
              </button>
            </div>
          </div>
        </>
      ) : (
        <Alert severity="info">Sin contenido disponible</Alert>
      )}
    </section>
  );
};

export default ConfirmaProducts;
