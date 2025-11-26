"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import style from "./historial-de-compras.module.css";
import useHistorialDeCompras from "./useHistorialCompras";
import { Alert } from "@mui/material";
import useService from "../services/useService";
import { MdAutorenew } from "react-icons/md";
import { useTheContext } from "../services/globalContext";

const HistoryShop = () => {
  const currentDate = new Date();

  const {
    dataHistoryCompras,
    loadingCancelledCompra,
    handleHistoryByUser,
    // handleOnSelectStatus,
    showModal,
    handleOnSearch,
    setDataFilter,
    setDataHistoryCompras,
    // handleOnPeriodo,
  } = useHistorialDeCompras();
  const { formatCurrency, onRouterLink } = useService();

  const { socketPagos } = useTheContext();

  useEffect(() => {
    handleHistoryByUser();
  }, []);

  useEffect(() => {
    if (!socketPagos.current) return;

    const socket = socketPagos.current;

    const handler = (data: any) => {
      setDataHistoryCompras((prev) => {
        return prev.map((item) => {
          if (item.idShipment == data.idShipment) {
            return { ...item, statusEnvio: data.status };
          }
          return item;
        });
      });
    };

    socket.on("changeStatusShipment", handler);

    return () => {
      socket.off("changeStatusShipment", handler);
    };
  }, []);
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
              // onChange={handleOnSelectStatus}
            >
              <option value="allState">Todos los estados</option>
              <option value="entregado">Entregado</option>
              <option value="enviado">Enviado</option>
              <option value="procesando">Procesando</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="flex gap-1 items-center">
            <label htmlFor="periodo" className="flex shrink-0 text-[#808080]">
              Período:
            </label>
            <input
              type="date"
              id="periodo"
              className="form-control"
              defaultValue={`${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
                2,
                "0"
              )}`}
              onChange={(event) => {
                setDataFilter((prev) => ({
                  ...prev,
                  periodo: event.target.value,
                }));
              }}
              // onChange={handleOnPeriodo}
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
                          <div
                            className={`${style.status}  ${
                              historyCompra.statusEnvio == "procesando"
                                ? style.statusProcessing
                                : historyCompra.statusEnvio == "enviado"
                                ? style.statusShipped
                                : historyCompra.statusEnvio == "cancelado"
                                ? style.statusCancelled
                                : historyCompra.statusEnvio == "entregado"
                                ? style.statusDelivered
                                : ""
                            } p-2 rounded`}
                          >
                            <span className="text-center shrink-0 block">
                              Estatus: {historyCompra.statusEnvio}
                            </span>
                          </div>

                          <div>
                            {(historyCompra.pay_method == "tarjeta_de_debito" ||
                              historyCompra.pay_method ==
                                "tarjeta_de_credito") &&
                            historyCompra.statusEnvio == "cancelado" ? (
                              <p>
                                Tu reembolso se reflejara de 5 a 10 días habiles
                              </p>
                            ) : historyCompra.pay_method == "oxxo" &&
                              historyCompra.statusEnvio == "cancelado" &&
                              historyCompra.paidAtOxxo == 1 ? (
                              <p className="text-[16px]">
                                Comunicate con la sucursal{" "}
                                <span className="font-bold">PCInbox</span> para
                                solicitar reembolso de tu pedido. <br />
                              </p>
                            ) : null}
                          </div>

                          {historyCompra.statusEnvio != "entregado" &&
                          historyCompra.statusEnvio != "cancelado" ? (
                            <button
                              disabled={loadingCancelledCompra}
                              onClick={() => showModal(historyCompra)}
                              className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                            >
                              {loadingCancelledCompra ? (
                                <MdAutorenew
                                  size={20}
                                  className="m-auto the-spinner"
                                />
                              ) : (
                                <>Cancelar compra</>
                              )}
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <div className={style.orderDate}>
                        {
                          <>
                            Compra realizada el{" "}
                            {new Date(historyCompra.createdAt).toLocaleString()}
                          </>
                        }
                      </div>
                      <div className={style.orderDate}>
                        {historyCompra.shipping_method == "envioLeon" ||
                        historyCompra.shipping_method == "paqueteexpress" ||
                        historyCompra.shipping_method == "dhl" ||
                        historyCompra.shipping_method == "estafeta" ? (
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
                                    historyCompra.createdAt
                                  );
                                  const fechaMas7Dias = new Date(createdAt);
                                  fechaMas7Dias.setDate(
                                    createdAt.getDate() + 7
                                  );

                                  const inicio = createdAt.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
                                  );
                                  const fin = fechaMas7Dias.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
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
                          historyCompra.statusEnvio != "cancelado" ? (
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
                                    historyCompra.createdAt
                                  );
                                  const fechaMas7Dias = new Date(createdAt);
                                  fechaMas7Dias.setDate(
                                    createdAt.getDate() + 7
                                  );

                                  const inicio = createdAt.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
                                  );
                                  const fin = fechaMas7Dias.toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
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
                      </div>
                    </div>
                  </div>
                  <div className={style.orderItems + " flex flex-col"}>
                    {historyCompra.products.map((d, indexD) => {
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
                            <div className={style.itemMeta}>
                              <div className={style.itemQuantity}>
                                Cantidad: {d.quantity}
                              </div>
                              <div className={style.itemPrice}>
                                {formatCurrency(
                                  Number(d.price) * Number(d.quantity)
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {historyCompra.statusEnvio == "entregado" ? (
                    <div className={style.orderActions}>
                      <a
                        role="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          onRouterLink(
                            `/detalles-pedido/${historyCompra.idOrder}`
                          )
                        }
                      >
                        Ver detalles
                      </a>
                    </div>
                  ) : null}
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
