"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import ProductI from "../interfaces/products/product.interface";

type ModalType = "success" | "error" | "warning" | "info";

type NotificationType = "success" | "error" | "warning" | "info";

interface ModalData {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  onConfirm: () => void;
  children?: any;
}

interface NotificationData {
  open: boolean;
  handleClose: () => void;
  type: NotificationType;
  message: string;
}

interface ContextProps {
  dataModal: ModalData;
  setDataModal: Dispatch<SetStateAction<ModalData>>;
  dataCart: ProductI[];
  setDataCart: Dispatch<SetStateAction<ProductI[]>>;
  priceCart: number;
  setPriceCart: Dispatch<SetStateAction<number>>;

  hasToken: boolean;
  setHasToken: Dispatch<SetStateAction<boolean>>;

  dataNotification: NotificationData;
  setDataNotification: Dispatch<SetStateAction<NotificationData>>;
}

const CreateContext = createContext<ContextProps>({
  dataModal: {
    isOpen: false,
    onClose: () => {},
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
    children: "",
  },
  setDataModal: () => {},
  dataCart: [],
  setDataCart: () => {},
  priceCart: 0,
  setPriceCart: () => {},
  hasToken: false,
  setHasToken: () => {},
  dataNotification: {
    open: false,
    handleClose: () => {},
    message: "",
    type: "success",
  },
  setDataNotification: () => {},
});

export const GlobalProvider = ({ children }: { children: any }) => {
  //Data para los modales
  const [dataModal, setDataModal] = useState<ModalData>({
    isOpen: false,
    onClose: () => {},
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
    children: "",
  });

  const [hasToken, setHasToken] = useState<boolean>(false);
  const [dataCart, setDataCart] = useState<ProductI[]>([]);
  const [priceCart, setPriceCart] = useState<number>(0);
  const [dataNotification, setDataNotification] = useState<NotificationData>({
    open: false,
    handleClose: () => {},
    message: "",
    type: "success",
  });

  return (
    <CreateContext.Provider
      value={{
        dataModal,
        setDataModal,
        dataCart,
        setDataCart,
        priceCart,
        setPriceCart,
        hasToken,
        setHasToken,
        dataNotification,
        setDataNotification,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);
