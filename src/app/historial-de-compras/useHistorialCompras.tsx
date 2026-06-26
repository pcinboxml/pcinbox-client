"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { HistoryComprasI } from "../interfaces/compras/historyCompras.interface";
import CancelledCompra from "../components/cancelledCompra/CancelledCompra";
import { Clock } from "lucide-react";
import { MdLocationOn } from "react-icons/md";

const UNPAID_ORDER_STATUSES = new Set(["payment_pending", "pending"]);
const UNPAID_PAY_METHODS = new Set(["esperando"]);

export type HistoryFilterState = {
  status: string;
  startDate: string;
  endDate: string;
  searchProduct: string;
};

const DEFAULT_HISTORY_FILTERS: HistoryFilterState = {
  status: "allState",
  startDate: "",
  endDate: "",
  searchProduct: "",
};

function isPaidHistoryOrder(item: HistoryComprasI): boolean {
  const payMethod = (item.payment_method || "").toLowerCase();
  const orderStatus = (item.orderStatus || "").toLowerCase();

  if (UNPAID_PAY_METHODS.has(payMethod)) return false;
  if (UNPAID_ORDER_STATUSES.has(orderStatus)) return false;

  return true;
}

export function getOrderTotal(historyCompra: HistoryComprasI): number {
  if (Number.isFinite(Number(historyCompra.totalSales))) {
    return Number(historyCompra.totalSales);
  }

  return (historyCompra.products || []).reduce(
    (sum, product) =>
      sum + Number(product.price || 0) * Number(product.quantity || 1),
    0,
  );
}

export function formatPaymentMethod(method?: string): string {
  const labels: Record<string, string> = {
    tarjeta_de_credito: "Tarjeta de crédito",
    tarjeta_de_debito: "Tarjeta de débito",
    transferencia_bancaria: "Transferencia bancaria",
    mercadopago: "Mercado Pago",
    openpay: "OpenPay",
    efectivo: "Efectivo",
  };

  if (!method) return "Pago registrado";
  return labels[method] ?? method.replace(/_/g, " ");
}

