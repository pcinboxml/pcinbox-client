"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useTheContext } from "./globalContext";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

const useService = () => {
  const { setDataModal } = useTheContext();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    withCredentials: true,
  });

  const router = useRouter();
  const pathname = usePathname();

  const requestPost = async (data: any, endPoint: string) => {
    try {
      const res = await api.post(endPoint, data);
      return res;
    } catch (error: any) {
      if (
        pathname != "/login" &&
        pathname != "/register" &&
        error.response.status == 401
      ) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiro, debes iniciar sesión nuevamente ",
          title: "Sesión expirada",
          onClose: () => {
            onRouterLink("/login");
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            onRouterLink("/login");
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          type: "info",
        });
      }
      throw error;
    }
  };

  const requestGet = async (
    endPoint: string,
    showErrorSesion: boolean = true
  ) => {
    try {
      const res = await api.get(endPoint);

      return res;
    } catch (error: any) {
      if (
        pathname != "/login" &&
        pathname != "/register" &&
        error.response.status == 401
      ) {
        if (showErrorSesion) {
          setDataModal({
            isOpen: true,
            message: "Tu sesión expiro, debes iniciar sesión nuevamente ",
            title: "Sesión expirada",
            onClose: () => {
              onRouterLink("/login");
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
            onConfirm: async () => {
              onRouterLink("/login");
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
            type: "info",
          });
        }
      }
      throw error;
    }
  };

  const requestDelete = async (endPoint: string) => {
    try {
      const res = await api.delete(endPoint);
      return res;
    } catch (error: any) {
      if (
        pathname != "/login" &&
        pathname != "/register" &&
        error.response.status == 401
      ) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiro, debes iniciar sesión nuevamente ",
          title: "Sesión expirada",
          onClose: () => {
            onRouterLink("/login");
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            onRouterLink("/login");
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          type: "info",
        });
      }
      throw error;
    }
  };

  const onRouterLink = (route: string): void => {
    router.push(route);
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

  const Logout = () => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas cerrar sesión?",
      title: "Cerrar Sesión",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: async () => {
        try {
          const res = await requestDelete("/cookies/removeCookies");

          if (res && res.status == 200) {
            localStorage.removeItem("email");
            window.location.reload();
          }
        } catch (error) {}
      },
      type: "info",
    });
  };

  const handleLoginGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("data google user");
    console.log(user);
  };

  return {
    requestGet,
    requestPost,
    requestDelete,
    onRouterLink,
    onRouterHref,
    formatCurrency,
    Logout,
    handleLoginGoogle,
  };
};

export default useService;
