import useService from "@/app/services/useService";
import useCheckoutSession from "@/app/hooks/useCheckoutSession";
import { useEffect, useRef } from "react";
import styles from "./successMP.module.css";

const SuccessMP = ({ dataMpPay }: { dataMpPay: any }) => {
  const { onRouterLink } = useService();
  const { clearCartAfterPaymentConfirmed } = useCheckoutSession();
  const cartClearedRef = useRef(false);
  const orderIdFromMeta =
    dataMpPay?.metadata?.id_order ?? dataMpPay?.metadata?.idOrder ?? "";

  useEffect(() => {
    if (cartClearedRef.current) return;
    cartClearedRef.current = true;
    void clearCartAfterPaymentConfirmed();
  }, [clearCartAfterPaymentConfirmed]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const hasCard =
    dataMpPay?.card && Object.keys(dataMpPay.card).length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <div className={styles.iconPulse} />
            <div className={styles.iconCircle}>
              <svg className="w-8 h-8" viewBox="0 0 52 52">
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  stroke="white"
                  fill="none"
                  strokeWidth="4"
                />
                <path
                  className={styles.checkPath}
                  d="M14 27l8 8 16-16"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1 className={styles.title}>¡Pago Exitoso!</h1>
          <p className={styles.subtitle}>Tu pago se procesó correctamente</p>
        </div>

        <div className={styles.amountBox}>
          <p className={styles.amountLabel}>Monto pagado</p>
          <p className={styles.amountValue}>
            {formatCurrency(dataMpPay?.transaction_amount)}
          </p>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Número de orden</span>
            <span className={styles.detailValue}>#{orderIdFromMeta}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>ID de transacción</span>
            <span className={`${styles.detailValue} ${styles.detailValueMono}`}>
              {dataMpPay?.id}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Fecha y hora</span>
            <span className={styles.detailValue}>
              {new Date(dataMpPay?.date_approved).toLocaleString("es-MX", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Método de pago</span>
            <span className={styles.detailValue}>
              {hasCard
                ? dataMpPay?.card?.tags?.[0] === "credit"
                  ? "Tarjeta de Crédito"
                  : "Tarjeta de Débito"
                : "Pagado con saldo"}
            </span>
          </div>
          {hasCard && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>No. Tarjeta</span>
              <span className={styles.detailValue}>
                {dataMpPay?.card?.last_four_digits}
              </span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estado</span>
            <span className={styles.statusApproved}>Aprobado</span>
          </div>
        </div>

        <div className={styles.badge}>
          <svg
            className={styles.badgeIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Transacción protegida por Mercado Pago</span>
        </div>

        <button
          type="button"
          className={styles.continueBtn}
          onClick={() => {
            onRouterLink(
              `/pay-end?id=${dataMpPay?.id}&idOrder=${orderIdFromMeta}&method_pay=mercadopago&provider=mp`,
            );
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SuccessMP;
