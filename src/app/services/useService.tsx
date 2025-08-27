"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheContext } from "./globalContext";
import { signOut } from "next-auth/react";

const useService = () => {
  const { setDataModal } = useTheContext();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  api.defaults.headers.common["ngrok-skip-browser-warning"] = "any";

  const router = useRouter();

  const requestPost = async (data: any, endPoint: string) => {
    try {
      const res = await api.post(endPoint, data);
      return res;
    } catch (error: any) {
      if (error.response.status == 401) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiro, debes iniciar sesión nuevamente ",
          title: "Sesión expirada",
          onClose: () => {
            window.location.reload();

            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            window.location.reload();

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
    showErrorSesion: boolean = false
  ) => {
    try {
      const res = await api.get(endPoint);

      return res;
    } catch (error: any) {
      if (error.response.status == 401) {
        // if (showErrorSesion) {
        //   setDataModal({
        //     isOpen: true,
        //     message: "Tu sesión expiro, debes iniciar sesión nuevamente ",
        //     title: "Sesión expirada",
        //     onClose: () => {
        //       window.location.reload();
        //       setDataModal((prev) => ({ ...prev, isOpen: false }));
        //     },
        //     onConfirm: async () => {
        //       window.location.reload();
        //       setDataModal((prev) => ({ ...prev, isOpen: false }));
        //     },
        //     type: "info",
        //   });
        // }
      }
      throw error;
    }
  };

  const requestDelete = async (endPoint: string) => {
    try {
      const res = await api.delete(endPoint);
      return res;
    } catch (error: any) {
      if (error.response.status == 401) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiro, debes iniciar sesión nuevamente ",
          title: "Sesión expirada",
          onClose: () => {
            window.location.reload();

            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            window.location.reload();

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

  const handleGetCookie = async (setHasToken: any) => {
    try {
      const resp = await requestGet("/cookies/getCookie", false);
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
        try {
          const res = await requestDelete("/cookies/removeCookies");

          if (res && res.status == 200) {
            signOut();
            localStorage.removeItem("email");
            window.location.reload();
          }
        } catch (error) {}
      },
      type: "info",
    });
  };

  return {
    requestGet,
    requestPost,
    requestDelete,
    onRouterLink,
    onRouterHref,
    formatCurrency,
    Logout,
    handleGetCookie,
  };
};

export default useService;
