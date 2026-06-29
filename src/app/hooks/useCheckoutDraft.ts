"use client";

import { useCallback, useState } from "react";
import useService from "../services/useService";
import ProductI from "../interfaces/products/product.interface";

export type DeliveryGroupSelection = {
  shipping_method: string;
  idAddress?: number | null;
  wantsInsurance?: "si" | "no" | null;
};

export type CheckoutDraft = {
  checkoutMode?: "cart" | "buy_now";
  checkoutStep?: number;
  buyNow?: {
    idProduct: string | number;
    quantity: number;
    storeId?: number | null;
  } | null;
  deliveryGroups?: Record<string, DeliveryGroupSelection>;
  paymentMethod?: {
    id?: number;
    name?: string;
    typeMethod?: string;
    idCard?: string | number | null;
  } | null;
};

export type CheckoutSummary = {
  draft: CheckoutDraft | null;
  products: ProductI[];
  dataPurchase: Record<string, any>;
  subtotal: number;
  shippingTotal: number;
  total: number;
  paymentMethod: CheckoutDraft["paymentMethod"];
};

export default function useCheckoutDraft() {
  const { requestGet, requestPost, requestDelete } = useService();
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const saveDraft = useCallback(
    async (partial: CheckoutDraft) => {
      const resp = await requestPost(partial, "/checkout/saveDraft");
      return resp?.data?.data as CheckoutDraft | undefined;
    },
    [requestPost],
  );

  const getDraft = useCallback(async () => {
    const resp = await requestGet("/checkout/getDraft", true);
    return (resp?.data?.data ?? null) as CheckoutDraft | null;
  }, [requestGet]);

  const clearDraft = useCallback(async () => {
    await requestDelete("/checkout/clearDraft");
    setSummary(null);
  }, [requestDelete]);

  const fetchInsuranceCost = useCallback(
    async (subtotal: number) => {
      const resp = await requestPost({ subtotal }, "/checkout/calculateInsurance");
      return Number(resp?.data?.data?.cost ?? 0);
    },
    [requestPost],
  );

  const fetchZoneShippingCost = useCallback(
    async (idAddress: number) => {
      const resp = await requestPost(
        { idAddress },
        "/checkout/calculateZoneShipping",
      );
      return Number(resp?.data?.data?.cost ?? 0);
    },
    [requestPost],
  );

  const fetchVolumetricQuote = useCallback(
    async (products: ProductI[]) => {
      const resp = await requestPost({ products }, "/checkout/calculateVolumetric");
      return resp?.data?.data as {
        tarifa: { max: number; price: number } | null;
        pesoVolumetrico: number;
        excede: boolean;
        price: number;
      };
    },
    [requestPost],
  );

  const fetchGroupQuote = useCallback(
    async (products: ProductI[], selection: DeliveryGroupSelection) => {
      const resp = await requestPost(
        { products, selection },
        "/checkout/calculateGroupQuote",
      );
      return resp?.data?.data as {
        shippingCost: number;
        insuranceCost: number;
        totalExtra: number;
      };
    },
    [requestPost],
  );

  const fetchSummary = useCallback(
    async (products?: ProductI[]) => {
      setLoadingSummary(true);
      try {
        const resp = await requestPost(
          products ? { products } : {},
          "/checkout/summary",
        );
        if (resp?.status === 200) {
          const data = resp.data.data as CheckoutSummary;
          setSummary(data);
          return data;
        }
      } finally {
        setLoadingSummary(false);
      }
      return null;
    },
    [requestPost],
  );

  const buildPaymentPayload = useCallback(
    async (options?: { requiredFactura?: boolean; products?: ProductI[] }) => {
      const resp = await requestPost(
        {
          requiredFactura: options?.requiredFactura ?? false,
          products: options?.products,
        },
        "/checkout/buildPayment",
      );
      return resp?.status === 200 ? resp.data.data : null;
    },
    [requestPost],
  );

  return {
    summary,
    loadingSummary,
    saveDraft,
    getDraft,
    clearDraft,
    fetchInsuranceCost,
    fetchZoneShippingCost,
    fetchVolumetricQuote,
    fetchGroupQuote,
    fetchSummary,
    buildPaymentPayload,
  };
}
