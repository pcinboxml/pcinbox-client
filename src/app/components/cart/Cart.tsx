"use client";

import "./cart.css";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import ProductI from "@/app/interfaces/products/product.interface";
import { useMemo } from "react";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useCart from "./useCart";
import { MdAutorenew, MdClose } from "react-icons/md";

export const Cart = () => {
  return <img src="/carrito.png" />;
};

export const ModalCart = ({
  onMouseLeaveCart,
  showDivCart,
}: {
  onMouseLeaveCart: any;
  showDivCart: boolean;
}) => {
  const { dataCart, setDataCart } = useTheContext();
  const { formatCurrency, onRouterLink } = useService();
  const { handleRemoveItemCart, handleRemoveAllCart, loadingRmAllCart } =
    useCart();

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  return (
    <div
      className="fixed inset-0 z-90  bg-black bg-opacity-50"
      style={{
        display: showDivCart ? "block" : "none",
      }}
    >
      <div
        className="bg-white flex flex-col rounded-lg shadow-xl cursor-default"
        style={{
          position: "absolute",
          top: "50px",
          right: "120px",
          width: "500px",
        }}
        onMouseLeave={() => {
          onMouseLeaveCart();
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 relative  w-full">
            <h5 className="text-xl font-bold text-gray-800">
              {/* Mi Carrito ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}) */}
              Mi carrito
            </h5>
            <button
              style={{ position: "absolute", right: "5px", top: "5px" }}
              onClick={() => onMouseLeaveCart()}
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        {dataCart && dataCart.length > 0 ? (
          <div className="w-full flex justify-end py-2 px-2">
            <button
              className="border flex justify-center items-center p-2"
              disabled={loadingRmAllCart}
              onClick={() => handleRemoveAllCart(dataCart, onMouseLeaveCart)}
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

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-4 contentCart"
          style={{
            height: "45vh",
            maxHeight: "60vh",
          }}
        >
          {dataCart && dataCart.length == 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dataCart &&
                dataCart.map((product: ProductI, index: number) => (
                  <div
                    key={product.idProduct + index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 mt-3"
                  >
                    {(product as any).image_url ? (
                      <img
                        src={(product as any).image_url[0]}
                        alt={"Imagen"}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer"
                        onClick={() => {
                          localStorage.setItem(
                            "product",
                            JSON.stringify(product)
                          );
                          onRouterLink("/detailsProduct");
                        }}
                      />
                    ) : (
                      <img
                        src={(product as any).imageUrl[0]}
                        alt={"Imagen"}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer"
                        onClick={() => {
                          localStorage.setItem(
                            "product",
                            JSON.stringify(product)
                          );
                          onRouterLink("/detailsProduct");
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
                        Disponibles: {product.stock} piezas.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        SKU: {"CO547-S"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => {
                            const updateItems = dataCart.map((item) => {
                              if (item.idProduct === product.idProduct) {
                                const newQuantity =
                                  Number(item.quantity) > 1
                                    ? Number(item.quantity) - Number(1)
                                    : 1;

                                return { ...item, quantity: newQuantity };
                              }
                              return { ...item };
                            });

                            setDataCart(updateItems);
                          }}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          readOnly
                          value={
                            dataCart.find(
                              (item) => item.idProduct === product.idProduct
                            )?.quantity || 1
                          }
                          style={{ minWidth: "45px", maxWidth: "55px" }}
                          className="px-3 py-1 text-sm font-semibold min-w-[40px] text-center"
                        />

                        <button
                          onClick={() => {
                            const updateItems = dataCart.map((item) => {
                              return item.idProduct === product.idProduct
                                ? {
                                    ...item,
                                    quantity:
                                      Number(item.quantity) + Number(1) <=
                                      product.stock
                                        ? Number(item.quantity) + Number(1)
                                        : product.stock,
                                  }
                                : { ...item };
                            });

                            setDataCart(updateItems);
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
                              Number(product.price) * Number(product.quantity)
                            )
                          )}
                        </p>
                        <button
                          onClick={() =>
                            handleRemoveItemCart(
                              dataCart,
                              product,
                              onMouseLeaveCart
                            )
                          }
                          className="text-red-500 hover:text-red-700 p-1 mt-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer with totals and actions */}
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
                onClick={() => onMouseLeaveCart()}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
              >
                Seguir comprando
              </button>
              <button
                onClick={async () => {
                  await onRouterLink("/confirma-productos");
                  onMouseLeaveCart();
                }}
                className="flex-1 py-3 px-4 bg-[#bb3d4b] text-white rounded-lg font-semibold transition-colors"
              >
                Proceder al pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
