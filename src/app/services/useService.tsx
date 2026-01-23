"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheContext } from "./globalContext";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  GroupByIdI,
  HistoryComprasI,
} from "../interfaces/compras/historyCompras.interface";
import ProductI from "../interfaces/products/product.interface";

const useService = () => {
  const pathName = usePathname();

  const { setDataModal } = useTheContext();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  api.interceptors.response.use(
    (response) => response,
    (er) => {
      if (
        pathName != "/" &&
        pathName != "/principal" &&
        pathName != "/forgotpassword" &&
        er.response?.status == 401
      ) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiro, debes iniciar sesión nuevamente.",
          title: "Sesión expirada",
          onClose: () => {
            location.href = "/principal";
            localStorage.clear();
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            location.href = "/principal";
            localStorage.clear();

            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          type: "info",
        });

        return;
      } else if (er.response?.status != 401) {
        setDataModal({
          isOpen: true,
          message: er.response?.data.message || er?.message,
          title: "Error",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          type: "error",
        });
      }

      // else {

      //   setDataModal({
      //     isOpen: true,
      //     message:
      //       er.response?.data.message || er?.message || "Error interno del servidor",
      //     title: "Error",
      //     onClose: () => {
      //       setDataModal((prev) => ({ ...prev, isOpen: false }));
      //     },
      //     onConfirm: async () => {
      //       setDataModal((prev) => ({ ...prev, isOpen: false }));
      //     },
      //     type: "error",
      //   });
      // }
    },
  );

  const router = useRouter();

  const requestPost = async (data: any, endPoint: string) => {
    try {
      const res = await api.post(endPoint, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res;
    } catch (error: any) {
      throw error;
    }
  };

  const requestGet = async (
    endPoint: string,
    showErrorSesion: boolean = false,
  ) => {
    try {
      const res = await api.get(endPoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (error: any) {
      throw error;
    }
  };

  const requestDelete = async (endPoint: string) => {
    try {
      const res = await api.delete(endPoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res;
    } catch (error: any) {
      throw error;
    }
  };

  const onRouterLink = (route: string): void => {
    try {
      router.prefetch(route);
      router.push(route);
    } catch (error) {
      setDataModal({
        isOpen: true,
        title: "Error",
        type: "error",
        message: "Error navegando a la ruta " + route,
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      console.error("Error navegando a la ruta:", error);
    }
  };

  const onRouterHref = (route: string, blank: boolean): void => {
    if (blank) {
      window.open(route, "_blank");
    } else {
      window.location.href = route;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const handleGetAuth = async (setHasToken: any) => {
    try {
      const resp = await requestGet("/auth/getAuth", false);
      if (resp && resp.status == 200) {
        setHasToken(true);
      }
    } catch (error) {
      setHasToken(false);
    }
  };

  const Logout = () => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas cerrar sesión?",
      title: "Cerrar Sesión",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: async () => {
        await signOut({ redirect: false });
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("lastname");
        localStorage.removeItem("authGoogle");
        localStorage.removeItem("idUser");
        window.location.href = "/principal";
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      type: "info",
    });
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64)) as {
        email: string;
        idUser: string;
        rol: string;
        iat: number;
        exp: number;
      };

      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp < currentTime;
    } catch (error) {
      console.log("error al detectar expiracion del token");
      return true;
    }
  };

  const groupById = (items: any[]): any[] => {
    const map = new Map<number, any>();

    items.forEach((item) => {
      const existingGroup = map.get(item.idOrder);

      if (existingGroup) {
        // Buscar si ya existe ese producto en el grupo
        const existingProduct = existingGroup.products.find(
          (p: any) => p.idProduct === item.idProduct,
        );

        if (existingProduct) {
          existingProduct.quantity += item.quantity;
        } else {
          existingGroup.products.push({ ...item });
        }
      } else {
        map.set(item.idOrder, {
          idOrder: item.idOrder,
          userId: item.userId,
          totalSales: item.totalSales,
          totalAmount: item.totalAmount,
          pay_method: item.pay_method,
          createdAt: item.createdAt,
          status: item.status,
          statusEnvio: item.statusEnvio,
          paidAtOxxo: item.paidAtOxxo,
          shipping_method: item.shipping_method,
          stripePaymentIntentId: item.stripePaymentIntentId,
          street: item.street,
          noExt: item.noExt,
          noInt: item.noInt,
          cologne: item.cologne,
          city: item.city,
          state: item.state,
          country: item.country,
          idShipment: item.idShipment,
          updatedAt: item.updatedAt,
          products: [{ ...item }],
        });
      }
    });

    return Array.from(map.values());
  };

  function calcPesoPaquete(
    products: ProductI[],
    storeId: any,
    tipoEnvio: "terrestre" | "aereo" = "terrestre",
  ) {
    const FACTOR = tipoEnvio === "aereo" ? 6000 : 5000;

    if (typeof window === "undefined") {
      return calcularTodos(products, FACTOR, storeId);
    }

    const stored = localStorage.getItem("progressPay2");

    // Si NO hay localStorage → calcula todo
    if (!stored) {
      return calcularTodos(products, FACTOR, storeId);
    }

    let jsonParsed: any;

    try {
      jsonParsed = JSON.parse(stored);
    } catch {
      return calcularTodos(products, FACTOR, storeId);
    }

    // Si no existe optionEnvio → calcula todo
    if (!jsonParsed?.optionEnvio) {
      return calcularTodos(products, FACTOR, storeId);
    }

    const valores = Object.entries(jsonParsed.optionEnvio).flatMap(
      ([key, value]) => {
        if (value !== "paqueteexpress") return [];

        const [idProduct] = key.split("-");

        return products
          .filter((product) => Number(product.idProduct) === Number(idProduct))
          .map((product) => {
            const pesoVolumetrico =
              (product.largo * product.width * product.height) / FACTOR;

            return {
              idProduct: product.idProduct,
              pesoVolumetrico:
                Number(pesoVolumetrico.toFixed(2)) *
                Number(product.quantity ?? 1),
            };
          });
      },
    );

    // Si optionEnvio existe pero no tiene paqueteexpress → fallback
    return valores.length ? valores : calcularTodos(products, FACTOR, storeId);
  }

  function calcularTodos(products: ProductI[], factor: number, storeId: any) {
    return products && products.length > 0
      ? products.map((product) => {
          const pesoVolumetrico =
            (product.largo * product.width * product.height) / factor;

          return {
            idProduct: product.idProduct,
            storeId: storeId,
            pesoVolumetrico:
              Number(pesoVolumetrico.toFixed(2)) *
              Number(product.quantity ?? 1),
          };
        })
      : [];
  }

  const tarifasPaqueteExpress = [
    { id: 1, de: 0, a: 5, price: 303 },
    { id: 2, de: 6, a: 10, price: 329 },
    { id: 3, de: 11, a: 20, price: 396 },
  ];

  return {
    groupById,
    requestGet,
    requestPost,
    requestDelete,
    onRouterLink,
    onRouterHref,
    formatCurrency,
    Logout,
    handleGetAuth,
    isTokenExpired,
    tarifasPaqueteExpress,
    calcPesoPaquete,
  };
};

export default useService;
