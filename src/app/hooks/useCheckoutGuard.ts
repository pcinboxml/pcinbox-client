"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CheckoutStep,
  checkoutRoutes,
} from "./../components/timeline/checkoutSteps";
import useService from "./../services/useService";
import { useTheContext } from "../services/globalContext";

export const useCheckoutGuard = (requiredStep: CheckoutStep) => {
  const router = useRouter();
  const pathname = usePathname();
  const { productsToShow, onRouterLink } = useService();
  const { setDataModal } = useTheContext();

  useEffect(() => {
    const step = Number(localStorage.getItem("checkout_step")) as CheckoutStep;

    // 🚫 No puede acceder a un paso mayor al permitido
    if (step < requiredStep) {
      router.replace(checkoutRoutes[step]);
      return;
    }

    // 🚫 Si intenta volver atrás con URL inválida
    if (pathname !== checkoutRoutes[requiredStep]) {
      router.replace(checkoutRoutes[requiredStep]);
      return;
    }

    // 🚨 Detectar cambios en productos después de configurar la entrega
    if (step > CheckoutStep.OPCIONES_ENTREGA && productsToShow?.length) {
      const snapshotStr = localStorage.getItem("checkout_products_snapshot");
      if (snapshotStr) {
        try {
          const snapshotProducts = JSON.parse(snapshotStr) as {
            id: number;
            quantity: number;
            storeId: number;
          }[];

          const currentProducts = productsToShow.map((p) => ({
            id: Number(p.idProduct),
            quantity: Number(p.quantity),
            storeId: Number(p.storeId),
          }));

          const addedOrChanged = currentProducts.some((cp) => {
            const snap = snapshotProducts.find(
              (sp) => sp.id === cp.id && sp.storeId === cp.storeId,
            );
            return !snap || snap.quantity !== cp.quantity;
          });

          if (addedOrChanged) {
            console.log("Productos agregados o modificados detectados.");

            // Resetear el paso de checkout
            localStorage.setItem(
              "checkout_step",
              String(CheckoutStep.OPCIONES_ENTREGA),
            );

            // Actualizar snapshot
            localStorage.setItem(
              "checkout_products_snapshot",
              JSON.stringify(currentProducts),
            );

            // Mostrar modal primero, redirigir solo cuando se cierre o confirme
            setDataModal({
              isOpen: true,
              type: "info",
              title: "Información",
              message:
                "Se detectaron nuevos productos o cambios, debes configurar nuevamente la opción de entrega.",
              showActions: true,
              onConfirm: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false })); // cerrar modal
                onRouterLink(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]); // luego redirigir
              },
              onClose: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false })); // cerrar modal
                onRouterLink(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]);
              },
            });
          }
        } catch (err) {
          console.error("Error al parsear el snapshot de productos:", err);
        }
      }
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
