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
import { AddressI } from "../interfaces/address/address.interface";
import { DataSendI } from "../interfaces/perfil/perfil.interface";
import PostalCodeLookupI from "../interfaces/geonames/postalCodeLookupJSON/postalCodeLookupJSON.interface";
import useService from "./useService";
import useProveedores from "./proveedores/useProveedores";

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
  socketCron: RefObject<typeof Socket | null>;
  socketServer: RefObject<typeof Socket | null>;
  showProductsMenu: boolean;
  setShowProductsMenu: Dispatch<SetStateAction<boolean>>;
  dataUserAddress: AddressI[];
  setDataUserAddress: Dispatch<SetStateAction<AddressI[]>>;
  isEditAddress: {
    edit: boolean;
    idAddress: number;
  };
  setIsEditAddress: Dispatch<
    SetStateAction<{
      edit: boolean;
      idAddress: number;
    }>
  >;
  dataAddress: DataSendI;
  setDataAddress: Dispatch<SetStateAction<DataSendI>>;
  postalCodes: PostalCodeLookupI[];
  setPostalCodes: Dispatch<SetStateAction<PostalCodeLookupI[]>>;
  dataCategories: {
    idCategorie: number;
    name: string;
    providerId: number;
  }[];
  setDataCategories: Dispatch<
    SetStateAction<
      {
        idCategorie: number;
        name: string;
        providerId: number;
      }[]
    >
  >;
  addressByStore: any;
  setAddressByStore: Dispatch<SetStateAction<Record<any, any>>>;
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
  socketCron: { current: null },
  showProductsMenu: false,
  setShowProductsMenu: () => {},
  dataUserAddress: [],
  setDataUserAddress: () => {},
  isEditAddress: {
    edit: false,
    idAddress: 0,
  },
  setIsEditAddress: () => {},
  dataAddress: {
    street: "",
    noExt: "",
    noInt: "",
    codePostal: 0,
    cologne: "",
    state: "",
    city: "",
    phone1: "",
    phone2: "",
    country: "México",
  },
  setDataAddress: () => {},
  postalCodes: [],
  setPostalCodes: () => {},
  dataCategories: [],
  setDataCategories: () => {},
  addressByStore: 0,
  setAddressByStore: () => {},

  // idAddressEnvio: 0,
  // setIdAddressEnvio: () => {},
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

  const { requestGet } = useService();
  const { requestGetProveedor } = useProveedores();

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
  const socketCron = useRef<typeof Socket | null>(null);

  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [dataUserAddress, setDataUserAddress] = useState<AddressI[]>([]);
  const [isEditAddress, setIsEditAddress] = useState({
    edit: false,
    idAddress: 0,
  });
  const [addressByStore, setAddressByStore] = useState<Record<any, any>>({});

  const [dataAddress, setDataAddress] = useState<DataSendI>({
    street: "",
    noExt: "",
    noInt: "",
    codePostal: 0,
    cologne: "",
    state: "",
    city: "",
    phone1: "",
    phone2: "",
    country: "México",
  });

  const [dataCategories, setDataCategories] = useState<
    {
      idCategorie: number;
      name: string;
      providerId: number;
    }[]
  >([]);

  const [postalCodes, setPostalCodes] = useState<PostalCodeLookupI[]>([]);

  useEffect(() => {
    let mounted = true;

    const getListProducts = async () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL_PROVEEDOR}/getAllProduct`).then(
        async (res) => {
          const data = await res.json();

          setDataProducts(data.data);
          if (mounted) setDataProducts(data.data);
        },
      );
    };

    const handleGetDataFavorites = async () => {
      try {
        const resp = await requestGet("/favorites/getFavoritesUser");

        if (resp.status == 200) {
          const data = await resp.data;
          setDataFavorites(data.data.data);
        }
      } catch (error) {
        setDataFavorites([]);
      }
    };

    const getDataCategories = async () => {
      try {
        const resp = await requestGetProveedor("/getAllCategoriPrincipal");
        if (resp.status == 200) {
          const data = resp.data;

          setDataCategories(data.data.data);
        }
      } catch (error) {
        setDataCategories([]);
      }
    };

    getListProducts();
    handleGetDataFavorites();
    getDataCategories();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    socketServer.current = io(process.env.NEXT_PUBLIC_SOCKET_PROVEEDOR || "", {
      reconnection: true,
      reconnectionAttempts: Infinity, // intenta siempre
      reconnectionDelay: 1000, // empieza con 1s
      reconnectionDelayMax: 5000, // máximo 5s
      timeout: 20000,
    });
    socketPagos.current = io(process.env.NEXT_PUBLIC_SOCKET_PAGOS || "", {
      reconnection: true,
      reconnectionAttempts: Infinity, // intenta siempre
      reconnectionDelay: 1000, // empieza con 1s
      reconnectionDelayMax: 5000, // máximo 5s
      timeout: 20000,
    });

    socketCron.current = io(process.env.NEXT_PUBLIC_SOCKET_CRON || "", {
      reconnection: true,
      reconnectionAttempts: Infinity, // intenta siempre
      reconnectionDelay: 1000, // empieza con 1s
      reconnectionDelayMax: 5000, // máximo 5s
      timeout: 20000,
    });

    return () => {
      socketServer.current?.disconnect();
      socketPagos.current?.disconnect();
      socketCron?.current?.disconnect();
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
        socketCron,
        showProductsMenu,
        setShowProductsMenu,
        dataUserAddress,
        setDataUserAddress,
        isEditAddress,
        setIsEditAddress,
        dataAddress,
        setDataAddress,
        postalCodes,
        setPostalCodes,
        dataCategories,
        setDataCategories,
        addressByStore,
        setAddressByStore,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useTheContext = () => useContext(CreateContext);
