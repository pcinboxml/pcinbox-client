"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type ModalType = "success" | "error" | "warning" | "info";

interface ModalData {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface ContextProps {
  bgActive: string;
  visible: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  dataModal: ModalData;
  setDataModal: Dispatch<SetStateAction<ModalData>>;
}

const CreateContext = createContext<ContextProps>({
  bgActive: "",
  visible: "",
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  dataModal: {
    isOpen: false,
    onClose: () => {},
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
  },
  setDataModal: () => {},
});

export const GlobalProvider = ({ children }: { children: any }) => {
  const [bgActive, setBgActive] = useState<string>("");
  const [visible, setVisible] = useState<string>("none");

  //Data para los modales
  const [dataModal, setDataModal] = useState<ModalData>({
    isOpen: false,
    onClose: () => {},
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
  });

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
      value={{
        bgActive,
        visible,
        onMouseEnter,
        onMouseLeave,
        dataModal,
        setDataModal,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);

// "use client";

// import { createContext, useContext, useState } from "react";

// const CreateContext = createContext({
//   bgActive: "",
//   visible: "",
//   onMouseEnter: () => {},
//   onMouseLeave: () => {},
//   dataModal: {
//     isOpen: false,
//     onClose: () => {},
//     type: "",
//     title: "",
//     message: "",

//     onConfirm: () => {},
//   },

//   setDataModal: ,
// });

// export const GlobalProvider = ({ children }: { children: any }) => {
//   const [bgActive, setBgActive] = useState<string>("");
//   const [visible, setVisible] = useState<string>("none");
//   type ModalType = "success" | "error" | "warning" | "info";

//   //Loading para toda la app
//   const [loadingSpinner, setLoadingSpinner] = useState<boolean>(false);

//   //Data para los modales
//   const [dataModal, setDataModal] = useState<{
//     isOpen: boolean;
//     onClose: () => void;
//     type: ModalType;
//     title: string;
//     message: string;

//     onConfirm: () => void;
//   }>({
//     isOpen: false,
//     onClose: () => {},
//     type: "success",
//     title: "",
//     message: "",

//     onConfirm: () => {},
//   });

//   const onMouseEnter = () => {
//     setBgActive("rgba(0,0,0,0.5)");
//     setVisible("block");
//   };
//   const onMouseLeave = () => {
//     setBgActive("");
//     setVisible("none");
//   };

//   return (
//     <CreateContext.Provider
//       value={{
//         bgActive,
//         visible,
//         onMouseEnter,
//         onMouseLeave,
//         dataModal,
//         setDataModal,
//       }}
//     >
//       {children}
//     </CreateContext.Provider>
//   );
// };

// export const useTheContext = () => useContext(CreateContext);
