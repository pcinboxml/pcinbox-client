"use client";

import useCart from "./components/cart/useCart";
import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import useNavbar from "./components/navbar/useNavbar";
import Notification from "./components/notification/Notification";
import { useTheContext } from "./services/globalContext";
import { SessionProvider } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./middleware/protectedRoute";
import { FaWhatsapp } from "react-icons/fa";
import ProductI from "./interfaces/products/product.interface";
import { Monitor, Smartphone } from "lucide-react";
import useStorage from "./services/useStorage";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const {
    dataModal,
    dataNotification,
    hasToken,
    dataCart,
    setDataCart,
    setDataProducts,
    setDataFavorites,
    socketServer,
    socketPagos,
  } = useTheContext();

  const { addProductFromStorage } = useCart();
  const { handleGetDataCart } = useNavbar();
  const { handleWriteStorageProgressPay } = useStorage();
  const isMounted = useRef(false);

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      // Solo permitir pantallas grandes (desktop)
      setIsDesktop(width >= 1024);
    };

    checkWidth(); // al cargar
    window.addEventListener("resize", checkWidth); // al redimensionar

    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  useEffect(() => {
    if (localStorage.getItem("dataCart") && hasToken == false) {
      const productsStorage = JSON.parse(
        localStorage.getItem("dataCart") || ""
      );

      setDataCart(productsStorage);
    } else if (hasToken == true) {
      addProductFromStorage().then(async (resp) => {
        await handleGetDataCart();
      });
    }
  }, [hasToken]);

  const totalPrice = useMemo(() => {
    if (!dataCart) return 0;

    const total = dataCart
      .filter((item) => item.stock !== 0)
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (dataCart?.length > 0 && totalPrice <= 1000) {
      handleWriteStorageProgressPay({
        optionSend: {
          address: 0,
          name: "sucursal",
          costo: 0,
        },
      });
    }
  }, [totalPrice, dataCart]);

  useEffect(() => {
    if (!socketServer.current) return;
    if (!socketPagos.current) return;

    const socket = socketServer.current;

    const handlerNewProduct = (data: ProductI) => {
      setDataProducts((prev) => [
        {
          idProduct: data.idProduct,
          idProductExt: data.idProductExt,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          sku: data.sku,
          rating: data.rating,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt,
          categoryId: data.categoryId,
          providerId: data.providerId,
          caracteristicas: data.caracteristicas,
          quantity: data.quantity,
          reviews: [],
          upc: data.upc,
        },
        ...prev,
      ]);
    };

    const handlerUpdateProduct = (data: ProductI) => {
      setDataProducts((prev) =>
        prev.map((item) => {
          const match = Number(item.idProduct) === Number(data.idProduct);

          return match
            ? {
                ...item,
                name: data.name,
                description: data.description,
                caracteristicas: data.caracteristicas,
                price: Number(data.price).toString(),
                stock: Number(data.stock),
                sku: data.sku,
              }
            : item;
        })
      );

      setDataFavorites((prevFavorites) => {
        return prevFavorites.map((item: any) => {
          const match = Number(item.idProduct) === Number(data.idProduct);

          return match
            ? {
                ...item,
                products: {
                  ...item.products,
                  name: data.name,
                  description: data.description,
                  caracteristicas: data.caracteristicas,
                  price: Number(data.price).toString(),
                  stock: Number(data.stock),
                  sku: data.sku,
                },
              }
            : item;
        });
      });
    };

    const handleUpdateCart = (dataSocketCart: any) => {
      setDataCart((prevCart) => {
        return prevCart.map((item) => {
          const match =
            Number(item.idProduct) === Number(dataSocketCart?.idProduct);

          return match
            ? {
                ...item,
                stock: Number(dataSocketCart?.stock),
                price: Number(dataSocketCart?.price).toString(),
              }
            : item;
        });
      });
    };

    const handlerUpdateProductComponent = (dataSocket: ProductI) => {
      setDataProducts((prev) =>
        prev.map((item) => {
          const match = Number(item.idProduct) === Number(dataSocket.idProduct);

          return match
            ? {
                ...item,
                name: dataSocket.name,
                description: dataSocket.description,
                caracteristicas: dataSocket.caracteristicas,
                price: Number(dataSocket.price).toString(),
                stock: Number(dataSocket.stock),
                sku: dataSocket.sku,
              }
            : item;
        })
      );
      setDataFavorites((prevFavorites) => {
        return prevFavorites.map((item: any) => {
          // Aquí comparamos con la estructura correcta:
          const match = Number(item.productId) == Number(dataSocket.idProduct);

          return match
            ? {
                ...item,
                products: {
                  ...item.products,
                  stock: Number(dataSocket.stock),
                  price: Number(dataSocket.price).toString(),
                },
              }
            : item;
        });
      });
    };

    const handleUpdatedStock = (
      dataSocket: { idProduct: number; stock: Number }[]
    ) => {
      setDataProducts((prev) =>
        prev.map((item) => {
          let findIdProduct = dataSocket.find(
            (dSocket) => Number(dSocket.idProduct) === Number(item.idProduct)
          );

          if (findIdProduct) {
            return {
              ...item,
              stock:
                item?.stock == 0
                  ? 0
                  : Number(item?.stock - Number(findIdProduct.stock)),
            };
          }

          return item;
        })
      );
      setDataFavorites((prevFavorites) => {
        return prevFavorites.map((item: any) => {
          let findIdProduct = dataSocket.find(
            (dSocket) => Number(dSocket.idProduct) === Number(item.productId)
          );

          if (findIdProduct) {
            return {
              ...item,
              products: {
                ...item.products,
                stock:
                  item?.stock == 0
                    ? 0
                    : Number(item?.stock - Number(findIdProduct.stock)),
              },
            };
          } else {
            return item;
          }
        });
      });

      setDataCart((prevCart) => {
        return prevCart.map((item) => {
          let findIdProduct = dataSocket.find(
            (dSocket) => Number(dSocket.idProduct) === Number(item.idProduct)
          );

          if (findIdProduct) {
            return {
              ...item,
              stock:
                item?.stock == 0
                  ? 0
                  : Number(item?.stock - Number(findIdProduct.stock)),
            };
          } else {
            return item;
          }
        });
      });
    };

    socket.on("updateProductComponent", handlerUpdateProductComponent);

    socket.on("newProduct", handlerNewProduct);
    socket.on("updateProduct", handlerUpdateProduct);

    socket.on("updateCart", handleUpdateCart);

    // socketPagos?.current?.on(
    //   "removeProgressPay",
    //   (dataSocket: { idUser: number }) => {
    //     if (typeof window !== "undefined") {
    //       const idUser = localStorage.getItem("idUser");
    //       if (idUser) {
    //         if (Number(idUser) == Number(dataSocket.idUser)) {
    //           localStorage.removeItem("progressPay");
    //         }
    //       }
    //     }
    //   }
    // );

    return () => {
      socket.off("newProduct", handlerNewProduct);
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateCart", handleUpdateCart);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      // socketPagos?.current?.off(
      //   "removeProgressPay",
      //   (dataSocket: { idUser: number }) => {
      //     if (typeof window !== "undefined") {
      //       const idUser = localStorage.getItem("idUser");
      //       if (idUser) {
      //         if (Number(idUser) == Number(dataSocket.idUser)) {
      //           localStorage.removeItem("progressPay");
      //         }
      //       }
      //     }
      //   }
      // );
    };
  }, [socketServer.current, socketPagos?.current]);

  ProtectedRoute(pathName);

  return (
    <SessionProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {pathName != "/estatusMP" &&
          pathName != "/estatusPay" &&
          pathName != "/terminos_y_condiciones" &&
          pathName != "/aviso_privacidad" && <Navbar />}
        <main
          className={
            pathName != "/estatusMP" && pathName != "/estatusPay"
              ? "container"
              : ""
          }
          style={
            pathName != "/estatusMP" && pathName != "/estatusPay"
              ? { marginTop: "180px" }
              : {}
          }
        >
          {children}

          <ModalComponent
            isOpen={dataModal.isOpen}
            title={dataModal.title}
            message={dataModal.message}
            onConfirm={() => dataModal.onConfirm()}
            onClose={() => dataModal.onClose()}
            type={dataModal.type}
            children={dataModal.children}
            showActions={dataModal.showActions}
          />

          <Notification dataNotification={dataNotification} />

          {pathName != "/estatusMP" &&
            pathName != "/estatusPay" &&
            pathName != "/terminos_y_condiciones" &&
            pathName != "/aviso_privacidad" && <Footer />}

          {pathName != "/estatusMP" &&
            pathName != "/estatusPay" &&
            pathName != "/terminos_y_condiciones" &&
            pathName != "/aviso_privacidad" && (
              <>
                <span className="block mx-auto my-2 text-center text-[13px]">
                  © {new Date().getFullYear().toString()} PCinBOX Todos los
                  derechos reservados, México.
                </span>
              </>
            )}
        </main>

        <a
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            textDecoration: "none",
            background: "white",
            borderRadius: "5px",
          }}
          href="https://wa.me/message/W345O6QEZDJEP1?src=qr"
        >
          <FaWhatsapp
            size={45}
            style={{ color: "#25D366", fontSize: "2rem" }}
          />
        </a>
      </div>
    </SessionProvider>
  );
}
