import { LoginI } from "@/app/interfaces/login.interface";
import {
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { auth } from "../providers/firebase/config";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";

const useLogin = () => {
  const [formData, setFormData] = useState<LoginI>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setDataModal } = useTheContext();
  const { requestPost, onRouterLink } = useService();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    e.preventDefault();

    if (
      !formData.email ||
      formData.email == "" ||
      !formData.password ||
      formData.password == ""
    ) {
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setDataModal({
        isOpen: true,
        message: `El correo ${formData.email} no tiene el formato correcto`,
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }

    setLoadingLogin(true);

    try {
      const res = await requestPost(formData, "/user/login");
      setLoadingLogin(false);

      if (res && res.status == 200) {
        setTimeout(() => {
          onRouterLink("/index");
        }, 100);
      }
    } catch (error: any) {
      localStorage.setItem("email", formData.email);
      setLoadingLogin(false);
      setDataModal({
        isOpen: true,
        message: error.response.data.message,
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  };

  return {
    onSubmit,
    formData,
    setFormData,
    loadingLogin,
    showPassword,
    setShowPassword,
  };
};

export default useLogin;