const useHistorialDeCompras = () => {
  const [dataFilter, setDataFilter] =
    useState<HistoryFilterState>(DEFAULT_HISTORY_FILTERS);
  const { requestPost } = useService();
  const [loadingCancelledCompra, setLoadingCancelledCompra] = useState<
    Record<number, boolean>
  >({});
  const { setDataModal } = useTheContext();
  const { requestPostPagos } = usePasarelaDePagos();
  const [dataHistoryCompras, setDataHistoryCompras] = useState<
    HistoryComprasI[]
  >([]);
  const [dataHistoryComprasCopy, setDataHistoryComprasCopy] = useState<
    HistoryComprasI[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyClientFilters = useCallback(
    (source: HistoryComprasI[], filters: HistoryFilterState) => {
      return source.filter((item) => {
        const statusMatch =
          filters.status && filters.status !== "allState"
            ? item.products.some((p) => p.statusShip === filters.status)
            : true;

        const dateMatch =
          filters.startDate && filters.endDate
            ? (() => {
                const itemDate = new Date(item.createdAt);
                const start = new Date(filters.startDate);
                const end = new Date(filters.endDate);

                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                itemDate.setHours(0, 0, 0, 0);

                return itemDate >= start && itemDate <= end;
              })()
            : true;

        const searchTextMatch = filters.searchProduct
          ? item.products.some((p) =>
              p.name
                .toLowerCase()
                .includes(filters.searchProduct.toLowerCase()),
            )
          : true;

        return statusMatch && dateMatch && searchTextMatch;
      });
    },
    [],
  );

  useEffect(() => {
    setDataHistoryCompras(applyClientFilters(dataHistoryComprasCopy, dataFilter));
  }, [dataFilter, dataHistoryComprasCopy, applyClientFilters]);

  const initDataHistory = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const resp = await requestPost(
        {
          userId: localStorage.getItem("idUser"),
          status: "allState",
        },
        "/sales/filterSales",
      );

      if (resp.status == 200) {
        const list = resp?.data?.data?.data;
        const safeList = (Array.isArray(list) ? list : []).filter(
          isPaidHistoryOrder,
        );
        setDataHistoryComprasCopy(safeList);
        setDataHistoryCompras(applyClientFilters(safeList, dataFilter));
      } else {
        setDataHistoryComprasCopy([]);
        setDataHistoryCompras([]);
        setErrorMsg("No se pudo cargar tu historial de compras.");
      }
    } catch {
      setDataHistoryComprasCopy([]);
      setDataHistoryCompras([]);
      setErrorMsg("Error al cargar tu historial de compras.");
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (patch: Partial<HistoryFilterState>) => {
    const nextFilters = { ...dataFilter, ...patch };

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const isSearchOnly =
      Object.keys(patch).length === 1 && "searchProduct" in patch;

    if (isSearchOnly) {
      searchDebounceRef.current = setTimeout(() => {
        setDataFilter(nextFilters);
      }, 350);
      return;
    }

    setDataFilter(nextFilters);
  };

  const clearFilters = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setDataFilter(DEFAULT_HISTORY_FILTERS);
  };

  const hasActiveFilters =
    dataFilter.status !== "allState" ||
    Boolean(dataFilter.startDate) ||
    Boolean(dataFilter.endDate) ||
    Boolean(dataFilter.searchProduct);

  const showModal = (historyCompra: HistoryComprasI) => {
    setDataModal({
      isOpen: true,
      message: (
        <CancelledCompra
          handleCancelPedido={handleCancelPedido}
          historyCompra={historyCompra}
        />
      ),
      type: "info",
      title: "Cancelar compra",
      showActions: false,
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const showUbicationStore = (storeId: string): void => {
    let horarios: { horarios: { dia: any; hora: any }[]; storeId: string }[] =
      [
        {
          storeId: "PCinBOX-SFD",
          horarios: [
            { dia: "Lunes a Viernes", hora: "9:00am a 6:30pm" },
            { dia: "Sábado", hora: "9:00am a 2:30pm" },
            { dia: "Domingo", hora: "Cerrado" },
          ],
        },
        {
          storeId: "PCinBOX-AG2D",
          horarios: [
            { dia: "Lunes a Viernes", hora: "9:00am a 7:00pm" },
            { dia: "Sábado", hora: "9:00am a 3:00pm" },
            { dia: "Domingo", hora: "Cerrado" },
          ],
        },
        {
          storeId: "PCinBOX-León",
          horarios: [
            { dia: "Lunes a Viernes", hora: "10:30am a 7:00pm" },
            { dia: "Sábado", hora: "10:30am a 3:00pm" },
            { dia: "Domingo", hora: "Cerrado" },
          ],
        },
        {
          storeId: "PCinBOX-AGD",
          horarios: [
            { dia: "Lunes a Viernes", hora: "9:00am a 6:30pm" },
            { dia: "Sábado", hora: "9:00am a 2:30pm" },
            { dia: "Domingo", hora: "Cerrado" },
          ],
        },
      ];

    setDataModal({
      isOpen: true,
      type: "info",
      message: (
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Ubicación
            </p>
            <p className="text-slate-700 font-medium leading-relaxed text-sm">
              {(() => {
                switch (storeId) {
                  case "PCinBOX-SFD":
                    return "Carretera Panamericana #708 Condominio Santa Fe Tecno Park Jesús María, Ciudad: Aguascalientes.";
                  case "PCinBOX-AG2D":
                    return "Av. Convención de 1914 Norte #1405 Col. Arboledas, Ciudad: Aguascalientes.";
                  case "PCinBOX-AGD":
                    return "Av. Convención de 1914 Norte #201 Col. Gremial CP:20030 Aguascalientes Aguascalientes.";
                  case "PCinBOX-León":
                    return "Blvd. Juan Alonso de Torres Pte. No. 1917 Local 1 Colonia Unión Comunitaria de León C.P 37239 Ciudad de León, Guanajuato, México";
                  default:
                    return "Tienda desconocida";
                }
              })()}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horarios
            </p>
            <div className="space-y-2">
              {(
                horarios.find((itemF) => itemF.storeId === storeId)?.horarios ||
                []
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {item.dia}
                  </span>
                  <span
                    className={`text-sm font-semibold ${item.hora === "Cerrado" ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {item.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <a
            onClick={() => {
              let url = "";
              switch (storeId) {
                case "PCinBOX-SFD":
                  url =
                    "https://www.google.com/maps/place/CEDIS+DICOTECH/@22.0252284,-102.2861256,17z";
                  break;
                case "PCinBOX-León":
                  url =
                    "https://www.google.com/maps/place/pcinbox/@21.145074,-101.649971,17z";
                  break;
                case "PCinBOX-AG2D":
                  url =
                    "https://www.google.com/maps/place/Zegucom+c%C3%B3mputo+AGUASCALIENTES/@21.8984101,-102.3046535,17z";
                  break;
                default:
                  url = "";
              }
              if (url) window.open(url, "_blank");
            }}
            className="w-full mt-6 bg-slate-900 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <MdLocationOn className="w-4 h-4" />
            Ver en Google Maps
          </a>
        </div>
      ),
      title: "",
      showActions: true,
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleCancelPedido = async (historyCompra: HistoryComprasI) => {
    try {
      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: true,
      }));

      const estadosNoCancelables = new Set([
        "entregado",
        "cancelado",
        "disponible",
        "enviado",
      ]);

      const tieneEstadoNoCancelable = historyCompra?.products?.some((item) =>
        estadosNoCancelables.has(item?.statusShip),
      );

      if (tieneEstadoNoCancelable) {
        setLoadingCancelledCompra((prev) => ({
          ...prev,
          [historyCompra?.idOrder]: false,
        }));
        setDataModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "No es posible cancelar la compra",
          showActions: true,
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      const resp = await requestPostPagos(
        { idOrder: historyCompra.idOrder },
        "/orders/cancelOrder",
      );

      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: false,
      }));

      if (resp.status == 200) {
        const data = resp.data;

        const updateOrder = (list: HistoryComprasI[]) =>
          list.map((item) => {
            if (Number(item.idOrder) === Number(data.data.data.idOrder)) {
              return {
                ...item,
                products: item.products?.map((product) => ({
                  ...product,
                  statusShip: "cancelado",
                })),
              };
            }
            return item;
          });

        setDataHistoryComprasCopy((prev) => updateOrder(prev));
        setDataHistoryCompras((prev) => updateOrder(prev));

        setDataModal({
          isOpen: true,
          type: "success",
          message: `Compra ${historyCompra.idOrder} cancelada correctamente.`,
          title: "Compra cancelada",
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error: any) {
      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: false,
      }));
      setDataModal({
        isOpen: true,
        type: "error",
        title: "Error al cancelar",
        message:
          error?.response?.data?.message ||
          "No se pudo cancelar la compra. Intenta de nuevo.",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  return {
    dataHistoryCompras,
    loading,
    errorMsg,
    loadingCancelledCompra,
    showModal,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    dataFilter,
    showUbicationStore,
    setDataHistoryCompras,
    setDataHistoryComprasCopy,
    initDataHistory,
  };
};

export default useHistorialDeCompras;
