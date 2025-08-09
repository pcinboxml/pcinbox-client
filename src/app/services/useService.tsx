"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheContext } from "./globalContext";

const useService = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { setDataModal } = useTheContext();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
  });

  const router = useRouter();

  const requestPost = async (data: any, endPoint: string) => {
    try {
      const res = await api.post(endPoint, data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const requestGet = async (endPoint: string) => {
    try {
      const res = await api.get(endPoint);
      return res;
    } catch (error) {
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

  const Logout = () => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas cerrar sesión?",
      title: "Cerrar Sesión",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: () => {
        localStorage.removeItem("token");
        window.location.reload();
      },
      type: "info",
    });
  };

  return {
    requestGet,
    requestPost,
    onRouterLink,
    onRouterHref,
    Logout,
  };
};

export default useService;
