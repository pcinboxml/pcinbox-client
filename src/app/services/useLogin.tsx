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
  const { requestPost } = useService();
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
        `El correo ${formData.email} no tiene el formato correcto`
      );

      return;
    }

    setLoadingLogin(true);

    try {
      const res = await requestPost(formData, "/user/login");
      setLoadingLogin(false);

      if (res && res.status == 200) {
        window.location.reload();
      }
    } catch (error: any) {
      localStorage.setItem("email", formData.email);
      setShowAlert(true);

      setLoadingLogin(false);
      setMessageError(error.response.data.message);
    }
  };

  const onLoginGoogle = async () => {
    setLoadingLogingGoogle(true);
    document.cookie = "mode=login; path=/";

    await signIn("google");
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
