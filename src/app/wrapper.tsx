"use client";

import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import Notification from "./components/notification/Notification";
import { useTheContext } from "./services/globalContext";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import ProductI from "./interfaces/products/product.interface";
import { jwtDecode } from "jwt-decode";
import useStorage from "./services/useStorage";
import useProtectedRoute from "./middleware/protectedRoute";

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

    // const handlerNewProduct = (data: ProductI) => {
    //   setDataProducts((prev) => [
    //     {
    //       idProduct: data.idProduct,
    //       idProductExt: data.idProductExt,
    //       name: data.name,
    //       description: data.description,
    //       price: data.price,
    //       stock: data.stock,
    //       sku: data.sku,
    //       rating: data.rating,
    //       imageUrl: data.imageUrl,
    //       createdAt: data.createdAt,
    //       categoryId: data.categoryId,
    //       providerId: data.providerId,
    //       caracteristicas: data.caracteristicas,
    //       quantity: data.quantity,
    //       reviews: [],
    //       upc: data.upc,
    //       isPc: data?.isPc,
    //       isPC: data?.isPC,
    //     },
    //     ...prev,
    //   ]);
    // };

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
      console.log();
      localStorage.removeItem("progressPay2");
      localStorage.setItem("dataCartStorage", JSON.stringify([]));
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
      });
    };
  }, [socketServer.current, socketPagos?.current]);

  // useEffect(() => {
  //   if (!socketCron.current) return;

  //   socketCron?.current?.on("updatedStockCron", (dataSocketCron: any) => {
  //     if (Array.isArray(dataSocketCron)) {
  //       setDataProducts((prevDataProducts) =>
  //         prevDataProducts.map((pdp) => {
  //           const findIdProduct = dataSocketCron?.find(
  //             (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
  //           );

  //           if (!findIdProduct) return pdp;

  //           const branchesEntries = findIdProduct?.branches
  //             ? Object.entries(findIdProduct.branches)
  //             : [];

  //           return {
  //             ...pdp,
  //             stock: Number(findIdProduct.stock),
  //             product_stock: pdp.product_stock?.map((xx) => {
  //               if (!xx) return xx; // por si xx es undefined
  //               const branchStock = branchesEntries.find(
  //                 ([nameBranch]) => nameBranch === xx.branches?.name,
  //               );

  //               return {
  //                 ...xx,
  //                 stock: branchStock ? Number(branchStock[1]) : xx.stock,
  //               };
  //             }),
  //           };
  //         }),
  //       );

  //       setDataCart((prevDataCart) =>
  //         prevDataCart.map((pdp) => {
  //           const findIdProduct = dataSocketCron?.find(
  //             (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
  //           );

  //           if (!findIdProduct) return pdp;

  //           const branchesEntries = findIdProduct?.branches
  //             ? Object.entries(findIdProduct.branches)
  //             : [];

  //           return {
  //             ...pdp,
  //             stock: Number(findIdProduct.stock),
  //             product_stock: pdp.product_stock?.map((xx) => {
  //               if (!xx) return xx; // por si xx es undefined
  //               const branchStock = branchesEntries.find(
  //                 ([nameBranch]) => nameBranch === xx.branches?.name,
  //               );

  //               return {
  //                 ...xx,
  //                 stock: branchStock ? Number(branchStock[1]) : xx.stock,
  //               };
  //             }),
  //           };
  //         }),
  //       );
  //       setDataFavorites((prevDataFavorites) =>
  //         prevDataFavorites.map((pdp) => {
  //           const findIdProduct = dataSocketCron?.find(
  //             (dsc) => Number(dsc?.idProduct) === Number(pdp?.productId),
  //           );

  //           if (!findIdProduct) return pdp;

  //           const branchesEntries = findIdProduct?.branches
  //             ? Object.entries(findIdProduct.branches)
  //             : [];

  //           return {
  //             ...pdp,
  //             stock: Number(findIdProduct.stock),
  //             product_stock: pdp.products?.product_stock?.map((xx) => {
  //               if (!xx) return xx; // por si xx es undefined
  //               const branchStock = branchesEntries.find(
  //                 ([nameBranch]) => nameBranch === xx.branches?.name,
  //               );

  //               return {
  //                 ...xx,
  //                 stock: branchStock ? Number(branchStock[1]) : xx.stock,
  //               };
  //             }),
  //           };
  //         }),
  //       );
  //     }
  //   });

  //   return () => {
  //     socketCron?.current?.off("updatedStockCron", (dataSocketCron: any) => {
  //       if (Array.isArray(dataSocketCron)) {
  //         setDataProducts((prevDataProducts) =>
  //           prevDataProducts.map((pdp) => {
  //             const findIdProduct = dataSocketCron?.find(
  //               (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
  //             );

  //             if (!findIdProduct) return pdp;

  //             const branchesEntries = findIdProduct?.branches
  //               ? Object.entries(findIdProduct.branches)
  //               : [];

  //             return {
  //               ...pdp,
  //               stock: Number(findIdProduct.stock),
  //               product_stock: pdp.product_stock?.map((xx) => {
  //                 if (!xx) return xx; // por si xx es undefined
  //                 const branchStock = branchesEntries.find(
  //                   ([nameBranch]) => nameBranch === xx.branches?.name,
  //                 );

  //                 return {
  //                   ...xx,
  //                   stock: branchStock ? Number(branchStock[1]) : xx.stock,
  //                 };
  //               }),
  //             };
  //           }),
  //         );

  //         setDataCart((prevDataCart) =>
  //           prevDataCart.map((pdp) => {
  //             const findIdProduct = dataSocketCron?.find(
  //               (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
  //             );

  //             if (!findIdProduct) return pdp;

  //             const branchesEntries = findIdProduct?.branches
  //               ? Object.entries(findIdProduct.branches)
  //               : [];

  //             return {
  //               ...pdp,
  //               stock: Number(findIdProduct.stock),
  //               product_stock: pdp.product_stock?.map((xx) => {
  //                 if (!xx) return xx; // por si xx es undefined
  //                 const branchStock = branchesEntries.find(
  //                   ([nameBranch]) => nameBranch === xx.branches?.name,
  //                 );

  //                 return {
  //                   ...xx,
  //                   stock: branchStock ? Number(branchStock[1]) : xx.stock,
  //                 };
  //               }),
  //             };
  //           }),
  //         );
  //         setDataFavorites((prevDataFavorites) =>
  //           prevDataFavorites.map((pdp) => {
  //             const findIdProduct = dataSocketCron?.find(
  //               (dsc) => Number(dsc?.idProduct) === Number(pdp?.productId),
  //             );

  //             if (!findIdProduct) return pdp;

  //             const branchesEntries = findIdProduct?.branches
  //               ? Object.entries(findIdProduct.branches)
  //               : [];

  //             return {
  //               ...pdp,
  //               stock: Number(findIdProduct.stock),
  //               product_stock: pdp.products?.product_stock?.map((xx) => {
  //                 if (!xx) return xx; // por si xx es undefined
  //                 const branchStock = branchesEntries.find(
  //                   ([nameBranch]) => nameBranch === xx.branches?.name,
  //                 );

  //                 return {
  //                   ...xx,
  //                   stock: branchStock ? Number(branchStock[1]) : xx.stock,
  //                 };
  //               }),
  //             };
  //           }),
  //         );
  //       }
  //     });
  //   };
  // }, [socketCron?.current]);

  // Llama al hook aquí. Se ejecutará cada vez que la ruta cambie.
  useProtectedRoute();
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
          target="_blank"
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
