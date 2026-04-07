"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CheckoutStep,
  checkoutRoutes,
} from "./../components/timeline/checkoutSteps";
import useService from "./../services/useService"; // Para acceder a productsToShow
import { useTheContext } from "../services/globalContext";

export const useCheckoutGuard = (requiredStep: CheckoutStep) => {
  const router = useRouter();
  const pathname = usePathname();
  const { productsToShow } = useService();
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
    if (step > CheckoutStep.OPCIONES_ENTREGA) {
      const snapshot = localStorage.getItem("checkout_products_snapshot");
      if (snapshot && productsToShow) {
        const snapshotProducts = JSON.parse(snapshot) as {
          id: number;
          quantity: number;
          storeId: any;
        }[];
        const currentProducts = productsToShow.map((p) => ({
          id: p.idProduct,
          quantity: p.quantity,
          storeId: p.storeId,
        }));

        const addedOrChanged = currentProducts.some((cp) => {
          const snap = snapshotProducts.find(
            (sp) => Number(sp.id) === Number(cp.id) && sp.storeId == cp.storeId,
          );
          // Si no existe en el snapshot o la cantidad cambió, es considerado agregado o cambiado
          return !snap || snap.quantity !== cp.quantity;
        });
        if (addedOrChanged) {
          // ⚠️ Se agregaron productos, volver a OPCIONES_ENTREGA
          localStorage.setItem(
            "checkout_step",
            String(CheckoutStep.OPCIONES_ENTREGA),
          );

          setDataModal({
            isOpen: true,
            type: "info",
            message:
              "Se detectaron nuevos productos, debes configurar nuevamente la opción de entrega.",
            title: "Información",
            showActions: true,
            onConfirm: () => {
              router.replace(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]);
            },
            onClose: () => {
              router.replace(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]);
            },
          });
          // router.replace(checkoutRoutes[CheckoutStep.OPCIONES_ENTREGA]);

          // alert(
          //   "Se detectaron nuevos productos, debes configurar nuevamente la opción de entrega.",
          // );
        }
      }
    }
  }, [requiredStep, pathname, router, productsToShow]);
};
