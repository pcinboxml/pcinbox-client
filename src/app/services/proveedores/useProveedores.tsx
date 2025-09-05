"use client";
import axios from "axios";
import { useTheContext } from "../globalContext";

const useProveedores = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_PROVEEDOR,
    //withCredentials: true,
  });

  const { setDataModal } = useTheContext();

  const requestGetProducts = async (showErrorSesion: boolean = false) => {
    try {
      const res = await api.get("/getAllProduct");

      return res;
    } catch (error: any) {
      if (error.response.status == 401) {
        if (showErrorSesion) {
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
      }
      throw error;
    }
  };

  const requestPostProveedor = async (data: any, endPoint: string) => {
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

  return {
    requestGetProducts,
    requestPostProveedor,
  };
};

export default useProveedores;
