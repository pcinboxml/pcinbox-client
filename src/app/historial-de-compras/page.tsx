"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import style from "./historial-de-compras.module.css";
import useHistorialDeCompras from "./useHistorialCompras";
import { Alert } from "@mui/material";
import useService from "../services/useService";
import { MdAutorenew } from "react-icons/md";

const HistoryShop = () => {
  const {
    dataHistoryCompras,
    loadingCancelledCompra,
    handleHistoryByUser,
    handleOnSelectStatus,
    showModal,
    handleOnSearch,
    handleOnPeriodo,
  } = useHistorialDeCompras();
  const { formatCurrency, onRouterLink } = useService();

  useEffect(() => {
    handleHistoryByUser();
  }, []);
  return (
    <section
      style={{
        width: "80%",
        margin: "30px auto",
        display: "flex",
      }}
    >
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
              onChange={handleOnSelectStatus}
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
              onChange={handleOnPeriodo}
            />
          </div>

          <div className="flex gap-1 items-center">
            <label htmlFor="state" className="flex shrink-0 text-[#808080]">
              Buscar producto:
            </label>
            <input
              type="text"
              className="form-control"
              onInput={(e) => handleOnSearch(e.currentTarget.value)}
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
                          Pedido #{historyCompra.idOrder}
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
                        {historyCompra.shipping_method == "envioLeon" ? (
                          <div>
                            <span>Envío en carro a tu domicilio.</span>

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
                          </span>
                        ) : historyCompra.shipping_method ==
                          "paqueteexpress" ? (
                          "Envío en paquetería Express"
                        ) : historyCompra.shipping_method == "dhl" ? (
                          "Envío en paquetería DHL"
                        ) : historyCompra.shipping_method == "estafeta" ? (
                          "Envío en paquetería Estafeta"
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {/* <div
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
                      {historyCompra.statusEnvio}
                    </div> */}

                    {/* <div>
                      {(historyCompra.pay_method == "tarjeta_de_debito" ||
                        historyCompra.pay_method == "tarjeta_de_credito") &&
                      historyCompra.statusEnvio == "cancelado" ? (
                        <p>Tu reembolso se reflejara de 5 a 10 días habiles</p>
                      ) : historyCompra.pay_method == "oxxo" &&
                        historyCompra.statusEnvio == "cancelado" &&
                        historyCompra.paidAtOxxo == 1 ? (
                        <p>
                          Comunicate con la sucursal{" "}
                          <span className="font-bold">PCInbox</span> para
                          solicitar reembolso de tu pedido. <br />
                          Envia el numero de Orden{" "}
                          <span className="font-bold">
                            #{historyCompra.idOrder}
                          </span>{" "}
                          y tu <span className="font-bold">Nombre</span> para
                          localizarlo en el sistema
                        </p>
                      ) : null}
                    </div> */}

                    {/* {historyCompra.statusEnvio != "entregado" &&
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
                    ) : null} */}
                    {/* <div className={style.orderTotal}>
                      Total con IVA:{" "}
                      {formatCurrency(
                        Number(
                          historyCompra.products.reduce(
                            (acc, p) => acc + Number(p.totalAmount),
                            0
                          )
                        )
                      )}
                    </div> */}
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
