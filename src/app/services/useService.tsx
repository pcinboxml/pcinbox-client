"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

const useService = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
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

  const onRouterHref = (route: string): void => {
    router.push(route);
  };

  const onRouterLink = (route: string, blank: boolean): void => {
    if (blank) {
      window.open(route, "_blank");
    } else {
      window.location.href = route;
    }
  };

  return {
    requestPost,
    onRouterLink,
  };
};

export default useService;
