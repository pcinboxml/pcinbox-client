"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import style from "./historial-de-compras.module.css";
import useHistorialDeCompras, {
  formatPaymentMethod,
  getOrderTotal,
} from "./useHistorialCompras";
import { Alert } from "@mui/material";
import useService from "../services/useService";
import { MdAutorenew, MdLocationOn } from "react-icons/md";
import { useTheContext } from "../services/globalContext";

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
    setDataHistoryComprasCopy,
    loading,
    errorMsg,
  } = useHistorialDeCompras();
  const { formatCurrency, onRouterLink } = useService();
  const { socketPagos } = useTheContext();

  useEffect(() => {
    initDataHistory();
  }, []);

  useEffect(() => {
    if (!socketPagos.current) return;

    const socket = socketPagos.current;

    const handler = (data: any) => {
      const updateList = (prev: typeof dataHistoryCompras) =>
        prev.map((item) => {
          if (item.idOrder === data.idOrder) {
            return {
              ...item,
              products: item.products?.map((product) => {
                if (product?.idShipment === data?.idShipment) {
                  return { ...product, statusShip: data?.status };
                }
                return product;
              }),
            };
          }
          return item;
        });

      setDataHistoryCompras((prev) => updateList(prev));
      setDataHistoryComprasCopy((prev) => updateList(prev));
    };

    socket.on("changeStatusShipment", handler);
    return () => {
      socket.off("changeStatusShipment", handler);
    };
  }, [socketPagos.current]);

  const getStatusClass = (statusShip?: string) => {
    if (statusShip === "procesando") return style.statusProcessing;
    if (statusShip === "enviado") return style.statusShipped;
    if (statusShip === "cancelado") return style.statusCancelled;
    if (statusShip === "entregado" || statusShip === "disponible") {
      return style.statusDelivered;
    }
    return "";
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
                  onChange={(e) =>
                    updateFilter({ startDate: e.target.value })
                  }
                />
                <span className={style.dateSeparator}>a</span>
                <input
                  type="date"
                  className={style.filterControl}
                  value={dataFilter.endDate || ""}
                  onChange={(e) =>
                    updateFilter({ endDate: e.target.value })
                  }
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
                  updateFilter({
                    searchProduct: e.target.value.trim(),
                  })
                }
              />
            </div>
          </div>

          {hasActiveFilters ? (
            <div className={style.filtersActions}>
              <button
                type="button"
                className={style.clearFiltersBtn}
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            </div>
          ) : null}
        </div>

        {errorMsg ? (
          <Alert severity="error" sx={{ borderRadius: "12px", mb: 2 }}>
            {errorMsg}
          </Alert>
        ) : null}

        {!loading && dataHistoryCompras.length > 0 ? (
          <p className={style.resultsMeta}>
            {dataHistoryCompras.length} compra
            {dataHistoryCompras.length !== 1 ? "s" : ""} encontrada
            {dataHistoryCompras.length !== 1 ? "s" : ""}
          </p>
        ) : null}

        <div className={style.orderList}>
          {loading ? (
            <div className={style.loadingState}>
              <MdAutorenew size={28} className="the-spinner" />
              <span>Cargando compras...</span>
            </div>
          ) : dataHistoryCompras.length > 0 ? (
            dataHistoryCompras.map((historyCompra) => (
              <article className={style.orderCard} key={historyCompra.idOrder}>
                <div className={style.orderHeader}>
                  <div className={style.orderHeaderTop}>
                    <div>
                      <div className={style.orderNumber}>
                        Orden #{historyCompra.idOrder}
                        <span className={style.orderBadge}>
                          {historyCompra.products?.length || 0} producto
                          {(historyCompra.products?.length || 0) !== 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                      <div className={style.orderDate}>
                        Compra realizada el{" "}
                        {new Date(
                          historyCompra?.updatedAt ||
                            historyCompra?.createdAt,
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
                      {(historyCompra?.payment_method == "tarjeta_de_debito" ||
                        historyCompra?.payment_method ==
                          "tarjeta_de_credito") &&
                      historyCompra?.products[0]?.statusShip == "cancelado" ? (
                        <p className={style.refundNote}>
                          Tu reembolso se reflejará de 5 a 10 días hábiles
                        </p>
                      ) : historyCompra?.payment_method ==
                          "transferencia_bancaria" &&
                        historyCompra?.products[0]?.statusShip ==
                          "cancelado" ? (
                        <p className={style.refundNote}>
                          Comunícate con la sucursal{" "}
                          <strong>PCInbox</strong> para solicitar el reembolso
                          de tu pedido.
                        </p>
                      ) : null}

                      {(() => {
                        const estadosNoCancelables = new Set([
                          "entregado",
                          "cancelado",
                          "disponible",
                          "enviado",
                        ]);

                        const tieneEstadoNoCancelable =
                          historyCompra?.products?.some((item) =>
                            estadosNoCancelables.has(item?.statusShip),
                          );

                        if (tieneEstadoNoCancelable) return null;

                        return (
                          <button
                            onClick={() => showModal(historyCompra)}
                            className={style.cancelBtn}
                          >
                            Cancelar compra
                          </button>
                        );
                      })()}

                      <div className={style.orderTotal}>
                        Total: {formatCurrency(getOrderTotal(historyCompra))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={style.orderItems}>
                  {(historyCompra.products || []).map((d, indexD) => {
                    const address =
                      historyCompra.products?.[indexD]?.address;
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
                          <div className={style.itemName}>
                            {d?.name || "Producto"}
                          </div>
                          {d?.description ? (
                            <div className={style.itemVariant}>
                              {d.description}
                            </div>
                          ) : null}

                          {d.statusShip === "disponible" && (
                            <Alert severity="success" sx={{ borderRadius: "10px" }}>
                              Ya puedes recoger este producto en la sucursal
                              PCinBOX-LEON
                            </Alert>
                          )}

                          <div className={style.itemMeta}>
                            {address ? (
                              <div>
                                <strong>Dirección de envío:</strong>
                                <div>{address.street}</div>
                                <div>{address.cologne}</div>
                                <div>
                                  {address.city}, {address.state}{" "}
                                  {address.postalCode}
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
                              {formatCurrency(
                                Number(d.price) * Number(d.quantity),
                              )}
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

                <div className={style.orderActions}>
                  <button
                    type="button"
                    className={style.detailBtn}
                    onClick={() =>
                      onRouterLink(
                        `/detalles-pedido/${historyCompra.idOrder}`,
                      )
                    }
                  >
                    Ver detalles
                  </button>
                </div>
              </article>
            ))
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
          )}
        </div>
      </div>
    </section>
  );
};

export default HistoryShop;
