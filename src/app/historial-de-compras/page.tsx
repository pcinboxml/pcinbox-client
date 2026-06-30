"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import style from "./historial-de-compras.module.css";
import useHistorialDeCompras, {
  canCancelOrder,
  canViewOrderDetails,
  formatPaymentMethod,
  getOrderTotal,
  isOrderCancelled,
} from "./useHistorialCompras";
import { Alert } from "@mui/material";
import useService from "../services/useService";
import { MdAutorenew, MdLocationOn } from "react-icons/md";
import { useTheContext } from "../services/globalContext";
import PaginationComponent from "../components/pagination/PaginationComponent";

function HistoryPaginationBar({
  count,
  page,
  onChange,
}: {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}) {
  if (count <= 1) return null;

  return (
    <div className={style.paginationBar}>
      <PaginationComponent count={count} page={page} onChange={onChange} />
    </div>
  );
}

const HistoryShop = () => {
  const {
    dataHistoryCompras,
    initDataHistory,
    dataFilter,
    showModal,
    showUbicationStore,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    setDataHistoryCompras,
    loading,
    errorMsg,
    page,
    totalPages,
    totalItems,
    handleChangePage,
    getCancelRefundMessage,
  } = useHistorialDeCompras();
  const { formatCurrency, onRouterLink } = useService();
  const { socketPagos, hasToken } = useTheContext();

  useEffect(() => {
    if (hasToken) {
      initDataHistory();
    }
  }, [hasToken]);

  useEffect(() => {
    if (!socketPagos.current) return;

    const socket = socketPagos.current;

    const handler = (data: any) => {
      setDataHistoryCompras((prev) =>
        prev.map((item) => {
          if (Number(item.idOrder) !== Number(data.idOrder)) return item;

          return {
            ...item,
            products: item.products?.map((product) => {
              if (Number(product?.idShipment) === Number(data?.idShipment)) {
                return { ...product, statusShip: data?.status };
              }
              return product;
            }),
          };
        }),
      );
    };

    socket.on("changeStatusShipment", handler);
    return () => {
      socket.off("changeStatusShipment", handler);
    };
  }, [socketPagos.current, setDataHistoryCompras]);

  const getStatusClass = (statusShip?: string) => {
    if (statusShip === "procesando") return style.statusProcessing;
    if (statusShip === "enviado") return style.statusShipped;
    if (statusShip === "cancelado") return style.statusCancelled;
    if (statusShip === "entregado" || statusShip === "disponible") {
      return style.statusDelivered;
    }
    return "";
  };

  if (hasToken === null || hasToken === false) {
    return (
      <div className={style.loadingState}>
        <MdAutorenew size={28} className="the-spinner" />
        <span>Verificando sesión...</span>
      </div>
    );
  }

  const renderOrderCard = (historyCompra: (typeof dataHistoryCompras)[0]) => {
    const cancelled = isOrderCancelled(historyCompra);

    return (
      <article className={style.orderCard} key={historyCompra.idOrder}>
        <div className={style.orderHeader}>
          <div className={style.orderHeaderTop}>
            <div>
              <div className={style.orderNumber}>
                Orden #{historyCompra.idOrder}
                <span className={style.orderBadge}>
                  {historyCompra.products?.length || 0} producto
                  {(historyCompra.products?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={style.orderDate}>
                Compra realizada el{" "}
                {new Date(
                  historyCompra?.updatedAt || historyCompra?.createdAt,
                ).toLocaleString("es-MX", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <div className={style.paymentBadge}>
                {formatPaymentMethod(historyCompra.payment_method)}
              </div>
            </div>

            <div className={style.contentHeaderCard}>
              {cancelled ? (
                <p className={style.refundNote}>
                  {getCancelRefundMessage(historyCompra.payment_method)}
                </p>
              ) : canCancelOrder(historyCompra) ? (
                <button
                  type="button"
                  onClick={() => showModal(historyCompra)}
                  className={style.cancelBtn}
                >
                  Cancelar compra
                </button>
              ) : null}

              <div className={style.orderTotal}>
                Total: {formatCurrency(getOrderTotal(historyCompra))}
              </div>
            </div>
          </div>
        </div>

        <div className={style.orderItems}>
          {(historyCompra.products || []).map((d, indexD) => {
            const address = historyCompra.products?.[indexD]?.address;
            const imageSrc =
              d?.image_url && Array.isArray(d.image_url)
                ? d.image_url[0]
                : typeof d?.image_url === "string"
                  ? d.image_url
                  : "/user.jpeg";

            return (
              <div
                className={style.item}
                key={`${historyCompra.idOrder}-${indexD}`}
              >
                <img
                  src={imageSrc}
                  alt={d?.name || "Producto"}
                  className={style.itemImage}
                  loading="lazy"
                />
                <div className={style.itemDetails}>
                  <div className={style.itemName}>{d?.name || "Producto"}</div>
                  {d?.description ? (
                    <div className={style.itemVariant}>{d.description}</div>
                  ) : null}

                  {d.statusShip === "disponible" && (
                    <Alert severity="success" sx={{ borderRadius: "10px" }}>
                      Ya puedes recoger este producto en la sucursal PCinBOX-LEON
                    </Alert>
                  )}

                  <div className={style.itemMeta}>
                    {address ? (
                      <div>
                        <strong>Dirección de envío:</strong>
                        <div>{address.street}</div>
                        <div>{address.cologne}</div>
                        <div>
                          {address.city}, {address.state} {address.postalCode}
                        </div>
                        <div>{address.country}</div>
                      </div>
                    ) : (
                      <span className={style.pickupRow}>
                        Recoger en Sucursal PCinBOX-LEÓN
                        <button
                          type="button"
                          onClick={() => {
                            showUbicationStore(String("PCinBOX-León"));
                          }}
                          className={style.locationLink}
                        >
                          <MdLocationOn size={18} />
                          Ver ubicación
                        </button>
                      </span>
                    )}
                  </div>

                  <div className={style.itemMeta}>
                    <div className={style.itemQuantity}>
                      Cantidad: {d.quantity}
                    </div>
                    <div className={style.itemPrice}>
                      {formatCurrency(Number(d.price) * Number(d.quantity))}
                    </div>
                  </div>

                  <div className={style.itemMeta}>
                    <span
                      className={`${style.status} ${getStatusClass(d.statusShip)}`}
                    >
                      {(d?.statusShip || "procesando").toUpperCase()}
                    </span>
                  </div>

                  {d.status === "paid" &&
                    (d.shipping_method === "paqueteexpress" ||
                      d.shipping_method === "estafeta") &&
                    d.trackingNumber && (
                      <div className={style.trackingRow}>
                        <span className={style.trackingLabel}>
                          {d.shipping_method === "estafeta"
                            ? "Estafeta"
                            : "Paquete Express"}
                        </span>
                        <span className={style.trackingNumber}>
                          {d.trackingNumber}
                        </span>
                        <a
                          href={
                            d.shipping_method === "estafeta"
                              ? "https://www.estafeta.com/rastrear-envio?rastreo=true"
                              : "https://drenvio.com/es-MX/paqueterias/rastreo/paquetexpress"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={style.trackingLink}
                        >
                          Dar seguimiento →
                        </a>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {canViewOrderDetails(historyCompra) ? (
          <div className={style.orderActions}>
            <button
              type="button"
              className={style.detailBtn}
              onClick={() =>
                onRouterLink(`/detalles-pedido/${historyCompra.idOrder}`)
              }
            >
              Ver detalles
            </button>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <section className={style.section}>
      <div className={style.sidebarWrap}>
        <SidebarMiCuenta />
      </div>

      <div className={style.content}>
        <header className={style.pageHeader}>
          <h1 className={style.pageTitle}>Mis compras</h1>
          <p className={style.pageSubtitle}>
            Consulta el historial de tus pedidos y su estado de envío
          </p>
        </header>

        <div className={style.filtersCard}>
          <div className={style.filtersHeader}>
            <h2 className={style.filtersTitle}>Búsqueda avanzada</h2>
            {hasActiveFilters ? (
              <button
                type="button"
                className={style.clearFiltersBtn}
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>

          <div className={style.filtersGrid}>
            <div className={style.filterGroup}>
              <label htmlFor="state" className={style.filterLabel}>
                Estado del pedido
              </label>
              <select
                className={style.filterControl}
                id="state"
                value={dataFilter.status}
                onChange={(event) => {
                  updateFilter({ status: event.target.value });
                }}
              >
                <option value="allState">Todos los estados</option>
                <option value="entregado">Entregado</option>
                <option value="enviado">Enviado</option>
                <option value="procesando">Procesando</option>
                <option value="cancelado">Cancelado</option>
                <option value="disponible">Disponible</option>
              </select>
            </div>

            <div className={style.filterGroup}>
              <span className={style.filterLabel}>Período</span>
              <div className={style.dateRange}>
                <input
                  type="date"
                  className={style.filterControl}
                  value={dataFilter.startDate || ""}
                  onChange={(e) => updateFilter({ startDate: e.target.value })}
                />
                <span className={style.dateSeparator}>a</span>
                <input
                  type="date"
                  className={style.filterControl}
                  value={dataFilter.endDate || ""}
                  onChange={(e) => updateFilter({ endDate: e.target.value })}
                />
              </div>
            </div>

            <div className={`${style.filterGroup} ${style.filterGroupSearch}`}>
              <label htmlFor="searchProduct" className={style.filterLabel}>
                Buscar producto
              </label>
              <input
                id="searchProduct"
                type="text"
                className={style.filterControl}
                placeholder="Nombre del producto..."
                value={dataFilter.searchProduct}
                onChange={(e) =>
                  updateFilter({ searchProduct: e.target.value.trim() })
                }
              />
            </div>
          </div>
        </div>

        {errorMsg ? (
          <Alert severity="error" sx={{ borderRadius: "12px", mb: 2 }}>
            {errorMsg}
          </Alert>
        ) : null}

        {!loading && totalItems > 0 ? (
          <p className={style.resultsMeta}>
            Mostrando página {page} de {totalPages} · {totalItems} compra
            {totalItems !== 1 ? "s" : ""} en total
          </p>
        ) : null}

        <HistoryPaginationBar
          count={totalPages}
          page={page}
          onChange={handleChangePage}
        />

        <div className={style.orderList}>
          {loading ? (
            <div className={style.loadingState}>
              <MdAutorenew size={28} className="the-spinner" />
              <span>Cargando compras...</span>
            </div>
          ) : dataHistoryCompras.length > 0 ? (
            dataHistoryCompras.map(renderOrderCard)
          ) : (
            <div className={style.emptyState}>
              <p className={style.emptyStateTitle}>
                No hay compras para mostrar
              </p>
              <p>
                {hasActiveFilters
                  ? "Prueba con otros filtros o limpia la búsqueda."
                  : "Realiza tu primera compra en PCInbox."}
              </p>
            </div>
          )}
        </div>

        <HistoryPaginationBar
          count={totalPages}
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </section>
  );
};

export default HistoryShop;
