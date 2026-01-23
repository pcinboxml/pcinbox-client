"use client";

import { MdAutorenew, MdClose, MdDirectionsCar, MdStore } from "react-icons/md";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import { Alert } from "@mui/material";
import useOpcionesEntrega from "./useOpcionesEntrega";
import styles from "./opciones-entrega.module.css";
import { use, useEffect, useMemo, useState } from "react";
import useStorage from "../services/useStorage";
import { CheckCircle } from "lucide-react";
import ShippingNotice from "../components/shoppingNotice/ShoppingNotice";
import ProductI from "../interfaces/products/product.interface";

const OpcionesEntrega = () => {
  const [pesoPaqueteExpress, setPesoPaqueteExpress] = useState<any[]>([]);

  const {
    onRouterLink,
    formatCurrency,
    tarifasPaqueteExpress,
    calcPesoPaquete,
  } = useService();
  const {
    handleOnChangeOptionEnvio,
    handleRemoveAddress,
    handleFormRegisterAddress,
    setIsEditAddress,
    getValuesStorage,
    getValuesStorage2,
    optionEnvio,
    costoEnvioProductByZone,
    setCostoEnvioProductByZone,
    setOptionEnvio,
    loadingAddressUser,
    handleFormEditAddress,
    generateCostoByZone,
    CIUDADES_ENVIO_PERSONALIZADO,
    addressByStore,
    setAddressByStore,
  } = useOpcionesEntrega();

  const {
    progressPay,
    progressPay2,
    handleWriteStorageProgressPay,
    handleWriteStorageProgressPay2,
  } = useStorage();

  const { dataCart, dataUserAddress, setDataModal, setDataAddress } =
    useTheContext();

  useEffect(() => {
    if (!dataCart || dataCart.length === 0 || !addressByStore || !optionEnvio)
      return;

    const fetchCostos = async () => {
      for (const [storeId, envio] of Object.entries(optionEnvio)) {
        if (envio === "envioLeon") {
          const addressId = addressByStore[storeId];

          if (addressId) {
            const costo = await generateCostoByZone(Number(addressId));
            setCostoEnvioProductByZone((prev) => ({
              ...prev,
              [storeId]: costo,
            }));
          }
        }
      }
    };

    fetchCostos();
  }, [dataCart, addressByStore, optionEnvio]);

  // Agrupar productos por storeId y providerId
  const groupedProducts: any = useMemo(() => {
    if (!dataCart || dataCart.length === 0) return [];

    const groups: any = {};

    dataCart.forEach((product) => {
      // Crear una clave única basada en storeId y providerId
      const groupKey = `${product.storeId || "null"}-${product.providerId}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          storeId: product.storeId,
          providerId: product.providerId,
          products: [],
          total: 0,
        };
      }

      groups[groupKey].products.push(product);
      groups[groupKey].total += Number(product.price) * product.quantity;
    });

    return Object.values(groups);
  }, [dataCart]);

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .filter((itemF) => itemF.stock != 0)
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  useEffect(() => {
    loadingAddressUser();
    getValuesStorage();
    getValuesStorage2();
  }, []);

  // Función para obtener el nombre de la sucursal basado en el storeId
  const getStoreName = (storeId: any, product: ProductI) => {
    if (!storeId) return "PCinBOX";

    const sucursal = product?.product_stock?.find((s) => s.branchId == storeId);

    if (sucursal) {
      switch (sucursal?.branches?.name) {
        case "santafe":
          return "PCinBOX-SFD";
        case "leon":
          return "PCinBOX-León";
        case "dicoags2":
          return "PCinBOX-AG2D";
        case "Arboledas":
          return "PCinBOX-AGD";
        default:
          return `Sucursal ${sucursal?.branches?.name}`;
      }
    }

    return "Sucursal";
  };

  useEffect(() => {
    async function fetchCalcPesoPaqueteExpress() {
      if (groupedProducts && groupedProducts.length > 0) {
        const allPesos: any[] = [];

        for (let group of groupedProducts) {
          // if (group?.storeId != null) {
          const result = await calcPesoPaquete(group.products, group.storeId);
          // result es un array de {idProduct, pesoVolumetrico}
          allPesos.push(...result);
          // }
        }

        setPesoPaqueteExpress(allPesos); // Guardar TODOS los pesos por producto
      }
    }

    fetchCalcPesoPaqueteExpress();
  }, [groupedProducts]);

  return (
    <section>
      {/* {dataCart && dataCart?.length > 0 ? <ShippingNotice /> : ""} */}
      {dataCart && dataCart.length > 0 ? (
        <TimelineComponent activeStep={1} />
      ) : null}
      {dataCart && dataCart.length > 0 ? (
        groupedProducts.map((group: any, indexGroup: number) => {
          // Crear una clave única para el grupo
          const groupKey = `${group.storeId || "null"}-${group.providerId}`;

          return (
            <div
              key={groupKey}
              className="container-tabla  w-[90%] mx-auto my-3"
            >
              <div
                className="header-container-tabla w-[100%] p-2 bg-[#666666]"
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <img
                  src="/logo_blanco_pcinbox.png"
                  width={70}
                  height={70}
                  style={{ objectFit: "contain", marginLeft: "10px" }}
                  loading="lazy"
                />
              </div>

              <div className="content-tabla-opciones-entrega">
                <div className="grid grid-cols-[1fr_1fr] w-full">
                  <div className="productos p-3 overflow-y-auto max-h-[250px]">
                    {group.products.map((product: any) => (
                      <div
                        key={`${product?.idProduct}-${product?.storeId}`}
                        className="mb-3"
                      >
                        <span className="text-[#666666] text-sm">
                          {`${product?.name} ${product?.description}`.length >
                          100
                            ? `${product?.name} ${product?.description}...`.slice(
                                0,
                                100,
                              )
                            : `${product?.name} ${product?.description}`}
                        </span>
                        <span
                          className="bg-[#BB3D4B] text-white font-bold rounded"
                          style={{
                            padding: "5px",
                            display: "inline-block",
                            marginLeft: "10px",
                          }}
                        >
                          Cantidad: {product?.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="opcion-de-envio p-3">
                    {!group.storeId && (
                      <div className="flex">
                        <input
                          type="radio"
                          name={`envio-${groupKey}`}
                          id={`sucursal-${groupKey}`}
                          value="sucursal"
                          style={{
                            marginRight: "10px",
                          }}
                          checked={optionEnvio[groupKey] === "sucursal"}
                          onChange={(event) =>
                            handleOnChangeOptionEnvio(event, groupKey)
                          }
                        />

                        <MdStore size={26} color="gray" />
                        <label
                          className="form-check-label"
                          htmlFor={`sucursal-${groupKey}`}
                        >
                          <span className="text-[#666666] text-sm mx-2">
                            Recoger en sucursal (PCinBOX-LEÓN){" "}
                          </span>
                        </label>
                        <hr />
                      </div>
                    )}
                    {group.storeId && (
                      <div className="flex">
                        <input
                          type="radio"
                          name={`envio-${groupKey}`}
                          id={`sucursalExt-${groupKey}`}
                          value="sucursalExt"
                          style={{
                            marginRight: "10px",
                          }}
                          checked={optionEnvio[groupKey] === "sucursalExt"}
                          onChange={(event) =>
                            handleOnChangeOptionEnvio(event, groupKey)
                          }
                        />

                        <MdStore size={26} color="gray" />
                        <label
                          className="form-check-label"
                          htmlFor={`sucursalExt-${groupKey}`}
                        >
                          <span className="text-[#666666] text-sm mx-2">
                            Recoger en Sucursal{" "}
                            {getStoreName(group.storeId, group.products[0])}
                          </span>
                        </label>
                        <hr />
                      </div>
                    )}
                    {totalPrice > 1000 && dataUserAddress ? (
                      <>
                        <img
                          src="/compra_segura_gris.png"
                          width="150"
                          height="150"
                          style={{ objectFit: "contain", marginTop: "10px" }}
                        />
                      </>
                    ) : null}
                    {totalPrice < 1000 ? (
                      <Alert severity="info" className="mt-3">
                        Para que la empresa{" "}
                        <span style={{ fontWeight: "bold", color: "black" }}>
                          PCinBOX
                        </span>{" "}
                        realice el envío a tu domicilio, el monto mínimo de
                        compra debe ser de{" "}
                        <span style={{ fontWeight: "bold", color: "black" }}>
                          $1,000 pesos
                        </span>
                        . Este servicio aplica únicamente para León y zonas
                        específicas.
                      </Alert>
                    ) : null}
                    {totalPrice >= 1000 &&
                      dataUserAddress &&
                      dataUserAddress.some((d) =>
                        CIUDADES_ENVIO_PERSONALIZADO.includes(d.city),
                      ) &&
                      Number(group.providerId) === 1 && (
                        <div className="flex items-center relative my-4">
                          <input
                            type="radio"
                            name={`envio-${groupKey}`}
                            id={`envio-${groupKey}`}
                            value="envioLeon"
                            checked={optionEnvio[groupKey] === "envioLeon"}
                            onChange={(event) =>
                              handleOnChangeOptionEnvio(event, groupKey)
                            }
                          />

                          <label
                            className="form-check-label"
                            htmlFor={`envio-${groupKey}`}
                          >
                            <div className="w-full flex items-center">
                              <MdDirectionsCar size={26} />
                              <span
                                className="text-[#666666] text-sm mx-2"
                                style={{ fontWeight: "bold" }}
                              >
                                <span style={{ fontWeight: "bold" }}>| </span>
                                Envío personalizado por parte de PCinBOX
                              </span>
                              <span>
                                {costoEnvioProductByZone[groupKey] !== undefined
                                  ? costoEnvioProductByZone[groupKey] === 0
                                    ? "Envío: Gratis"
                                    : `Envío: (${formatCurrency(Number(costoEnvioProductByZone[groupKey]))})`
                                  : ""}
                              </span>
                            </div>
                          </label>
                        </div>
                      )}

                    {totalPrice >= 1000 &&
                      dataUserAddress &&
                      dataUserAddress.some((d) =>
                        CIUDADES_ENVIO_PERSONALIZADO.filter(
                          (df) => df !== d.city,
                        ),
                      ) &&
                      Number(group.providerId) !== 1 && (
                        <>
                          {(() => {
                            const sumaPorStore = pesoPaqueteExpress.reduce(
                              (acc, producto) => {
                                const key = producto.storeId; // usamos storeId como clave
                                if (!acc[key]) {
                                  acc[key] = 0;
                                }
                                acc[key] += producto.pesoVolumetrico;
                                return acc;
                              },
                              {},
                            );

                            let arraySumStore = Object.entries(
                              sumaPorStore,
                            ).map((d) => {
                              let [key, value] = d;
                              return {
                                storeId: key == "null" ? null : key,
                                volumenTotal: value,
                              };
                            });

                            let findVolement = arraySumStore.find(
                              (a) =>
                                Number(a.storeId) === Number(group.storeId),
                            );

                            if (
                              findVolement &&
                              Number(findVolement.volumenTotal) > 20
                            ) {
                              //Estafeta
                              return (
                                <div className="flex items-center relative ">
                                  <input
                                    type="radio"
                                    style={{
                                      marginRight: "10px",
                                    }}
                                    name={`envio-${groupKey}`}
                                    id={`envio-${groupKey}`}
                                    value="estafeta"
                                    checked={
                                      optionEnvio[groupKey] === "estafeta"
                                    }
                                    onChange={(event) =>
                                      handleOnChangeOptionEnvio(event, groupKey)
                                    }
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor={`envio-${groupKey}`}
                                  >
                                    <div className="w-full flex items-center">
                                      <img
                                        src="/estafeta.png"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "contain",
                                          filter: "grayscale(100%)",
                                        }}
                                        loading="lazy"
                                      />

                                      <span
                                        className="text-[#666666] text-sm mx-2"
                                        style={{ fontWeight: "bold" }}
                                      >
                                        <span style={{ fontWeight: "bold" }}>
                                          |
                                        </span>{" "}
                                        Estafeta
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              );
                            } else {
                              //PaqueteExpress

                              return (
                                <div className="flex items-center relative">
                                  <input
                                    type="radio"
                                    style={{
                                      marginRight: "10px",
                                    }}
                                    name={`envio-${groupKey}`}
                                    id={`envio-${groupKey}`}
                                    value="paqueteexpress"
                                    checked={
                                      optionEnvio[groupKey] === "paqueteexpress"
                                    }
                                    onChange={(event) =>
                                      handleOnChangeOptionEnvio(event, groupKey)
                                    }
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor={`envio-${groupKey}`}
                                  >
                                    <div className="w-full flex items-center">
                                      <img
                                        src="/paqueteexpress.png"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "contain",
                                          filter: "grayscale(100%)",
                                        }}
                                        loading="lazy"
                                      />
                                      <span
                                        className="text-[#666666] text-sm mx-2"
                                        style={{ fontWeight: "bold" }}
                                      >
                                        <span style={{ fontWeight: "bold" }}>
                                          |
                                        </span>{" "}
                                        Paquete Express
                                      </span>

                                      <span>
                                        {(() => {
                                          if (findVolement) {
                                            let tarifa =
                                              tarifasPaqueteExpress?.find(
                                                (t) =>
                                                  Number(
                                                    findVolement?.volumenTotal,
                                                  ) >= t.de &&
                                                  Number(
                                                    findVolement?.volumenTotal,
                                                  ) <= t.a,
                                              );

                                            return formatCurrency(
                                              Number(tarifa?.price),
                                            );
                                          }
                                        })()}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              );
                            }

                            // if (findVolement) {
                            //   let tarifa = tarifasPaqueteExpress?.find(
                            //     (t) =>
                            //       Number(findVolement?.volumenTotal) >=
                            //         t.de &&
                            //       Number(findVolement?.volumenTotal) <=
                            //         t.a,
                            //   );

                            // }
                          })()}
                        </>
                      )}

                    <hr />
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-end my-4">
                <button
                  onClick={() => {
                    handleFormRegisterAddress();
                  }}
                  className="border py-2 px-5 text-black rounded"
                >
                  Agregar domicilio
                </button>
              </div>

              {optionEnvio[groupKey] !== "sucursal" &&
                optionEnvio[groupKey] !== "sucursalExt" &&
                dataUserAddress &&
                dataUserAddress.length > 0 &&
                dataUserAddress.map((selectedAddress) => {
                  if (
                    selectedAddress.idAddress == addressByStore[groupKey] &&
                    totalPrice > 1000
                  ) {
                    return (
                      <div
                        className="bg-red-50 rounded-lg border border-red-200 p-3 relative"
                        key={`${groupKey}-${selectedAddress?.idAddress}`}
                      >
                        <button
                          className="absolute right-3 top-3"
                          onClick={() => {
                            setAddressByStore((prev) => {
                              const newState = { ...prev };
                              delete newState[groupKey];
                              return newState;
                            });

                            setOptionEnvio((prev) => {
                              const newState = { ...prev };
                              delete newState[groupKey];
                              return newState;
                            });

                            setCostoEnvioProductByZone((prev) => {
                              const newState = { ...prev };
                              delete newState[groupKey];
                              return newState;
                            });
                          }}
                        >
                          <MdClose size={30} />
                        </button>

                        <span className="font-bold text-black text-[18px] block my-3">
                          Seleccionaste el domicilio:
                        </span>

                        <div className="flex items-start gap-2">
                          <CheckCircle
                            size={18}
                            className="text-[#BB3D4B] flex-shrink-0 mt-0.5"
                          />
                          <div className="text-sm">
                            <p className="font-semibold text-gray-800">
                              {selectedAddress.street} #{selectedAddress.noExt}
                              {selectedAddress.noInt &&
                                ` Int. ${selectedAddress.noInt}`}
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              {selectedAddress.cologne}, {selectedAddress.city}{" "}
                              • CP {selectedAddress.postalCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex my-2 justify-start p-2">
                          <a
                            role="button"
                            style={{
                              display: "inline-block",
                              marginLeft: "10px",
                              color: "#606060",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                            onClick={() => {
                              setIsEditAddress({
                                edit: true,
                                idAddress: selectedAddress.idAddress,
                              });
                              setDataAddress({
                                city: selectedAddress.city,
                                cologne: selectedAddress.cologne,
                                country: selectedAddress.country,
                                noExt: selectedAddress.noExt,
                                phone1: selectedAddress.phone1,
                                phone2: selectedAddress.phone2,
                                state: selectedAddress.state,
                                street: selectedAddress.street,
                                noInt: selectedAddress.noInt,
                                codePostal: Number(selectedAddress.postalCode),
                              });

                              handleFormEditAddress(selectedAddress);
                            }}
                          >
                            Editar
                          </a>

                          <a
                            role="button"
                            style={{
                              display: "inline-block",
                              marginLeft: "10px",
                              color: "#BB3D4B",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                            onClick={() => handleRemoveAddress(selectedAddress)}
                          >
                            Eliminar
                          </a>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          );
        })
      ) : (
        <Alert severity="info">No hay datos para mostrar</Alert>
      )}
      {dataCart && dataCart.length > 0 ? (
        <div className="w-full flex justify-end items-center  gap-5 mt-4">
          <button
            onClick={() => onRouterLink("/confirma-productos")}
            className="border py-2 px-5 text-black rounded"
          >
            Atrás
          </button>
          <button
            className="bg-[#B92B3D] py-2 px-5 text-white rounded"
            onClick={() => {
              if (Object.entries(optionEnvio).length == 0) {
                setDataModal({
                  isOpen: true,
                  type: "error",
                  message: "Seleccione los metodos de entrega faltantes",
                  title: "Error",
                  onClose: () => {
                    setDataModal((prev) => ({ ...prev, isOpen: false }));
                  },
                  onConfirm: () => {
                    setDataModal((prev) => ({ ...prev, isOpen: false }));
                  },
                });
                return;
              }

              handleWriteStorageProgressPay2({
                optionEnvio,
                addressByStore,
                costoEnvioProductByZone,
              });

              onRouterLink("/forma-de-pago");
            }}
          >
            Continuar
          </button>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default OpcionesEntrega;
