"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  RefObject,
  useRef,
  useEffect,
} from "react";
import ProductI from "../interfaces/products/product.interface";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";
import { CardI } from "../interfaces/card/card.interface";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

type ModalType = "success" | "error" | "warning" | "info";

type NotificationType = "success" | "error" | "warning" | "info";

interface ModalData {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  children?: any;
  showActions?: boolean;
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
  dataProducts: ProductI[];
  setDataProducts: Dispatch<SetStateAction<ProductI[]>>;
  socketPagos: RefObject<typeof Socket | null>;
  socketServer: RefObject<typeof Socket | null>;
  showProductsMenu: boolean;
  setShowProductsMenu: Dispatch<SetStateAction<boolean>>;
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
    showActions: true,
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
  dataProducts: [],
  setDataProducts: () => {},
  socketPagos: { current: null },
  socketServer: { current: null },
  showProductsMenu: false,
  setShowProductsMenu: () => {},
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
    showActions: true,
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
  const [dataProducts, setDataProducts] = useState<ProductI[]>([]);

  const handleSelectedCard = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedCard(event.target.value);
  };

  const socketServer = useRef<typeof Socket | null>(null);
  const socketPagos = useRef<typeof Socket | null>(null);
  const [showProductsMenu, setShowProductsMenu] = useState(false);

  useEffect(() => {
    socketServer.current = io(process.env.NEXT_PUBLIC_SOCKET_PROVEEDOR || "");
    socketPagos.current = io(process.env.NEXT_PUBLIC_SOCKET_PAGOS || "");

    return () => {
      socketServer.current?.disconnect();
      socketPagos.current?.disconnect();
    };
  }, []);
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
        dataProducts,
        setDataProducts,
        socketPagos,
        socketServer,
        showProductsMenu,
        setShowProductsMenu,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);
