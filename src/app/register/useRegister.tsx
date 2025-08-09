"use client";

import { useState } from "react";
import { RegisterI } from "../interfaces/register.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";

const useRegister = () => {
  const [formData, setFormData] = useState<RegisterI>({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);

  const { setDataModal } = useTheContext();
  const { requestPost, onRouterLink } = useService();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value ? value.trim() : "",
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

    if (!/^\d*$/.test(formData.phone)) {
      setDataModal({
        isOpen: true,
        message: `El número de teléfono deben ser puros numeros`,
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
          phone: formData.phone,
          password: formData.password,
        },
        "/user/register"
      );
      setLoadingRegister(false);

      if (res.status == 200) {
        setDataModal({
          isOpen: true,
          message: "Cuenta creada correctamente",
          title: "Satisfactorio",
          type: "success",
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            onRouterLink("/");
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

  return {
    formData,
    showPassword,
    showConfirmPassword,
    acceptTerms,
    loadingRegister,
    handleInputChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
    setAcceptTerms,
  };
};

export default useRegister;
