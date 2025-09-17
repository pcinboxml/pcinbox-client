"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import ProductI from "../interfaces/products/product.interface";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";

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

  hasToken: boolean | null;
  setHasToken: Dispatch<SetStateAction<boolean | null>>;

  dataNotification: NotificationData;
  setDataNotification: Dispatch<SetStateAction<NotificationData>>;
  rutaImgPerfil: string;
  setRutaImgPerfil: Dispatch<SetStateAction<string>>;
  dataFavorites: FavoritesI[];
  setDataFavorites: Dispatch<SetStateAction<FavoritesI[]>>;
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
  hasToken: null,
  setHasToken: () => {},
  dataNotification: {
    open: false,
    handleClose: () => {},
    message: "",
    type: "success",
  },
  setDataNotification: () => {},
  rutaImgPerfil: "",
  setRutaImgPerfil: () => {},
  dataFavorites: [],
  setDataFavorites: () => {},
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

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [dataCart, setDataCart] = useState<ProductI[]>([]);
  const [dataFavorites, setDataFavorites] = useState<FavoritesI[]>([]);
  const [priceCart, setPriceCart] = useState<number>(0);
  const [dataNotification, setDataNotification] = useState<NotificationData>({
    open: false,
    handleClose: () => {},
    message: "",
    type: "success",
  });

  const [rutaImgPerfil, setRutaImgPerfil] = useState<string>("");

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
        rutaImgPerfil,
        setRutaImgPerfil,
        dataFavorites,
        setDataFavorites,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);
