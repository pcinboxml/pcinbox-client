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
import useFavorites from "./services/useFavorites";
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
    if (!socketServer.current) return;

    const handler = (data: ProductI) => {
      setDataProducts((prev) => [
        {
          idProduct: data.idProduct.toString(),
          idProductExt: data.idProductExt,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: Number(data.stock),
          sku: data.sku,
          rating: Number(data.rating),
          imageUrl: data.imageUrl || (data as any).image_url,
          createdAt: data.createdAt,
          categoryId: data?.categoryId ? data.categoryId.toString() : "1",
          providerId: data.providerId.toString(),
          quantity: 0,
          reviews: [],
        },
        ...prev,
      ]);
    };

    socketServer.current.on("newProduct", handler);

    return () => {
      socketServer.current?.off("newProduct", handler);
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
        <Navbar />
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
          <Footer />
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
