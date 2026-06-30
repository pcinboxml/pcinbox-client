"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import { HistoryComprasI } from "../interfaces/compras/historyCompras.interface";
import CancelledCompra from "../components/cancelledCompra/CancelledCompra";
import { Clock } from "lucide-react";
import { MdLocationOn } from "react-icons/md";
import {
  formatPaymentMethodLabel,
  getCancelRefundMessage,
  getCancelSuccessMessage,
} from "../utils/historyPaymentMessages";
import { canViewOrderDetails } from "../utils/orderDetailHelpers";

export { canViewOrderDetails };

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

export const HISTORY_ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 350;

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
  return formatPaymentMethodLabel(method);
}

export function isOrderCancelled(historyCompra: HistoryComprasI): boolean {
  return (
    historyCompra.products?.some((item) => item.statusShip === "cancelado") ??
    false
  );
}

export function canCancelOrder(historyCompra: HistoryComprasI): boolean {
  const blocked = new Set(["entregado", "cancelado", "disponible", "enviado"]);
  return !historyCompra.products?.some((item) =>
    blocked.has(String(item.statusShip ?? "")),
  );
}

const useHistorialDeCompras = () => {
  const [dataFilter, setDataFilter] =
    useState<HistoryFilterState>(DEFAULT_HISTORY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const { requestPost } = useService();
  const [loadingCancelledCompra, setLoadingCancelledCompra] = useState<
    Record<number, boolean>
  >({});
  const { setDataModal } = useTheContext();
  const [dataHistoryCompras, setDataHistoryCompras] = useState<
    HistoryComprasI[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const fetchRequestIdRef = useRef(0);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersRef = useRef(dataFilter);
  filtersRef.current = dataFilter;

  const fetchHistory = useCallback(
    async (
      targetPage: number,
      filters: HistoryFilterState,
      options?: { initial?: boolean },
    ) => {
      const requestId = ++fetchRequestIdRef.current;
      const isInitialLoad = options?.initial === true;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }
      setErrorMsg("");

      try {
        const resp = await requestPost(
          {
            userId: localStorage.getItem("idUser"),
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
            searchProduct: filters.searchProduct.trim(),
            page: targetPage,
            limit: HISTORY_ITEMS_PER_PAGE,
          },
          "/sales/filterSales",
        );

        if (requestId !== fetchRequestIdRef.current) return;

        if (resp.status == 200) {
          const list = resp?.data?.data?.data;
          const pagination = resp?.data?.data?.pagination;
          const safeList = Array.isArray(list) ? list : [];

          setDataHistoryCompras(safeList);
          setPage(pagination?.page ?? targetPage);
          setTotalPages(pagination?.totalPages ?? 0);
          setTotalItems(pagination?.total ?? safeList.length);
        } else {
          setDataHistoryCompras([]);
          setTotalPages(0);
          setTotalItems(0);
          setErrorMsg("No se pudo cargar tu historial de compras.");
        }
      } catch {
        if (requestId !== fetchRequestIdRef.current) return;
        setDataHistoryCompras([]);
        setTotalPages(0);
        setTotalItems(0);
        setErrorMsg("Error al cargar tu historial de compras.");
      } finally {
        if (requestId !== fetchRequestIdRef.current) return;
        if (isInitialLoad) {
          setLoading(false);
        }
        setIsSearching(false);
      }
    },
    [requestPost],
  );

  const initDataHistory = useCallback(() => {
    void fetchHistory(1, filtersRef.current, { initial: true });
  }, [fetchHistory]);

  const applyFilters = useCallback(
    (nextFilters: HistoryFilterState, targetPage = 1) => {
      setDataFilter(nextFilters);
      setPage(targetPage);
      void fetchHistory(targetPage, nextFilters);
    },
    [fetchHistory],
  );

  const updateFilter = (patch: Partial<Omit<HistoryFilterState, "searchProduct">>) => {
    applyFilters({ ...filtersRef.current, ...patch }, 1);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      const nextFilters = {
        ...filtersRef.current,
        searchProduct: value.trim(),
      };
      applyFilters(nextFilters, 1);
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const clearFilters = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setSearchInput("");
    applyFilters(DEFAULT_HISTORY_FILTERS, 1);
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    void fetchHistory(value, filtersRef.current);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hasActiveFilters =
    dataFilter.status !== "allState" ||
    Boolean(dataFilter.startDate) ||
    Boolean(dataFilter.endDate) ||
    Boolean(searchInput.trim());

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
    const horarios: { horarios: { dia: string; hora: string }[]; storeId: string }[] =
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

          <button
            type="button"
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
          </button>
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

      if (!canCancelOrder(historyCompra)) {
        setLoadingCancelledCompra((prev) => ({
          ...prev,
          [historyCompra?.idOrder]: false,
        }));
        setDataModal({
          isOpen: true,
          type: "error",
          title: "No es posible cancelar",
          message: "Esta compra ya no puede cancelarse por su estado de envío.",
          showActions: true,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }

      const resp = await requestPost(
        { idOrder: historyCompra.idOrder },
        "/sales/cancelOrder",
      );

      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: false,
      }));

      if (resp.status == 200) {
        setDataHistoryCompras((prev) =>
          prev.map((item) => {
            if (Number(item.idOrder) === Number(historyCompra.idOrder)) {
              return {
                ...item,
                products: item.products?.map((product) => ({
                  ...product,
                  statusShip: "cancelado",
                })),
              };
            }
            return item;
          }),
        );

        setDataModal({
          isOpen: true,
          type: "success",
          message: getCancelSuccessMessage(
            historyCompra.idOrder,
            historyCompra.payment_method,
          ),
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
    isSearching,
    errorMsg,
    loadingCancelledCompra,
    showModal,
    updateFilter,
    searchInput,
    handleSearchInputChange,
    clearFilters,
    hasActiveFilters,
    dataFilter,
    showUbicationStore,
    setDataHistoryCompras,
    initDataHistory,
    page,
    totalPages,
    totalItems,
    handleChangePage,
    getCancelRefundMessage,
    canCancelOrder,
    isOrderCancelled,
  };
};

export default useHistorialDeCompras;
