"use client";

import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import Notification from "./components/notification/Notification";
import { useTheContext } from "./services/globalContext";
import { SessionProvider } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import ProductI from "./interfaces/products/product.interface";
import { jwtDecode } from "jwt-decode";
import useStorage from "./services/useStorage";
import useProtectedRoute from "./middleware/protectedRoute";
import NavbarResponsive from "./components/navbarMobile/NavbarMobile";
import { useScrollRestoration } from "./services/useScrollRestauration";
import BtnFloat from "./components/UI/BtnFloat/BtnFloat";
import useService from "./services/useService";
import BtnAndroide from "./components/UI/BtnAndroide/BtnAndroide";

export default function AppWrapper({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [marginTop, setMarginTop] = useState("50px");

  const scrollRef = useRef<HTMLDivElement>(null);

  const pathName = usePathname();
  const { requestGet } = useService();

  const {
    totalFavorites,
    setTotalFavorites,
    dataModal,
    dataNotification,
    hasToken,
    dataCart,
    setDataCart,
    //setDataProducts,
    setDataFavorites,
    socketServer,
    socketPagos,
    // socketCron,
  } = useTheContext();

  const { dataCartStorege } = useStorage();

  useEffect(() => {
    if (dataCart && hasToken) {
      localStorage.setItem("dataCartStorage", JSON.stringify(dataCart));
      setDataCart(dataCart);
    }
  }, [dataCart, hasToken, dataCartStorege]);

  useEffect(() => {
    if (!socketPagos.current) return;

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token || typeof token !== "string") return;
    const payload: any = jwtDecode(token);

    if (!socketPagos.current || !payload?.idUser) return;

    if (token) {
      const payload: any = jwtDecode(token);

      if (payload && payload?.idUser) {
        socketPagos?.current?.emit("idUser", `user-${payload?.idUser}`);
      }

      const joinRoom = () => {
        socketPagos?.current?.emit("idUser", `user-${payload.idUser}`);
      };

      socketPagos.current?.on("connect", joinRoom);

      // si ya está conectado
      if (socketPagos.current?.connected) {
        joinRoom();
      }
    }

    return () => {
      socketPagos?.current?.off("connect", () => {
        socketPagos?.current?.emit("idUser", `user-${payload.idUser}`);
      });
    };
  }, [socketPagos?.current, hasToken]);

  useEffect(() => {
    if (!socketServer.current) return;
    if (!socketPagos.current) return;

    const socket = socketServer.current;

    const handlerUpdateProduct = (data: ProductI) => {
      // setDataProducts((prev) =>
      //   prev.map((item) => {
      //     const match = Number(item.idProduct) === Number(data.idProduct);

      //     return match
      //       ? {
      //           ...item,
      //           name: data.name,
      //           description: data.description,
      //           caracteristicas: data.caracteristicas,
      //           price: Number(data.price).toString(),
      //           stock: Number(data.stock),
      //           sku: data.sku,
      //         }
      //       : item;
      //   }),
      // );

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
      // setDataProducts((prev) =>
      //   prev.map((item) => {
      //     const match = Number(item.idProduct) === Number(dataSocket.idProduct);

      //     return match
      //       ? {
      //           ...item,
      //           name: dataSocket.name,
      //           description: dataSocket.description,
      //           caracteristicas: dataSocket.caracteristicas,
      //           price: Number(dataSocket.price).toString(),
      //           stock: Number(dataSocket.stock),
      //           sku: dataSocket.sku,
      //         }
      //       : item;
      //   }),
      // );
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
      dataSocket: { idProduct: number; stock: Number }[],
    ) => {
      // setDataProducts((prev) =>
      //   prev.map((item) => {
      //     let findIdProduct = dataSocket.find(
      //       (dSocket) => Number(dSocket.idProduct) === Number(item.idProduct),
      //     );

      //     if (findIdProduct) {
      //       return {
      //         ...item,
      //         stock:
      //           item?.stock == 0
      //             ? 0
      //             : Number(item?.stock - Number(findIdProduct.stock)),
      //       };
      //     }

      //     return item;
      //   }),
      // );
      setDataFavorites((prevFavorites) => {
        return prevFavorites.map((item: any) => {
          let findIdProduct = dataSocket.find(
            (dSocket) => Number(dSocket.idProduct) === Number(item.productId),
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
            (dSocket) => Number(dSocket.idProduct) === Number(item.idProduct),
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

    //socket.on("newProduct", handlerNewProduct);
    socket.on("updateProduct", handlerUpdateProduct);

    socket.on("updateCart", handleUpdateCart);

    socketPagos?.current?.on("updatedStock", handleUpdatedStock);

    socketPagos?.current?.on("removeStorageProgressPay2", () => {
      localStorage.removeItem("progressPay2");
      localStorage.setItem("dataCartStorage", JSON.stringify([]));
      localStorage.removeItem("buyNowProduct");
      localStorage.removeItem("checkout_mode");
      localStorage.removeItem("checkout_products_snapshot");
      localStorage.removeItem("checkout_step");
    });

    return () => {
      // socket.off("newProduct", handlerNewProduct);
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateCart", handleUpdateCart);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      socketPagos?.current?.off("updatedStock", handleUpdatedStock);
      socketPagos?.current?.off("removeStorageProgressPay2", () => {
        localStorage.removeItem("progressPay2");
        localStorage.setItem("dataCartStorage", JSON.stringify([]));
        localStorage.removeItem("buyNowProduct");
        localStorage.removeItem("checkout_mode");
        localStorage.removeItem("checkout_products_snapshot");
        localStorage.removeItem("checkout_step");
      });
    };
  }, [socketServer.current, socketPagos?.current]);

  const pathname = usePathname();
  const storageKey = "scroll-/result-search-category";

  // Guardar scroll solo si estamos en la ruta
  useEffect(() => {
    if (!pathname.startsWith("/result-search-category")) return;

    const handleScroll = () => {
      if (scrollRef.current) {
        sessionStorage.setItem(
          storageKey,
          scrollRef.current.scrollTop.toString(),
        );
      }
    };

    const currentDiv = scrollRef.current;
    currentDiv?.addEventListener("scroll", handleScroll);

    return () => {
      currentDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, storageKey]);

  // Restaurar scroll solo si estamos en la ruta
  // Restaurar scroll solo si estamos en la ruta
  useEffect(() => {
    if (!pathname.startsWith("/result-search-category")) return;
    if (!scrollRef.current) return;

    const savedScroll = Number(sessionStorage.getItem(storageKey)) || 0;

    const restoreScroll = () => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;

      // Si el contenido tiene suficiente altura
      if (container.scrollHeight >= savedScroll) {
        container.scrollTo({ top: savedScroll, behavior: "auto" });
      } else {
        // Espera al siguiente frame y reintenta
        requestAnimationFrame(restoreScroll);
      }
    };

    restoreScroll();
  }, [pathname, storageKey]);
  useEffect(() => {
    const getTotalFavorites = async () => {
      try {
        const resp = await requestGet("/favorites/getTotalFavorites");

        if (resp.status === 200) {
          setTotalFavorites(resp.data.data.totalFavorites);
        }
      } catch (error) {}
    };

    getTotalFavorites();
  }, [totalFavorites]);

  useEffect(() => {
    setMarginTop(
      pathName.startsWith("/result-search-category") ? "10px" : "50px",
    );
  }, [pathName]);

  // En el JSX:
  <main style={{ marginTop }}></main>;
  useProtectedRoute();

  useScrollRestoration(scrollRef);

  return (
    <SessionProvider>
      <div
        {...props}
        ref={scrollRef}
        id="scroll-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {pathName != "/estatusMP" &&
          pathName != "/estatusPay" &&
          pathName != "/terminos_y_condiciones" &&
          pathName != "/aviso_privacidad" && <NavbarResponsive />}
        <main
          style={{
            marginTop: marginTop,
          }}
          className={
            pathName !== "/estatusMP" && pathName !== "/estatusPay"
              ? "container main-content"
              : ""
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

          {/* <Notification dataNotification={dataNotification} /> */}

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

        <BtnAndroide />
        <BtnFloat />
      </div>
    </SessionProvider>
  );
}
