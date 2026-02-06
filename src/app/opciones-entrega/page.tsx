"use client";

import {
  MdClose,
  MdDirectionsCar,
  MdLocationOn,
  MdStore,
} from "react-icons/md";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import { Alert } from "@mui/material";
import useOpcionesEntrega from "./useOpcionesEntrega";
import { useEffect, useMemo, useState } from "react";
import useStorage from "../services/useStorage";
import { CheckCircle } from "lucide-react";
import ProductI from "../interfaces/products/product.interface";

const OpcionesEntrega = () => {
  const [pesoPaqueteExpress, setPesoPaqueteExpress] = useState<any[]>([]);

  const {
    onRouterLink,
    formatCurrency,
    tarifasPaqueteExpress,
    totalPrice,
    calcPesoPaquete,
    calcularPrecioPorVolumen,
  } = useService();
  const {
    handleOnChangeOptionEnvio,
    handleRemoveAddress,
    handleFormRegisterAddress,
    setIsEditAddress,
    // getValuesStorage,
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
    handleOnChangeSeguroEnvio,
    seguroEnvio,
    showUbicationStore,
  } = useOpcionesEntrega();

  const { handleWriteStorageProgressPay2 } = useStorage();

  const { dataCart, dataUserAddress, setDataModal, setDataAddress } =
    useTheContext();

  useEffect(() => {
    if (!dataCart || dataCart.length === 0 || !addressByStore || !optionEnvio)
      return;

    const fetchCostos = async () => {
      const nuevosCostos: Record<string, number> = {};

      // 🔹 Calculamos paquete express UNA VEZ
      const sumaPorStore = pesoPaqueteExpress.reduce(
        (acc, producto) => {
          const key = producto.storeId;
          if (!acc[key]) acc[key] = 0;
          acc[key] += producto.pesoVolumetrico;
          return acc;
        },
        {} as Record<string, number>,
      );

      for (const [storeId, envio] of Object.entries(optionEnvio)) {
        if (envio == "sucursal") {
          nuevosCostos[storeId] = 0;
        }

        // 👉 ENVÍO LEÓN
        if (envio === "envioLeon") {
          const addressId = addressByStore[storeId];
          if (addressId) {
            const costo = await generateCostoByZone(Number(addressId));
            nuevosCostos[storeId] = costo;
          }
        }

        // 👉 PAQUETE EXPRESS
        if (envio === "paqueteexpress") {
          let storeIdSplit = storeId.split("-");

          if (storeIdSplit.length > 0) {
            const volumenTotal = sumaPorStore[storeIdSplit[0]];

            if (volumenTotal !== undefined && volumenTotal !== null) {
              const tarifa = tarifasPaqueteExpress.find(
                (t) => volumenTotal <= t.max,
              );

              if (tarifa) {
                nuevosCostos[storeId] = Number(tarifa.price);
              }
            }
          }
        }

        if (envio === "estafeta") {
          nuevosCostos[storeId] = Number(17.4);
        }
      }

      // 🔥 UN SOLO SET
      setCostoEnvioProductByZone((prev) => ({
        ...prev,
        ...nuevosCostos,
      }));
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

  useEffect(() => {
    loadingAddressUser();
    // getValuesStorage();
    getValuesStorage2();
  }, []);

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
        groupedProducts.map((group: any) => {
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
                    {/* {!group.storeId && ( */}
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
                      <a
                        onClick={() => {
                          showUbicationStore(String("PCinBOX-León"));
                        }}
                        style={{
                          display: "flex",
                          fontSize: "13px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <MdLocationOn size={22} />
                        Ver Ubicación
                      </a>
                      <hr />
                    </div>

                    {Number(group?.providerId) === 1 &&
                    totalPrice > 1000 &&
                    dataUserAddress ? (
                      <>
                        <img
                          src="/compra_segura_gris.png"
                          width="150"
                          height="150"
                          style={{ objectFit: "contain", marginTop: "10px" }}
                        />
                      </>
                    ) : null}
                    {totalPrice < 1000 && Number(group?.providerId) === 1 ? (
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
                                {optionEnvio[groupKey] === "envioLeon" &&
                                costoEnvioProductByZone[groupKey] !== undefined
                                  ? costoEnvioProductByZone[groupKey] === 0
                                    ? "Envío: Gratis"
                                    : `Envío: (${formatCurrency(Number(costoEnvioProductByZone[groupKey]))})`
                                  : ""}
                              </span>
                            </div>
                          </label>
                        </div>
                      )}

                    {dataUserAddress &&
                      dataUserAddress.some((d) =>
                        CIUDADES_ENVIO_PERSONALIZADO.filter(
                          (df) => df !== d.city,
                        ),
                      ) &&
                      Number(group.providerId) !== 1 && (
                        <>
                          {(() => {
                            const findVolement = group.products.reduce(
                              (total: any, item: any) => {
                                const volume =
                                  item.width * item.height * item.largo;
                                return total + volume * Number(item.quantity);
                              },
                              0,
                            );

                            const { tarifa, pesoVolumetrico, excede } =
                              calcularPrecioPorVolumen(Number(findVolement));

                            return (
                              <>
                                {!excede && tarifa && tarifa.max < 21 && (
                                  <div className="flex items-center relative">
                                    <input
                                      type="radio"
                                      style={{
                                        marginRight: "10px",
                                      }}
                                      name={`envio-pe-${groupKey}`}
                                      id={`envio-pe-${groupKey}`}
                                      value="paqueteexpress"
                                      checked={
                                        optionEnvio[groupKey] ===
                                        "paqueteexpress"
                                      }
                                      onChange={(event) =>
                                        handleOnChangeOptionEnvio(
                                          event,
                                          groupKey,
                                        )
                                      }
                                    />

                                    <label
                                      className="form-check-label"
                                      htmlFor={`envio-pe-${groupKey}`}
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
                                            return formatCurrency(
                                              calcularPrecioPorVolumen(
                                                Number(findVolement),
                                              )?.tarifa?.price!,
                                            );
                                          })()}
                                        </span>
                                      </div>
                                    </label>
                                  </div>
                                )}
                                {excede && (
                                  <Alert severity="warning">
                                    El volumen ({pesoVolumetrico} kg) excede el
                                    límite de Paquete Express
                                  </Alert>
                                )}
                                {optionEnvio[groupKey] === "paqueteexpress" &&
                                  !excede &&
                                  tarifa &&
                                  tarifa.max < 20 && (
                                    <Alert
                                      severity="info"
                                      className="flex justify-center relative"
                                    >
                                      <div className="flex items-center mx-2 absolute top-2 right-2">
                                        <span className="font-bold text-black">
                                          {(() => {
                                            let findDataProductsStoreId =
                                              dataCart?.filter(
                                                (d) =>
                                                  d.storeId ===
                                                  Number(group.stored),
                                              );

                                            const totalPriceStoreProvider3 =
                                              Math.round(
                                                findDataProductsStoreId
                                                  ?.filter(
                                                    (itemF) =>
                                                      itemF.stock != 0 &&
                                                      Number(
                                                        itemF?.providerId,
                                                      ) === 3,
                                                  )
                                                  .map(
                                                    (item) =>
                                                      Number(item.price) *
                                                      item.quantity,
                                                  )
                                                  .reduce(
                                                    (sum, current) =>
                                                      sum + current,
                                                    0,
                                                  ) +
                                                  Number.EPSILON * 100,
                                              ) / 100;

                                            return formatCurrency(
                                              Number(
                                                seguroEnvio[groupKey]
                                                  ?.required == "no" ||
                                                  totalPriceStoreProvider3 <
                                                    1000
                                                  ? 15 * (1 + 0.16)
                                                  : (Math.ceil(
                                                      totalPriceStoreProvider3,
                                                    ) /
                                                      1000) *
                                                      15 *
                                                      (1 + 0.16),
                                              ),
                                            );
                                          })()}
                                        </span>
                                      </div>
                                      <div className="flex relative flex-col">
                                        <span className="font-bold text-black text-center">
                                          ¿Deseas seguro de envío?
                                        </span>

                                        <div className="flex justify-center">
                                          <div className="flex items-center relative">
                                            <input
                                              type="radio"
                                              style={{
                                                marginRight: "5px",
                                              }}
                                              name={`seguro-${groupKey}`}
                                              id={`seguro-si-${groupKey}`}
                                              value="si"
                                              checked={
                                                seguroEnvio[groupKey]
                                                  ?.required === "si"
                                              }
                                              onChange={(event) => {
                                                handleOnChangeSeguroEnvio(
                                                  event,
                                                  groupKey,
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={`seguro-si-${groupKey}`}
                                            >
                                              SI
                                            </label>
                                          </div>
                                          <span
                                            style={{
                                              marginLeft: "5px",
                                              display: "inline-block",
                                              marginRight: "5px",
                                              color: "black",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            |
                                          </span>

                                          <div className="flex items-center relative">
                                            <input
                                              type="radio"
                                              style={{
                                                marginRight: "5px",
                                              }}
                                              name={`seguro-${groupKey}`}
                                              id={`seguro-no-${groupKey}`}
                                              value="no"
                                              checked={
                                                seguroEnvio[groupKey]
                                                  ?.required === "no"
                                              }
                                              onChange={(event) => {
                                                //const { value } = event.target;

                                                handleOnChangeSeguroEnvio(
                                                  event,
                                                  groupKey,
                                                );
                                                // handleWriteStorageProgressPay2({
                                                //   seguroEnvio: {
                                                //     ...seguroEnvio,
                                                //     [groupKey]: 0,
                                                //   },
                                                // });
                                              }}
                                            />
                                            <label
                                              htmlFor={`seguro-no-${groupKey}`}
                                            >
                                              NO
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </Alert>
                                  )}
                                {!excede && tarifa && tarifa.max < 6 && (
                                  <>
                                    <div className="flex items-center relative ">
                                      <input
                                        type="radio"
                                        style={{
                                          marginRight: "10px",
                                        }}
                                        name={`envio-e-${groupKey}`}
                                        id={`envio-e-${groupKey}`}
                                        value="estafeta"
                                        checked={
                                          optionEnvio[groupKey] === "estafeta"
                                        }
                                        onChange={(event) =>
                                          handleOnChangeOptionEnvio(
                                            event,
                                            groupKey,
                                          )
                                        }
                                      />

                                      <label
                                        className="form-check-label"
                                        htmlFor={`envio-e-${groupKey}`}
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
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              |
                                            </span>{" "}
                                            Estafeta
                                          </span>

                                          <span>
                                            {(() => {
                                              return formatCurrency(
                                                Number(178.0),
                                              );
                                            })()}
                                          </span>
                                        </div>
                                      </label>
                                    </div>

                                    {optionEnvio[groupKey] === "estafeta" && (
                                      <Alert
                                        severity="info"
                                        className="flex justify-center relative"
                                      >
                                        <div className="flex items-center mx-2 absolute top-2 right-2">
                                          <span className="font-bold text-black">
                                            {(() => {
                                              let findDataProductsStoreId =
                                                dataCart?.filter(
                                                  (d) =>
                                                    d.storeId ===
                                                    Number(group.stored),
                                                );

                                              const totalPriceStoreProvider3 =
                                                Math.round(
                                                  findDataProductsStoreId
                                                    ?.filter(
                                                      (itemF) =>
                                                        itemF.stock != 0 &&
                                                        Number(
                                                          itemF?.providerId,
                                                        ) === 3,
                                                    )
                                                    .map(
                                                      (item) =>
                                                        Number(item.price) *
                                                        item.quantity,
                                                    )
                                                    .reduce(
                                                      (sum, current) =>
                                                        sum + current,
                                                      0,
                                                    ) +
                                                    Number.EPSILON * 100,
                                                ) / 100;

                                              return formatCurrency(
                                                Number(
                                                  seguroEnvio[groupKey]
                                                    ?.required == "no" ||
                                                    totalPriceStoreProvider3 <
                                                      1000
                                                    ? 15 * (1 + 0.16)
                                                    : (Math.ceil(
                                                        totalPriceStoreProvider3,
                                                      ) /
                                                        1000) *
                                                        15 *
                                                        (1 + 0.16),
                                                ),
                                              );
                                            })()}
                                          </span>
                                        </div>
                                        <div className="flex relative flex-col">
                                          <span className="font-bold text-black text-center">
                                            ¿Deseas seguro de envío?
                                          </span>

                                          <div className="flex justify-center">
                                            <div className="flex items-center relative">
                                              <input
                                                type="radio"
                                                style={{
                                                  marginRight: "5px",
                                                }}
                                                name={`seguro-${groupKey}`}
                                                id={`seguro-si-${groupKey}`}
                                                value="si"
                                                checked={
                                                  seguroEnvio[groupKey]
                                                    ?.required === "si"
                                                }
                                                onChange={(event) => {
                                                  handleOnChangeSeguroEnvio(
                                                    event,
                                                    groupKey,
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={`seguro-si-${groupKey}`}
                                              >
                                                SI
                                              </label>
                                            </div>
                                            <span
                                              style={{
                                                marginLeft: "5px",
                                                display: "inline-block",
                                                marginRight: "5px",
                                                color: "black",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              |
                                            </span>

                                            <div className="flex items-center relative">
                                              <input
                                                type="radio"
                                                style={{
                                                  marginRight: "5px",
                                                }}
                                                name={`seguro-${groupKey}`}
                                                id={`seguro-no-${groupKey}`}
                                                value="no"
                                                checked={
                                                  seguroEnvio[groupKey]
                                                    ?.required === "no"
                                                }
                                                onChange={(event) => {
                                                  handleOnChangeSeguroEnvio(
                                                    event,
                                                    groupKey,
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={`seguro-no-${groupKey}`}
                                              >
                                                NO
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </Alert>
                                    )}
                                  </>
                                )}
                              </>
                            );
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
                  if (selectedAddress.idAddress == addressByStore[groupKey]) {
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
              if (
                groupedProducts.length !== Object.entries(optionEnvio).length
              ) {
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
              for (const [key, shippingMethod] of Object.entries(optionEnvio)) {
                if (shippingMethod === "") {
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
                } else {
                  if (
                    shippingMethod === "paqueteexpress" ||
                    shippingMethod === "estafeta"
                  ) {
                    const seguro = seguroEnvio[key];

                    if (!seguro) {
                      setDataModal({
                        isOpen: true,
                        type: "error",
                        message:
                          "Seleccione si desea agregar seguro o no a su envío de " +
                          shippingMethod,
                        title: "Error",
                        onClose: () => {
                          setDataModal((prev) => ({ ...prev, isOpen: false }));
                        },
                        onConfirm: () => {
                          setDataModal((prev) => ({ ...prev, isOpen: false }));
                        },
                      });

                      return; // Esto ahora sí detiene la ejecución de la función externa
                    }
                  }
                }
              }

              // Aquí puedes poner código que solo se ejecute si todos los seguros están correctos

              let dataPurchase: any = {};

              Object.entries(optionEnvio).forEach(([key, shippingMethod]) => {
                const seguro = seguroEnvio[key];
                const theAddressByStore = addressByStore[key];
                const theCostoEnvioProductByZone = costoEnvioProductByZone[key];

                dataPurchase[key] = {
                  shipping_method: shippingMethod,
                  costoSeguroEnvio: seguro ? seguro.costo : null,
                  idAddress: theAddressByStore || null,
                  costoEnvioProductByZone:
                    shippingMethod == "estafeta"
                      ? 178.0
                      : theCostoEnvioProductByZone || null,
                };
              });

              handleWriteStorageProgressPay2({
                dataPurchase,
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
