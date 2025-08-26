"use client";

import { useState } from "react";
import { RegisterI } from "../interfaces/register.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { signIn } from "next-auth/react";

type Strength = "weak" | "medium" | "strong" | "";

const useRegister = () => {
  const [formData, setFormData] = useState<RegisterI>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [loadingRegisterGoogle, setLoadingRegisterGoogle] =
    useState<boolean>(false);
  const [typeStrength, setTypeStrength] = useState<Strength>("");

  const { setDataModal } = useTheContext();
  const { requestPost, onRouterLink } = useService();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "password") {
      if (value != "") {
        const hasLetters = /[a-zA-Z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSymbols = /[^a-zA-Z0-9]/.test(value);

        if (value.length >= 10 && hasLetters && hasNumbers && hasSymbols) {
          setTypeStrength("strong");
        } else if (
          value.length >= 6 &&
          ((hasLetters && hasNumbers) || (hasLetters && hasSymbols))
        ) {
          setTypeStrength("medium");
        } else {
          setTypeStrength("weak");
        }
      } else {
        setTypeStrength("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isEmpty = Object.values(formData).some((value) => value.trim() == "");

    if (isEmpty) {
      setDataModal({
        isOpen: true,
        message: "Completa los campos",
        type: "error",
        title: "Error",
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setDataModal({
        isOpen: true,
        message: `El correo ${formData.email} no tiene el formato correcto`,
        type: "error",
        title: "Error",
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }

    if (
      formData.password != formData.confirmPassword ||
      formData.confirmPassword != formData.password
    ) {
      setDataModal({
        isOpen: true,
        message: "Las contraseñas no coinciden",
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }

    setLoadingRegister(true);

    try {
      const res = await requestPost(
        {
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,

          password: formData.password,
        },
        "/user/register"
      );
      setLoadingRegister(false);

      if (res.status == 200) {
        setFormData({
          name: "",
          confirmPassword: "",
          email: "",
          lastname: "",
          password: "",
        });
        setDataModal({
          isOpen: true,
          message: "Cuenta creada correctamente",
          title: "Satisfactorio",
          type: "success",
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            onRouterLink("/principal");
          },
        });
      }
    } catch (error: any) {
      setLoadingRegister(false);
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

  const handleRegisterGoogle = async () => {
    setLoadingRegisterGoogle(true);
    document.cookie = "mode=login; path=/";

    await signIn("google");
  };

  return {
    formData,
    showPassword,
    showConfirmPassword,
    loadingRegister,
    typeStrength,
    loadingRegisterGoogle,
    handleInputChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
    handleRegisterGoogle,
  };
};

export default useRegister;
