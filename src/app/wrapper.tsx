"use client";

import useCart from "./components/cart/useCart";
import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import useNavbar from "./components/navbar/useNavbar";
import Notification from "./components/notification/Notification";
import { useTheContext } from "./services/globalContext";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./middleware/protectedRoute";
import { FaWhatsapp } from "react-icons/fa";
import ProductI from "./interfaces/products/product.interface";
import { Monitor, Smartphone } from "lucide-react";

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
    setDataCart,
    setDataProducts,
    setDataFavorites,
    socketServer,
    socketPagos,
  } = useTheContext();

  const { addProductFromStorage } = useCart();
  const { handleGetDataCart } = useNavbar();

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

    socket.on("updateProductComponent", handlerUpdateProductComponent);

    socket.on("newProduct", handlerNewProduct);
    socket.on("updateProduct", handlerUpdateProduct);

    socket.on("updateCart", handleUpdateCart);

    socketPagos?.current?.on(
      "removeProgressPay",
      (dataSocket: { idUser: number }) => {
        if (typeof window !== "undefined") {
          const idUser = localStorage.getItem("idUser");
          if (idUser) {
            if (Number(idUser) == Number(dataSocket.idUser)) {
              localStorage.removeItem("progressPay");
            }
          }
        }
      }
    );

    return () => {
      socket.off("newProduct", handlerNewProduct);
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateCart", handleUpdateCart);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      socketPagos?.current?.off(
        "removeProgressPay",
        (dataSocket: { idUser: number }) => {
          if (typeof window !== "undefined") {
            const idUser = localStorage.getItem("idUser");
            if (idUser) {
              if (Number(idUser) == Number(dataSocket.idUser)) {
                localStorage.removeItem("progressPay");
              }
            }
          }
        }
      );
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
        {pathName != "/estatusPay" &&
          pathName != "/terminos_y_condiciones" &&
          pathName != "/aviso_privacidad" && <Navbar />}
        <main className="container" style={{ marginTop: "180px" }}>
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

          {pathName != "/estatusPay" &&
            pathName != "/terminos_y_condiciones" &&
            pathName != "/aviso_privacidad" && <Footer />}
          {pathName != "/estatusPay" &&
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
