"use client";

import { useState } from "react";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";

const useForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [emailR, setEmailR] = useState<string>("");

  const { setDataModal } = useTheContext();
  const { requestPost, onRouterLink } = useService();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailR(e.target.value);
  };

  const handleClick = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailR) {
      const isValid = emailRegex.test(emailR);
      if (!isValid) {
        setDataModal({
          isOpen: true,
          title: "Error",
          type: "error",
          message: `El correo ${emailR} no tiene el formato correcto`,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
      } else {
        setLoading(true);

        try {
          const res = await requestPost(
            { email: emailR },
            "/resetpassword/forgotPassword"
          );

          setLoading(false);

          if (res && res.status == 200) {
            setDataModal({
              isOpen: true,
              title: "Correcto",
              type: "success",
              message: res.data.message,
              onClose: () =>
                setDataModal((prev) => ({ ...prev, isOpen: false })),
              onConfirm: () =>
                setDataModal((prev) => ({ ...prev, isOpen: false })),
            });
          }
        } catch (error: any) {
          setLoading(false);
          setDataModal({
            isOpen: true,
            title: "Error",
            type: "error",
            message: error.response.data.message,
            onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
            onConfirm: () =>
              setDataModal((prev) => ({ ...prev, isOpen: false })),
          });
        }
      }
    }
  };

  const handleKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (emailR && e.key === "Enter") {
      handleClick();
    }
  };

  return {
    loading,
    handleInputChange,
    emailR,
    handleClick,
    handleKeyup,
  };
};

export default useForgotPassword;
