"use client";

import { MdAutorenew } from "react-icons/md";
import Table from "../components/table/Table";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useConfirmaProductos from "./useConfirmaProductos";
import useService from "../services/useService";
import { Alert } from "@mui/material";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import { useCheckoutGuard } from "../hooks/useCheckoutGuard";
import useCheckoutDraft from "../hooks/useCheckoutDraft";
import useStorage from "../services/useStorage";
import style from "./confirma-productos.module.css";
import { useEffect, useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";
import {
  getCheckoutMode,
  getCheckoutStep,
  readCheckoutSnapshot,
  setCheckoutMode,
  setCheckoutStep,
  writeCheckoutSnapshot,
} from "../utils/checkoutStorage";
import {
  evaluateCheckoutProceed,
  hasCartLinesChanged,
  requiresDeliveryReconfiguration,
  toCheckoutSnapshot,
} from "../utils/checkoutValidation";

const ConfirmaProducts = () => {
  const [runCheckoutSync, setRunCheckoutSync] = useState(false);

  const { dataCart, buyNowProduct, setDataModal, hasToken } = useTheContext();
  const { formatCurrency, onRouterLink, productsToShow } = useService();
  const { checkoutMode } = useStorage();
  const { saveDraft } = useCheckoutDraft();

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

    const mode = getCheckoutMode();

    if (!mode) {
      if (buyNowProduct === null && dataCart?.length > 0) {
        setCheckoutMode("cart");
      } else if (buyNowProduct !== null && dataCart?.length === 0) {
        setCheckoutMode("buy_now");
      } else if (buyNowProduct === null && dataCart.length === 0) {
        setCheckoutMode(null);
      }
    }
  }, [dataCart, buyNowProduct]);

  // -------------------------------
  // MANUAL SYNC (vaciar / cambios)
  // -------------------------------
  useEffect(() => {
    if (!runCheckoutSync) return;

    const snapshot = toCheckoutSnapshot(productsToShow ?? []);

    if (buyNowProduct != null && dataCart?.length === 0) {
      setCheckoutMode("buy_now");
    }

    if (dataCart?.length > 0 && buyNowProduct === null) {
      setCheckoutMode("cart");
    }

    if (buyNowProduct === null && dataCart.length === 0) {
      setCheckoutMode(null);
    }

    if (snapshot.length) {
      writeCheckoutSnapshot(snapshot);
    }

    setRunCheckoutSync(false);
  }, [runCheckoutSync, buyNowProduct, dataCart, productsToShow]);

  // -------------------------------
  // SNAPSHOT INITIAL ONLY
  // -------------------------------
  useEffect(() => {
    if (!productsToShow?.length) return;

    const step = getCheckoutStep();

    if (step !== CheckoutStep.CONFIRMAR_PRODUCTOS && step !== null) return;

    const existing = readCheckoutSnapshot();

    if (existing.length) return;

    writeCheckoutSnapshot(toCheckoutSnapshot(productsToShow));
  }, [productsToShow]);

  const deliveryReconfigWarning = useMemo(() => {
    if (!productsToShow?.length) return false;
    const snapshot = readCheckoutSnapshot();
    if (!snapshot.length) return false;
    return (
      hasCartLinesChanged(snapshot, productsToShow) &&
      requiresDeliveryReconfiguration(snapshot, productsToShow)
    );
  }, [productsToShow]);

  const handleNextStep = () => {
    if (!productsToShow?.length) return;

    const previousSnapshot = readCheckoutSnapshot();
    const currentSnapshot = toCheckoutSnapshot(productsToShow);
    const { needsDeliveryWarning, cartChanged } = evaluateCheckoutProceed(
      previousSnapshot,
      productsToShow,
    );

    const goToDelivery = () => {
      writeCheckoutSnapshot(currentSnapshot);
      setCheckoutStep(CheckoutStep.OPCIONES_ENTREGA);

      if (hasToken) {
        void saveDraft({
          checkoutMode: checkoutMode as "cart" | "buy_now",
          checkoutStep: CheckoutStep.OPCIONES_ENTREGA,
          buyNow:
            checkoutMode === "buy_now" && buyNowProduct
              ? {
                  idProduct: buyNowProduct.idProduct,
                  quantity: Number(buyNowProduct.quantity),
                  storeId: buyNowProduct.storeId ?? null,
                }
              : null,
        });
      }

      onRouterLink("/opciones-entrega");
    };

    if (needsDeliveryWarning && cartChanged) {
      setDataModal({
        isOpen: true,
        type: "info",
        title: "Configura tu entrega",
        message:
          "Tu carrito incluye productos de otra sucursal o proveedor. Debes configurar la opción de entrega antes de continuar.",
        showActions: true,
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
          goToDelivery();
        },
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }

    if (cartChanged) {
      writeCheckoutSnapshot(currentSnapshot);
    }

    goToDelivery();
  };

  // -------------------------------
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

          {deliveryReconfigWarning && (
            <Alert severity="warning" className="w-[90%] mx-auto my-3">
              Tu carrito cambió e incluye productos de otra sucursal o proveedor.
              Debes configurar la opción de entrega antes de continuar.
            </Alert>
          )}

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
                onClick={() =>
                  handleGenerateCotizacion(
                    buyNowProduct === null && dataCart?.length > 0
                      ? dataCart
                      : buyNowProduct !== null && dataCart?.length === 0
                        ? buyNowProduct
                        : null,
                  )
                }
                className="bg-[#666666] py-2 px-4 text-white rounded"
              >
                {loadingCotizacion ? (
                  <MdAutorenew className="m-auto animate-spin" />
                ) : (
                  "Generar cotización"
                )}
              </button>

              <button
                onClick={handleNextStep}
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
