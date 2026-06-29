"use client";

import { LoginI } from "@/app/interfaces/login.interface";
import { useState } from "react";
import useService from "@/app/services/useService";
import { useTheContext } from "@/app/services/globalContext";
import { signIn } from "next-auth/react";
import { setAuthSession } from "@/app/utils/authStorage";

const useLogin = () => {
  const [formData, setFormData] = useState<LoginI>({
    email: "",
    password: "",
  });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingLoginGoogle, setLoadingLogingGoogle] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { requestPost } = useService();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");
  const { setTotalFavorites } = useTheContext();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formData.email ||
      formData.email == "" ||
      !formData.password ||
      formData.password == ""
    ) {
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setMessageError(
        `El correo ${formData.email} no tiene el formato correcto`,
      );

      return;
    }

    setLoadingLogin(true);

    try {
      const res = await requestPost(formData, "/user/login");
      setLoadingLogin(false);

      if (res && res.status == 200) {
        const data = await res.data;

        setAuthSession({
          token: data?.data?.token || data?.token || "",
          idUser: data?.data?.idUser || data?.idUser,
          email: formData?.email || "",
          name: data?.data?.name || "",
          lastname: data?.data?.lastname || "",
          authGoogle: false,
        });
        setTotalFavorites(data?.data?.totalFavorites);
        window.location.href = "/principal";
      }
    } catch (error: any) {
      console.log(error);
      setShowAlert(true);

      setLoadingLogin(false);
      setMessageError(
        error?.response?.data?.message ||
          error?.message ||
          "Error interno del servidor",
      );
    }
  };

  const onLoginGoogle = async (callbackUrl?: string) => {
    setLoadingLogingGoogle(true);
    document.cookie = "mode=login; path=/";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("authGoogle", "true");
    }

    const defaultCallback =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/principal"
        : undefined;

    await signIn("google", {
      redirect: true,
      callbackUrl: callbackUrl ?? defaultCallback,
    });
    setLoadingLogingGoogle(false);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setMessageError("");
  };

  return {
    formData,
    loadingLogin,
    showPassword,
    showAlert,
    messageError,
    loadingLoginGoogle,
    onSubmit,
    setFormData,
    setShowPassword,
    closeAlert,
    onLoginGoogle,
  };
};

export default useLogin;
