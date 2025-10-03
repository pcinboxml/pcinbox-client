"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import ProductI from "../interfaces/products/product.interface";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";
import { CardI } from "../interfaces/card/card.interface";

type ModalType = "success" | "error" | "warning" | "info";

type NotificationType = "success" | "error" | "warning" | "info";

interface ModalData {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: any;
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
  selectedCard: string;
  setSelectedCard: Dispatch<SetStateAction<string>>;
  handleSelectedCard: any;
  dataCard: CardI[];
  setDataCard: Dispatch<SetStateAction<CardI[]>>;
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
  selectedCard: "",
  setSelectedCard: () => {},
  handleSelectedCard: () => {},
  dataCard: [],
  setDataCard: () => {},
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
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [dataCard, setDataCard] = useState<CardI[]>([]);

  const handleSelectedCard = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedCard(event.target.value);
  };

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
        selectedCard,
        setSelectedCard,
        handleSelectedCard,
        dataCard,
        setDataCard,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);
