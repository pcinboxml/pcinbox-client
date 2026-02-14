"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import style from "./historial-de-compras.module.css";
import useHistorialDeCompras from "./useHistorialCompras";
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
    setDataFilter,

    setDataHistoryCompras,
    // handleOnPeriodo,
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
      setDataHistoryCompras((prev) => {
        return prev.map((item) => {
          if (item.idOrder === data.idOrder) {
            return {
              ...item,
              products: item.products?.map((product) => {
                if (product?.idShipment === data?.idShipment) {
                  return {
                    ...product,
                    statusShip: data?.status,
                  };
                } else {
                  return product;
                }
              }),
            };
          }
          return item;
        });
      });
    };

    socket.on("changeStatusShipment", handler);

    return () => {
      socket.off("changeStatusShipment", handler);
    };
  }, [socketPagos.current]);
  return (
    <section className={style.section}>
      <div className="w-[280px] border ">
        <SidebarMiCuenta />
      </div>
      <div className="w-[80%] border p-3">
        <span
          className="text-[#bb3d4b]"
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "10px",
            marginTop: "10px",
            display: "block",
          }}
        >
          Mis compras
        </span>

        <div className="w-full flex justify-center items-center gap-2 flex-wrap">
          <div className="flex  items-center">
            <label htmlFor="state" className="flex shrink-0 text-[#808080]">
              Estado del pedido:
            </label>
            <select
              className="form-select"
              id="state"
              defaultValue={"allState"}
              onChange={(event) => {
                setDataFilter((prev) => ({
                  ...prev,
                  status: event.target.value,
                }));
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

          <div className="flex gap-2 items-center">
            <label className="text-[#808080]">Período:</label>

            <input
              type="date"
              className="form-control"
              value={dataFilter.startDate || ""}
              onChange={(e) =>
                setDataFilter((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
            />

            <span className="text-[#808080]">a</span>

            <input
              type="date"
              className="form-control"
              value={dataFilter.endDate || ""}
              onChange={(e) =>
                setDataFilter((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-1 items-center">
            <label htmlFor="state" className="flex shrink-0 text-[#808080]">
              Buscar producto:
            </label>
            <input
              type="text"
              className="form-control"
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                setDataFilter((prev) => ({
                  ...prev,
                  searchProduct: (e.target as HTMLInputElement).value.trim(),
                }))
              }
            />
          </div>
        </div>

        <div className="my-5 flex flex-col">
          {dataHistoryCompras && dataHistoryCompras.length > 0 ? (
            dataHistoryCompras.map((historyCompra, index) => {
              console.log(historyCompra);
              return (
                <div
                  className={`${style.orderCard} my-3`}
                  data-status="delivered"
                  key={index}
                >
                  <div className={style.orderHeader}>
                    <div className={style.orderInfo + " w-full"}>
                      <div
                        className={style.orderNumber + " flex justify-between"}
                      >
                        <span className="shrink-0 p-1">
                          {" "}
                          No. Orden #{historyCompra.idOrder}
                        </span>
                        <div className="w-[80%] p-1 flex justify-end gap-3 items-center">
                          <div>
                            {(historyCompra?.payment_method ==
                              "tarjeta_de_debito" ||
                              historyCompra?.payment_method ==
                                "tarjeta_de_credito") &&
                            historyCompra?.products[0]?.statusShip ==
                              "cancelado" ? (
                              <p>
                                Tu reembolso se reflejara de 5 a 10 días habiles
                              </p>
                            ) : historyCompra?.payment_method ==
                                "transferencia_bancaria" &&
                              historyCompra?.products[0]?.statusShip ==
                                "cancelado" ? (
                              <p className="text-[16px]">
                                Comunicate con la sucursal{" "}
                                <span className="font-bold">PCInbox</span> para
                                solicitar reembolso de tu pedido. <br />
                              </p>
                            ) : null}
                          </div>
                          {(() => {
                            const estadosNoCancelables = new Set([
                              "entregado",
                              "cancelado",
                              "disponible",
                            ]);

                            const tieneEstadoNoCancelable =
                              historyCompra?.products?.some((item) =>
                                estadosNoCancelables.has(item?.statusShip),
                              );

                            if (!tieneEstadoNoCancelable) {
                              return (
                                <button
                                  onClick={() => showModal(historyCompra)}
                                  className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                                >
                                  Cancelar compra
                                </button>
                              );
                            }
                          })()}
                        </div>
                      </div>
                      <div className={style.orderDate}>
                        {
                          <>
                            Compra realizada el{" "}
                            {new Date(
                              historyCompra?.updatedAt ||
                                historyCompra?.createdAt,
                            ).toLocaleString()}
                          </>
                        }
                      </div>
                      {/* <div className={style.orderDate}>
                        {(historyCompra.shipping_method == "envioLeon" ||
                          historyCompra.shipping_method == "paqueteexpress" ||
                          historyCompra.shipping_method == "dhl" ||
                          historyCompra.shipping_method == "estafeta") &&
                        historyCompra.statusEnvio != "entregado" ? (
                          <div>
                            <span>
                              Envío a tu domicilio. (
                              {historyCompra.shipping_method == "envioLeon"
                                ? "En Carro"
                                : historyCompra.shipping_method}
                              )
                            </span>

                            <div className="flex my-2">
                              <span>Fecha tentativa de entrega:</span>
                              <span className="block mx-2 font-bold text-black">
                                {(() => {
                                  const createdAt = new Date(
                                    historyCompra.createdAt,
                                  );
                                  const fechaMas7Dias = new Date(createdAt);
                                  fechaMas7Dias.setDate(
                                    createdAt.getDate() + 7,
                                  );

                                  const inicio = createdAt.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    },
                                  );
                                  const fin = fechaMas7Dias.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    },
                                  );

                                  return `${inicio} a ${fin}`;
                                })()}{" "}
                                de 10:00 AM - 7:00 PM
                              </span>
                            </div>
                            <div className="my-1 flex flex-col">
                              <span>
                                <span className="font-bold text-[black]">
                                  Calle:
                                </span>{" "}
                                {historyCompra.street}
                              </span>

                              <span>
                                <span className="font-bold text-[black]">
                                  No.Ext:
                                </span>{" "}
                                {historyCompra.noExt}
                              </span>

                              <span>
                                <span className="font-bold text-[black]">
                                  No.Int:
                                </span>{" "}
                                {historyCompra.noInt}
                              </span>

                              <span>
                                <span className="font-bold text-[black]">
                                  Colonia:
                                </span>{" "}
                                {historyCompra.cologne}
                              </span>

                              <span>
                                <span className="font-bold text-[black]">
                                  Estado:
                                </span>{" "}
                                {historyCompra.state}
                              </span>
                              <span>
                                <span className="font-bold text-[black]">
                                  Municipio:
                                </span>{" "}
                                {historyCompra.city}
                              </span>
                            </div>
                          </div>
                        ) : historyCompra.shipping_method == "sucursal" &&
                          historyCompra.statusEnvio != "cancelado" &&
                          historyCompra.statusEnvio != "entregado" ? (
                          <span>
                            Recoger en sucursal{" "}
                            <span className="font-bold text-black">
                              PCInbox
                            </span>{" "}
                            <div className="flex my-2">
                              <span>Fecha tentativa de entrega:</span>
                              <span className="block mx-2 font-bold text-black">
                                {(() => {
                                  const createdAt = new Date(
                                    historyCompra.createdAt,
                                  );
                                  const fechaMas7Dias = new Date(createdAt);
                                  fechaMas7Dias.setDate(
                                    createdAt.getDate() + 7,
                                  );

                                  const inicio = createdAt.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    },
                                  );
                                  const fin = fechaMas7Dias.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    },
                                  );

                                  return `${inicio} a ${fin}`;
                                })()}{" "}
                                de 10:00 AM - 7:00 PM
                              </span>
                            </div>
                          </span>
                        ) : (
                          ""
                        )}
                      </div> */}
                    </div>
                  </div>
                  <div className={style.orderItems + " flex flex-col"}>
                    {historyCompra.products?.map((d, indexD: number) => {
                      const address = historyCompra.products[indexD]?.address; // tu objeto de dirección
                      return (
                        <div className={style.item} key={indexD}>
                          <img
                            src={
                              d.image_url && Array.isArray(d.image_url)
                                ? d.image_url[0]
                                : d.image_url
                            }
                            className={style.itemImage}
                            loading="lazy"
                          />
                          <div className={style.itemDetails}>
                            <div className={style.itemName}>{d.name}</div>
                            <div className={style.itemVariant}>
                              {d.description}
                            </div>

                            {d.statusShip === "disponible" && (
                              <div className={style.itemMeta}>
                                <div className={style.itemVariant}>
                                  <Alert severity="success">
                                    Ya puedes recoger este producto en la
                                    sucursal PCinBOX-LEON
                                  </Alert>
                                </div>
                              </div>
                            )}

                            {/* Aquí agregamos la dirección */}
                            <div className={style.itemMeta}>
                              <div className={style.itemVariant}>
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
                                  <div className="flex items-center">
                                    Recoger en Sucursal PCinBOX-LEÓN
                                    <a
                                      onClick={() => {
                                        showUbicationStore(
                                          String("PCinBOX-León"),
                                        );
                                      }}
                                      style={{
                                        display: "flex",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        marginLeft: "5px",
                                        color: "black",
                                      }}
                                    >
                                      <MdLocationOn size={22} />
                                      Ver Ubicación
                                    </a>
                                  </div>
                                )}
                              </div>
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
                              <div className={style.itemVariant}>
                                <span
                                  style={{ padding: "5px" }}
                                  className={`text-center rounded font-bold shrink-0 block ${style.status} ${
                                    d.statusShip === "procesando"
                                      ? style.statusProcessing
                                      : d.statusShip === "enviado"
                                        ? style.statusShipped
                                        : d.statusShip === "cancelado"
                                          ? style.statusCancelled
                                          : d.statusShip === "entregado" ||
                                              d.statusShip === "disponible"
                                            ? style.statusDelivered
                                            : ""
                                  }`}
                                >
                                  ESTATUS: {d.statusShip?.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {d.status === "paid" &&
                              (d.shipping_method === "paqueteexpress" ||
                                d.shipping_method === "estafeta") &&
                              d.trackingNumber && (
                                <div
                                  style={{
                                    marginTop: "8px",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <span style={{ color: "#64748b" }}>
                                    🚚{" "}
                                    {d.shipping_method === "estafeta"
                                      ? "Estafeta"
                                      : "Paquete Express"}
                                  </span>

                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: "#0f172a",
                                    }}
                                  >
                                    {d.trackingNumber}
                                  </span>

                                  <a
                                    href={
                                      d.shipping_method === "estafeta"
                                        ? `https://www.estafeta.com/rastrear-envio?rastreo=true`
                                        : d.shipping_method === "paqueteexpress"
                                          ? `https://www.paqueteexpress.com.mx/rastreo/?guia=${d.trackingNumber}`
                                          : "" // Vacio por el metodo no permitido
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color: "#2563eb",
                                      fontWeight: 500,
                                      textDecoration: "none",
                                    }}
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

                  {/* {historyCompra.statusEnvio == "entregado" ? (
                    <div className={style.orderActions}>
                      <a
                        role="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          onRouterLink(
                            `/detalles-pedido/${historyCompra.idOrder}`,
                          )
                        }
                      >
                        Ver detalles
                      </a>
                    </div>
                  ) : null} */}
                </div>
              );
            })
          ) : (
            <Alert severity="info">Sin contenido disponible</Alert>
          )}
        </div>
      </div>
    </section>
  );
};

export default HistoryShop;
