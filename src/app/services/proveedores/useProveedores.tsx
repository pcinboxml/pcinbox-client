"use client";
import axios from "axios";
import { useTheContext } from "../globalContext";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const useProveedores = () => {
  const { setDataModal } = useTheContext();

  const pathName = usePathname();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL_PROVEEDOR,
    });

    // // ✅ AGREGA TOKEN AUTOMATICAMENTE
    // instance.interceptors.request.use(
    //   (config) => {
    //     if (typeof window !== "undefined") {
    //       const token = localStorage.getItem("token");

    //       if (token) {
    //         config.headers.Authorization = `Bearer ${token}`;
    //       }
    //     }

    //     return config;
    //   },
    //   (error) => Promise.reject(error),
    // );

    // ✅ MANEJO DE ERRORES
    instance.interceptors.response.use(
      (response) => response,
      (er) => {
        // if (
        //   pathName != "/" &&
        //   pathName != "/principal" &&
        //   pathName != "/forgotpassword" &&
        //   er.response?.status == 401
        // ) {
        //   setDataModal({
        //     isOpen: true,
        //     message: "Tu sesión expiró, debes iniciar sesión nuevamente.",
        //     title: "Sesión expirada",

        //     onClose: () => {
        //       setDataModal((prev) => ({
        //         ...prev,
        //         isOpen: false,
        //       }));
        //     },

        //     onConfirm: async () => {
        //       setDataModal((prev) => ({
        //         ...prev,
        //         isOpen: false,
        //       }));
        //     },

        //     type: "info",
        //   });
        // } else
        if (er.response?.status != 401) {
          setDataModal({
            isOpen: true,
            message:
              er.response?.data.message ||
              er?.message ||
              "Error interno del servidor",

            title: "Error",

            onClose: () => {
              setDataModal((prev) => ({
                ...prev,
                isOpen: false,
              }));
            },

            onConfirm: async () => {
              setDataModal((prev) => ({
                ...prev,
                isOpen: false,
              }));
            },

            type: "error",
          });
        }

        // ✅ IMPORTANTE
        return Promise.reject(er);
      },
    );

    return instance;
  }, [pathName, setDataModal]);

  const requestGetProducts = async (showErrorSesion: boolean = false) => {
    try {
      const res = await api.get("/getAllProduct", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (error: any) {
      if (error.response.status === 401) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiró, debes iniciar sesión nuevamente.",
          title: "Sesión expirada",

          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          onConfirm: async () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          type: "info",
        });
      } else {
        setDataModal({
          isOpen: true,
          message: "Error interno del servidor",
          title: "Error",

          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          onConfirm: async () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          type: "info",
        });
      }

      //throw error;
    }
  };

  const requestGetProveedor = async (endpoint: string) => {
    try {
      const res = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (error: any) {
      if (error.response.status === 401) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiró, debes iniciar sesión nuevamente.",
          title: "Sesión expirada",

          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          onConfirm: async () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          type: "info",
        });
      } else {
        setDataModal({
          isOpen: true,
          message: "Error interno del servidor",
          title: "Error",

          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          onConfirm: async () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          type: "info",
        });
      }

      //throw error;
    }
  };

  const requestPostProveedor = async (data: any, endPoint: string) => {
    try {
      const res = await api.post(endPoint, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res;
    } catch (error: any) {
      if (error.response.status === 401) {
        setDataModal({
          isOpen: true,
          message: "Tu sesión expiró, debes iniciar sesión nuevamente.",
          title: "Sesión expirada",

          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          onConfirm: async () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          type: "info",
        });
      } else {
        setDataModal({
          isOpen: true,
          message: "Error interno del servidor",
          title: "Error",

          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          onConfirm: async () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },

          type: "info",
        });
      }

      //console.log(error);
      //  throw error;
    }
  };

  return {
    requestGetProducts,
    requestPostProveedor,
    requestGetProveedor,
  };
};

export default useProveedores;
