import { LoginI } from "@/app/interfaces/login.interface";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "./../../providers/firebase/config";
import { useTheContext } from "@/app/services/globalContext";

const useLogin = () => {
  const [formData, setFormData] = useState<LoginI>({ email: "", password: "" });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const { setDataModal } = useTheContext();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // Aquí tienes acceso a los datos del usuario
      const user = result.user;
      console.log("Usuario de Google:", user);

      // Acceso a información específica:
      console.log("Nombre:", user.displayName);
      console.log("Email:", user.email);
      console.log("Foto de perfil:", user.photoURL);
      console.log("ID único:", user.uid);
      console.log("Proveedor:", user.providerData[0].providerId);
    } catch (error) {
      console.error("Error al autenticar con Google:", error);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form data");
    console.log(formData);

    setDataModal({
      isOpen: true,
      message: "Este es un mensaje de ejemplo",
      title: "Título del modal",
      type: "success",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: () => {
        // Lógica de confirmación aquí
        console.log("Confirmado!");
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return {
    onSubmit,
    formData,
    setFormData,
    loadingLogin,
    signInWithGoogle,
  };
};

export default useLogin;
