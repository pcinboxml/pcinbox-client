"use client";

import { Alert } from "@mui/material";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import Table from "../components/table/Table";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import styles from "./ordenes.module.css";
import useOrdenes from "./useOrdenes";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { MdAutorenew } from "react-icons/md";
import useStorage from "../services/useStorage";
import useCart from "../components/cart/useCart";
import ProductI from "../interfaces/products/product.interface";
import { CheckoutStep } from "../components/timeline/checkoutSteps";

const Ordenes = () => {
  // const { rows, columns, subTotal } = useOrdenes();
  const { dataCart, setDataCart } = useTheContext();
  const {
    dataCartStorege,
    handleRemoveStorageDataCart,
    handleWriteStorageDataCart,
  } = useStorage();
  const { formatCurrency, onRouterLink, totalPrice } = useService();
  const { handleRemoveItemCart, handleRemoveAllCart, loadingRmAllCart } =
    useCart();

  return (
    <section className={styles.section}>
      <div className="w-[280px] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <span className="text-[#BB3D4B] font-[600] text-[22px] mb-3 block">
          Carrito de compras
        </span>

        {dataCart && dataCart.length > 0 ? (
          <div className="w-full flex justify-end py-2 px-2">
            <button
              className="border flex justify-center items-center p-2"
              disabled={loadingRmAllCart}
              onClick={() => {
                handleRemoveStorageDataCart();
                localStorage.removeItem("progressPay2");
                handleRemoveAllCart(dataCart, () => {});
              }}
            >
              {loadingRmAllCart ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : (
                <>
                  <span className="mx-2">Vaciar carrito</span>
                  <Trash2 size={20} />
                </>
              )}
            </button>
          </div>
        ) : null}

        <div className="flex flex-col w-[100%] max-h-[500px] overflow-y-auto">
          <div className="w-[100%] mt-2">
            {dataCart && dataCart.length == 0 ? (
              <div className="text-center py-12">
                <ShoppingCart
                  className="mx-auto text-gray-300 mb-4"
                  size={64}
                />
                <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dataCart &&
                  dataCart.map((product: ProductI) => {
                    if (product.stock != 0) {
                      return (
                        <div
                          key={`${product.idProduct}-${product.storeId}`}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 mt-3"
                        >
                          {(product as any).image_url ? (
                            <img
                              src={(product as any).image_url[0]}
                              loading="lazy"
                              alt={"Imagen"}
                              className="w-16 h-16 object-cover rounded-md cursor-pointer"
                              onClick={() => {
                                localStorage.setItem(
                                  "product",
                                  JSON.stringify(product),
                                );
                                onRouterLink(
                                  `/detailsProduct/${product.idProduct}`,
                                );
                              }}
                            />
                          ) : (
                            <img
                              src={(product as any).imageUrl[0]}
                              alt={"Imagen"}
                              loading="lazy"
                              className="w-16 h-16 object-cover rounded-md cursor-pointer"
                              onClick={() => {
                                localStorage.setItem(
                                  "product",
                                  JSON.stringify(product),
                                );
                                onRouterLink(
                                  `/detailsProduct/${product.idProduct}`,
                                );
                              }}
                            />
                          )}

                          <div className="flex-1">
                            <h3
                              className="font-semibold text-gray-800 text-sm line-clamp-2"
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Disponibles:{" "}
                              {(() => {
                                let findStockStore =
                                  product?.product_stock?.find(
                                    (branch) =>
                                      branch?.branchId == product?.storeId,
                                  );

                                return (
                                  findStockStore?.stock || product?.stock || 0
                                );
                              })()}{" "}
                              piezas.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {product.sku}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center border border-gray-300 rounded">
                              {/*Boton de menos quantity*/}
                              <button
                                onClick={() => {
                                  const updateItems = dataCart.map((item) => {
                                    if (
                                      item.idProduct === product.idProduct &&
                                      item.storeId === product?.storeId
                                    ) {
                                      const newQuantity =
                                        Number(item.quantity) > 1
                                          ? Number(item.quantity) - Number(1)
                                          : 1;

                                      return { ...item, quantity: newQuantity };
                                    }
                                    return { ...item };
                                  });

                                  setDataCart(updateItems);
                                  handleWriteStorageDataCart(updateItems);
                                }}
                                className="p-1 hover:bg-gray-100 text-gray-600"
                              >
                                <Minus size={16} />
                              </button>
                              <input
                                readOnly
                                value={(() => {
                                  // Buscamos primero en storage

                                  const itemStorage = dataCartStorege?.find(
                                    (item) =>
                                      item.idProduct === product.idProduct &&
                                      item.storeId === product.storeId,
                                  );
                                  if (itemStorage) return itemStorage.quantity;

                                  // Si no está en storage, buscamos en dataCart
                                  const itemCart = dataCart?.find(
                                    (item) =>
                                      item.idProduct === product.idProduct &&
                                      item.storeId === product.storeId,
                                  );
                                  if (itemCart) return itemCart.quantity;

                                  // Si no está en ninguno, devolvemos 1
                                  return 1;
                                })()}
                                style={{ minWidth: "45px", maxWidth: "55px" }}
                                className="px-3 py-1 text-sm font-semibold min-w-[40px] text-center"
                              />

                              {/*Boton de mas quantity*/}
                              <button
                                disabled={
                                  Number(product?.providerId) !== 1
                                    ? product.quantity >=
                                      (product?.product_stock?.find(
                                        (branch) =>
                                          branch?.branchId === product?.storeId,
                                      )?.stock || 0)
                                    : Number(product?.stock) === 0
                                }
                                onClick={() => {
                                  const stockByStore =
                                    product?.product_stock?.find(
                                      (branch) =>
                                        branch?.branchId === product?.storeId,
                                    )?.stock || 0;

                                  const updateItems = dataCart.map((item) => {
                                    if (
                                      Number(item?.providerId) !== 1 &&
                                      item.idProduct === product.idProduct &&
                                      item.storeId === product.storeId
                                    ) {
                                      const newQuantity =
                                        Number(item.quantity) + 1 <=
                                        stockByStore
                                          ? Number(item.quantity) + 1
                                          : stockByStore;

                                      return { ...item, quantity: newQuantity };
                                    } else if (
                                      Number(item?.providerId) === 1 &&
                                      item.idProduct === product.idProduct
                                    ) {
                                      const newQuantity =
                                        Number(item.quantity) + 1 <= item.stock
                                          ? Number(item.quantity) + 1
                                          : stockByStore;

                                      return { ...item, quantity: newQuantity };
                                    }

                                    return item;
                                  });

                                  setDataCart(updateItems);
                                  handleWriteStorageDataCart(updateItems);
                                }}
                                className="p-1 hover:bg-gray-100 text-gray-600"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-gray-800">
                                {formatCurrency(
                                  Number(
                                    Number(product.price) *
                                      Number(
                                        // primero busco en storage, si no está uso dataCart
                                        dataCartStorege.find(
                                          (item) =>
                                            item.idProduct ===
                                              product.idProduct &&
                                            item.storeId === product.storeId,
                                        )?.quantity ?? product.quantity,
                                      ),
                                  ),
                                )}
                              </p>

                              <button
                                onClick={() =>
                                  handleRemoveItemCart(
                                    dataCart,
                                    product,
                                    () => {},
                                  )
                                }
                                className="text-red-500 hover:text-red-700 p-1 mt-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        </div>
        {dataCart && dataCart.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                {/* <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">{formatCurrency(10)}</span> */}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {/* Envío: {shipping === 0 && <span className="text-green-600 font-semibold">¡GRATIS!</span>} */}
                </span>
                <span className="font-semibold">
                  {/* {shipping === 0 ? 'GRATIS' : formatPrice(shipping)} */}
                </span>
              </div>
              {/* {shipping > 0 && (
                        <p className="text-xs text-gray-500">
                          Envío gratis en compras mayores a $1,500
                        </p>
                      )} */}
              <div className="flex justify-between text-lg font-bold text-[#bb3d4b] border-t border-gray-300 pt-2">
                <span>Subtotal:</span>

                <span>{formatCurrency(Number(totalPrice))}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "checkout_step",
                    String(CheckoutStep.CONFIRMAR_PRODUCTOS),
                  );

                  onRouterLink("/confirma-productos");
                }}
                className="flex-1 py-3 px-4 bg-[#bb3d4b] text-white rounded-lg font-semibold transition-colors"
              >
                Proceder al pago
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Ordenes;
