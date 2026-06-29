"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CheckoutStep,
  checkoutRoutes,
} from "./../components/timeline/checkoutSteps";
import useService from "./../services/useService";
import { useTheContext } from "../services/globalContext";
import {
  getCheckoutMode,
  getCheckoutStep,
  readCheckoutSnapshot,
  setCheckoutStep,
  writeCheckoutSnapshot,
} from "../utils/checkoutStorage";
import {
  hasCartLinesChanged,
  requiresDeliveryReconfiguration,
  toCheckoutSnapshot,
} from "../utils/checkoutValidation";

export const useCheckoutGuard = (requiredStep: CheckoutStep) => {
  const router = useRouter();
  const pathname = usePathname();
  const { productsToShow, onRouterLink } = useService();
  const { setDataModal } = useTheContext();

  useEffect(() => {
    const step = getCheckoutStep() ?? CheckoutStep.CONFIRMAR_PRODUCTOS;

    if (step < requiredStep) {
      router.replace(checkoutRoutes[step]);
      return;
    }

    if (pathname !== checkoutRoutes[requiredStep]) {
      router.replace(checkoutRoutes[requiredStep]);
      return;
    }

    if (
      step <= CheckoutStep.OPCIONES_ENTREGA ||
      !productsToShow?.length ||
      getCheckoutMode() !== "cart"
    ) {
      return;
    }

    const snapshotRaw = readCheckoutSnapshot();
    let snapshotProducts = snapshotRaw;

    if (!snapshotProducts.length) {
      snapshotProducts = [];
    }

    const currentSnapshot = toCheckoutSnapshot(productsToShow);

    if (!snapshotProducts.length) {
      writeCheckoutSnapshot(currentSnapshot);
      return;
    }

    const cartChanged = hasCartLinesChanged(snapshotProducts, productsToShow);
    const needsDeliveryReconfig = requiresDeliveryReconfiguration(
      snapshotProducts,
      productsToShow,
    );

    if (!cartChanged) {
      writeCheckoutSnapshot(currentSnapshot);
      return;
    }

    writeCheckoutSnapshot(currentSnapshot);

    if (!needsDeliveryReconfig) {
      return;
    }

    setCheckoutStep(CheckoutStep.OPCIONES_ENTREGA);

    setDataModal({
      isOpen: true,
      type: "info",
      title: "Información",
      message:
        "Agregaste productos de otra sucursal o proveedor. Debes configurar nuevamente la opción de entrega.",
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
  }, [
    requiredStep,
    pathname,
    router,
    productsToShow,
    onRouterLink,
    setDataModal,
  ]);
};
