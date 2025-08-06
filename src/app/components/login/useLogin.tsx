import { LoginI } from "@/app/interfaces/login.interface";
import { FormEvent, useState } from "react";

const useLogin = () => {
  const [formData, setFormData] = useState<LoginI>({ email: "", password: "" });
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingLogin(true);

    setTimeout(() => {
      setLoadingLogin(false);
    }, 3000);

    console.log("Form data");
    console.log(formData);
  };

  return {
    onSubmit,
    formData,
    setFormData,
    loadingLogin,
  };
};

export default useLogin;
