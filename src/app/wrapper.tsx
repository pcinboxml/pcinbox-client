"use client";

import useCart from "./components/cart/useCart";
import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/ModalComponent";
import Navbar from "./components/navbar/navbar";
import useNavbar from "./components/navbar/useNavbar";
import Notification from "./components/notification/Notification";
import { useTheContext } from "./services/globalContext";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./middleware/protectedRoute";
import { FaWhatsapp } from "react-icons/fa";
import ProductI from "./interfaces/products/product.interface";

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
    socketServer,
  } = useTheContext();

  const { addProductFromStorage } = useCart();
  const { handleGetDataCart } = useNavbar();

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
    if (!socketServer?.current) return;

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
        },
        ...prev,
      ]);
    };

    const handlerUpdateProduct = (data: ProductI) => {
      setDataProducts((prev) =>
        prev.map((item) =>
          item.idProduct == data.idProduct
            ? { ...item, stock: data.stock, price: data.price }
            : item
        )
      );
    };

    socket.on("newProduct", handlerNewProduct);
    socket.on("updateProduct", handlerUpdateProduct);

    return () => {
      socket.off("newProduct", handlerNewProduct);
      socket.off("updateProduct", handlerUpdateProduct);
    };
  }, [socketServer.current]);

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
