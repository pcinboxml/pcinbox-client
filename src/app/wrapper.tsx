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

    return () => {
      socket.off("newProduct", handlerNewProduct);
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateCart", handleUpdateCart);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
    };
  }, [socketServer.current]);

  ProtectedRoute(pathName);

  return (
    <SessionProvider>
      {!isDesktop ? (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md mx-auto px-6">
            {/* Icon container */}
            <div className="relative mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-2xl">
                  <Monitor className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Mobile icon crossed out */}
              <div className="absolute -right-4 -bottom-2 bg-slate-800 p-3 rounded-xl border-2 border-red-500/50 shadow-lg">
                <Smartphone className="w-6 h-6 text-red-400" strokeWidth={2} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Experiencia de Escritorio
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Requerida
                </span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed">
                Esta aplicación está optimizada para pantallas grandes. Por
                favor, accede desde un escritorio o laptop.
              </p>

              {/* Decorative element */}
              <div className="pt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Diseñado para una experiencia premium</span>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </SessionProvider>
  );
}
