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
import { ChargesOpenPay } from "../interfaces/openpay/charges.interface";
import SuccessMP from "../components/mercadopago/success/SuccessMP";
import FailedMP from "../components/mercadopago/failed/FailedMP";
import PendingMP from "../components/mercadopago/pending/PendingMP";

// Creamos el componente que maneja la lógica de OpenPay
const EstatusMPContent = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const preferenceId = searchParams.get("preference_id");
  const merchantOrderId = searchParams.get("merchant_order_id");

  const { requestPostPagos } = usePasarelaDePagos();

  const [dataMpPay, setDataMpPay] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!paymentId && !preferenceId && !merchantOrderId) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const resp = await requestPostPagos(
          {
            idUser: localStorage.getItem("idUser"),
            paymentId,
            preferenceId,
          },
          "/mercadopago/getPaymentById",
        );

        const status = resp.status;
        const data = await resp.data;

        if (status == 200) {
          setDataMpPay(data.data.data);
        }
      } catch (error: any) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId, preferenceId, merchantOrderId]);

  if (loading) return null; // El fallback de Suspense mostrará el loader

  if (error || !dataMpPay)
    return (
      <NotFound
        title="Transacción No Encontrada"
        description="No pudimos localizar la transacción que buscas. Verifica el ID e
              intenta nuevamente."
      />
    );

  switch (dataMpPay.status) {
    case "rejected":
      return <FailedMP />;
    case "approved":
      return <SuccessMP dataMpPay={dataMpPay} />;
    case "charge_pending":
    case "in_progress":
    case "pending":
      return <PendingMP />;
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
const EstatusMPDynamic = dynamic(() => Promise.resolve(EstatusMPContent), {
  ssr: false,
});

// Componente principal que incluye Suspense y loader
const EstatusMP = () => {
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
      <EstatusMPDynamic />
    </Suspense>
  );
};

export default EstatusMP;
