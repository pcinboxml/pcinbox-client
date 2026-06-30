"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { GridLoader } from "react-spinners";
import NotFound from "../components/openpay/notFound/NotFound";
import PaySuccess from "../components/openpay/success/PaySuccess";
import PayPending from "../components/openpay/pending/PayPending";
import Failed from "../components/openpay/failed/Failed";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import useCheckoutSession from "../hooks/useCheckoutSession";
import { ChargesOpenPay } from "../interfaces/openpay/charges.interface";
import { useSafeSearchParams } from "../hooks/useSafeSearchParams";

// Creamos el componente que maneja la lógica de OpenPay
const EstatusPayContent = () => {
  const { get } = useSafeSearchParams();
  const id = get("id");

  const { requestPostPagos } = usePasarelaDePagos();
  const { completePurchaseCleanup } = useCheckoutSession();

  const [dataPayOpenPay, setDataPayOpenPay] = useState<ChargesOpenPay | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const resp = await requestPostPagos(
          { idTransaction: id },
          "/openpay/getDataOrderOpenPay",
        );

        if (resp.status === 200) {
          const paymentData = resp.data.data.data as ChargesOpenPay;
          setDataPayOpenPay(paymentData);

          const offlineType =
            paymentData?.payment_method?.type ?? paymentData?.method;
          const isOfflinePending =
            (paymentData?.status === "charge_pending" ||
              paymentData?.status === "in_progress") &&
            (offlineType === "store" ||
              offlineType === "bank_transfer" ||
              offlineType === "bank_account" ||
              offlineType === "bank");

          if (isOfflinePending) {
            void completePurchaseCleanup();
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return null; // El fallback de Suspense mostrará el loader

  if (error || !dataPayOpenPay)
    return (
      <NotFound
        title="Transacción No Encontrada"
        description="No pudimos localizar la transacción que buscas. Verifica el ID e
              intenta nuevamente."
      />
    );

  switch (dataPayOpenPay.status) {
    case "failed":
      return <Failed dataPayOpenPay={dataPayOpenPay} />;
    case "completed":
      return <PaySuccess dataPayOpenPay={dataPayOpenPay} />;
    case "charge_pending":
    case "in_progress":
      return <PayPending dataPayOpenPay={dataPayOpenPay} />;
    default:
      return (
        <NotFound
          title="Transacción No Encontrada"
          description="No pudimos localizar la transacción que buscas. Verifica el ID e
              intenta nuevamente."
        />
      );
  }
};

// Cargamos dinámicamente para evitar SSR
const EstatusPayDynamic = dynamic(() => Promise.resolve(EstatusPayContent), {
  ssr: false,
});

// Componente principal que incluye Suspense y loader
const EstatusPay = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <GridLoader color="#bb3d4b" size={20} aria-label="Cargando..." />
        </div>
      }
    >
      <EstatusPayDynamic />
    </Suspense>
  );
};

export default EstatusPay;
