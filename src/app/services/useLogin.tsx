"use client";

import { LoginI } from "@/app/interfaces/login.interface";
import { useState } from "react";
import useService from "@/app/services/useService";
import { signIn } from "next-auth/react";

const useLogin = () => {
  const [formData, setFormData] = useState<LoginI>({
    email: "",
    password: "",
  });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingLoginGoogle, setLoadingLogingGoogle] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { requestPost, returnUrl } = useService();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");

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

        localStorage.setItem("email", formData?.email || "");
        localStorage.setItem("authGoogle", "false");
        localStorage.setItem("token", data?.data?.token || data?.token || "");
        localStorage.setItem("name", data?.data?.name || "");
        localStorage.setItem("lastname", data?.data?.lastname || "");
        localStorage.setItem("idUser", data?.data?.idUser || data?.idUser);
        window.location.href = returnUrl;
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

    await signIn("google", {
      redirect: true,
      callbackUrl: callbackUrl != null ? callbackUrl : undefined,
      // callbackUrl: (callbackUrl as string) || "/principal",
    });
    setLoadingLogingGoogle(false);
    localStorage.setItem("authGoogle", "true");
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
