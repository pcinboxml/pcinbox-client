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
  const [formData, setFormData] = useState<LoginI>({ email: "", password: "" });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const { setDataModal } = useTheContext();

  const { requestPost } = useService();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.email ||
      formData.email == "" ||
      !formData.password ||
      formData.password == ""
    ) {
      return;
    }

    setLoadingLogin(true);

    try {
      const res = await requestPost(formData, "/user/login");
      setLoadingLogin(false);

      if (res && res.status == 200) {
        const data = res.data;
        localStorage.setItem("token", data.data.token);
        window.location.reload();
      }
    } catch (error: any) {
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

  useEffect(() => {
    setLoadingLogin(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          console.log(user);

          // Guardar token si lo necesitas
          const credential =
            GoogleAuthProvider.credentialFromResult(result) ||
            FacebookAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          if (token) localStorage.setItem("token", token);
        }
      })
      .catch((error) => {
        setDataModal({
          isOpen: true,
          message: "Error al iniciar sesión: " + error.message,
          title: "Error",
          type: "error",
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
      })
      .finally(() => setLoadingLogin(false));
  }, []);

  return {
    onSubmit,
    formData,
    setFormData,
    loadingLogin,
  };
};

export default useLogin;
