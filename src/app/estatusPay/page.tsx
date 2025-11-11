"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../components/openpay/notFound/NotFound";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import PaySuccess from "../components/openpay/success/PaySuccess";
import { ChargesOpenPay } from "../interfaces/openpay/charges.interface";
import PayPending from "../components/openpay/pending/PayPending";
import Failed from "../components/openpay/failed/Failed";
import { GridLoader } from "react-spinners";

const EstatusPay = () => {
  // ✅ Solo cliente
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { requestPostPagos } = usePasarelaDePagos();

  const [dataPayOpenPay, setDataPayOpenPay] = useState<ChargesOpenPay | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const handleGetDataTransactionOpenPay = async () => {
      try {
        setLoading(true);
        setError(false);

        const resp = await requestPostPagos(
          { idTransaction: id },
          "/openpay/getDataOrderOpenPay"
        );

        if (resp.status === 200) {
          setDataPayOpenPay(resp.data.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    handleGetDataTransactionOpenPay();
  }, [id, requestPostPagos]);

  if (loading) {
    return (
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
    );
  }

  if (error || !dataPayOpenPay) {
    return <NotFound />;
  }

  switch (dataPayOpenPay.status) {
    case "failed":
      return <Failed dataPayOpenPay={dataPayOpenPay} />;
    case "completed":
      return <PaySuccess dataPayOpenPay={dataPayOpenPay} />;
    case "charge_pending":
    case "in_progress":
      return <PayPending dataPayOpenPay={dataPayOpenPay} />;
    default:
      return <NotFound />;
  }
};

export default EstatusPay;
