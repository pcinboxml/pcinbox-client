"use client";
import axios from "axios";
import { useTheContext } from "../globalContext";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { publicEnv } from "@/app/config/env";

const usePasarelaDePagos = () => {
  const { setDataModal } = useTheContext();
  const pathName = usePathname();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: publicEnv.apiUrlPagos,
    });

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
  const requestGetPagos = async (endpoint: string, blob: boolean = false) => {
    try {
      const resp = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: blob ? "blob" : undefined,
      });
      return resp;
    } catch (error: any) {
      if (error?.response?.status === 401) {
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
      throw error;
    }
  };

  const requestPostPagos = async (data: any, endpoint: string) => {
    try {
      const resp = await api.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return resp;
    } catch (error: any) {
      if (error?.response?.status === 401) {
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
      throw error;
    }
  };

  return {
    requestGetPagos,
    requestPostPagos,
  };
};

export default usePasarelaDePagos;
