"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import ChangePasswordI from "../interfaces/changePassword/changePassword.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { Strength } from "./../interfaces/Strength/strength.interface";

const useCambiarContrasena = () => {
  const [dataForm, setDataForm] = useState<ChangePasswordI>({
    currentPassword: {
      value: "",
      showPassword: false,
    },
    newPassword: {
      value: "",
      showPassword: false,
    },
    confirmPassword: {
      value: "",
      showPassword: false,
    },
  });

  const [loadingChangePassword, setLoadingChangePassword] =
    useState<boolean>(false);

  const [typeStrength, setTypeStrength] = useState<Strength>("");

  const { setDataModal } = useTheContext();
  const { requestPost } = useService();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "confirmPassword") {
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
    setDataForm((prev) => ({
      ...prev,
      [name]: {
        value: value,
      },
    }));
  };

  const handleShowPassword = (name: keyof ChangePasswordI) => {
    setDataForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        showPassword: !prev[name].showPassword,
      },
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      dataForm.confirmPassword.value == "" ||
      dataForm.confirmPassword.value == null ||
      dataForm.currentPassword.value == "" ||
      dataForm.currentPassword.value == null ||
      dataForm.newPassword.value == "" ||
      dataForm.newPassword.value == null
    ) {
      return;
    }

    if (
      dataForm.newPassword.value != dataForm.confirmPassword.value ||
      dataForm.confirmPassword.value != dataForm.newPassword.value
    ) {
      setDataModal({
        isOpen: true,
        message: "Las contraseñas no coinciden",
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setLoadingChangePassword(true);

    try {
      const resp = await requestPost(
        {
          currentPassword: dataForm.currentPassword.value,
          newPassword: dataForm.newPassword.value,
        },
        "/user/changePassword"
      );
      setLoadingChangePassword(false);

      if (resp && resp.status == 200) {
        setDataModal({
          isOpen: true,
          message: "Contraseña actualizada",
          title: "Correcto",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: async () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          type: "success",
        });

        setDataForm({
          currentPassword: {
            value: "",
            showPassword: false,
          },
          newPassword: {
            value: "",
            showPassword: false,
          },
          confirmPassword: {
            value: "",
            showPassword: false,
          },
        });
      }
    } catch (error: any) {
      setLoadingChangePassword(false);
      setDataModal({
        isOpen: true,
        message: error.response.data.message,
        title: "Error",
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: async () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        type: "error",
      });
    }
  };

  return {
    handleInputChange,
    handleShowPassword,
    onSubmit,
    dataForm,
    loadingChangePassword,
    typeStrength,
  };
};

export default useCambiarContrasena;
