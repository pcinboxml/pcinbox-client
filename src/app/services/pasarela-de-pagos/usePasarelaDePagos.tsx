"use client";
import axios from "axios";
import { useTheContext } from "../globalContext";
import { usePathname } from "next/navigation";

const usePasarelaDePagos = () => {
  const { setDataModal } = useTheContext();
  const pathName = usePathname();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_PAGOS,
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
            //location.href = "/principal";
            localStorage.clear();
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            //location.href = "/principal";
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
    },
  );

  const requestGetPagos = async (endpoint: string, blob: boolean = false) => {
    try {
      const resp = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: blob ? "blob" : undefined,
      });
      return resp;
    } catch (error) {
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
    } catch (error) {
      throw error;
    }
  };

  return {
    requestGetPagos,
    requestPostPagos,
  };
};

export default usePasarelaDePagos;
