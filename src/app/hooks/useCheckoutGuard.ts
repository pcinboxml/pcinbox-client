"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CheckoutStep,
  checkoutRoutes,
} from "./../components/timeline/checkoutSteps";
import useService from "./../services/useService";
import { useTheContext } from "../services/globalContext";

type ProductSnapshot = {
  id: number;
  quantity: number;
  storeId: number | null;
};

export const useCheckoutGuard = (requiredStep: CheckoutStep) => {
  const router = useRouter();
  const pathname = usePathname();
  const { productsToShow, onRouterLink } = useService();
  const { setDataModal } = useTheContext();

  const normalizeStoreId = (id: any): number | null => {
    if (id === null || id === undefined || id === "null") return null;
    const num = Number(id);
    return isNaN(num) ? null : num;
  };

  const normalizeProducts = (products: any[]): ProductSnapshot[] => {
    return (products || []).map((p) => ({
      id: Number(p.idProduct),
      quantity: Number(p.quantity),
      storeId: normalizeStoreId(p.storeId),
    }));
  };

  const createKey = (p: ProductSnapshot) => `${p.id}-${p.storeId ?? "null"}`;

  useEffect(() => {
    const step = Number(localStorage.getItem("checkout_step")) as CheckoutStep;

    // 🚫 No puede acceder a un paso mayor al permitido
    if (step < requiredStep) {
      router.replace(checkoutRoutes[step]);
      return;
    }

    // 🚫 URL inválida
    if (pathname !== checkoutRoutes[requiredStep]) {
      router.replace(checkoutRoutes[requiredStep]);
      return;
    }

    // 🚨 SOLO aplica a carrito y después de entrega
    if (
      step <= CheckoutStep.OPCIONES_ENTREGA ||
      !productsToShow?.length ||
      localStorage.getItem("checkout_mode") !== "cart"
    ) {
      return;
    }

    const snapshotStr = localStorage.getItem("checkout_products_snapshot");

    const currentProducts = normalizeProducts(productsToShow);

    // 🟢 CASO 1: no existe snapshot → lo creamos y salimos
    if (!snapshotStr) {
      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(currentProducts),
      );
      return;
    }

    let snapshotProducts: ProductSnapshot[];

    try {
      snapshotProducts = JSON.parse(snapshotStr);
    } catch {
      snapshotProducts = [];
    }

    // 🟡 CASO 2: snapshot inválido o vacío → lo re-creamos
    if (!snapshotProducts.length) {
      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(currentProducts),
      );
      return;
    }

    // 🔥 MAPA para comparación estable (sin .find)
    const snapshotMap = new Map<string, ProductSnapshot>();

    snapshotProducts.forEach((p) => {
      snapshotMap.set(createKey(p), p);
    });

    const hasChanges = currentProducts.some((cp) => {
      const snap = snapshotMap.get(createKey(cp));

      if (!snap) return true; // producto nuevo/eliminado

      return snap.quantity !== cp.quantity;
    });

    if (hasChanges) {
      localStorage.setItem(
        "checkout_step",
        String(CheckoutStep.OPCIONES_ENTREGA),
      );

      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(currentProducts),
      );

      setDataModal({
        isOpen: true,
        type: "info",
        title: "Información",
        message:
          "Se detectaron cambios en tu carrito. Debes configurar nuevamente la opción de entrega.",
        showActions: true,
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
          onRouterLink(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]);
        },
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
          onRouterLink(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]);
        },
      });
    } else {
      // 🟢 opcional: mantener snapshot sincronizado
      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(currentProducts),
      );
    }
  }, [
    requiredStep,
    pathname,
    router,
    productsToShow,
    onRouterLink,
    setDataModal,
  ]);
};
