"use client";

import { createContext, useContext, useState } from "react";

const CreateContext = createContext({
  bgActive: "",
  visible: "",
  onMouseEnter: () => {},
  onMouseLeave: () => {},
});

export const GlobalProvider = ({ children }: { children: any }) => {
  const [bgActive, setBgActive] = useState<string>("");
  const [visible, setVisible] = useState<string>("none");

  const onMouseEnter = () => {
    setBgActive("rgba(0,0,0,0.5)");
    setVisible("block");
  };
  const onMouseLeave = () => {
    setBgActive("");
    setVisible("none");
  };

  return (
    <CreateContext.Provider
      value={{ bgActive, visible, onMouseEnter, onMouseLeave }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);
