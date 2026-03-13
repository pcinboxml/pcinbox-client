"use client";

import { ChangeEvent, useEffect, useState } from "react";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { HistoryComprasI } from "../interfaces/compras/historyCompras.interface";
import CancelledCompra from "../components/cancelledCompra/CancelledCompra";
import { Clock } from "lucide-react";
import { MdLocationOn } from "react-icons/md";

const useHistorialDeCompras = () => {
  const [dataFilter, setDataFilter] = useState({
    status: "allState",
    startDate: "",
    endDate: "",
    searchProduct: "",
  });
  const { requestPost } = useService();

  const [loadingCancelledCompra, setLoadingCancelledCompra] = useState<
    Record<any, boolean>
  >({});

  const { setDataModal } = useTheContext();

  const { requestPostPagos } = usePasarelaDePagos();
  const { groupById } = useService();

  const [dataHistoryCompras, setDataHistoryCompras] = useState<
    HistoryComprasI[]
  >([]);
  const [dataHistoryComprasCopy, setDataHistoryComprasCopy] = useState<
    HistoryComprasI[]
  >([]);

  useEffect(() => {
    const result = dataHistoryComprasCopy.filter((item) => {
      const statusMatch =
        dataFilter.status && dataFilter.status !== "allState"
          ? item.products.some((p) => p.statusShip === dataFilter.status)
          : true;

      const dateMatch =
        dataFilter.startDate && dataFilter.endDate
          ? (() => {
              const itemDate = new Date(item.createdAt);
              const start = new Date(dataFilter.startDate);
              const end = new Date(dataFilter.endDate);

              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              itemDate.setHours(0, 0, 0, 0);

              return itemDate >= start && itemDate <= end;
            })()
          : true;

      const searchTextMatch = dataFilter.searchProduct
        ? item.products.some((p) =>
            p.name
              .toLowerCase()
              .includes(dataFilter.searchProduct.toLowerCase()),
          )
        : true;

      return statusMatch && dateMatch && searchTextMatch;
    });

    setDataHistoryCompras(result);
  }, [dataFilter, dataHistoryComprasCopy]);

  const initDataHistory = async () => {
    try {
      const resp = await requestPost(
        {
          userId: localStorage.getItem("idUser"),
          status: "allState",
        },
        "/sales/filterSales",
      );

      if (resp.status == 200) {
        const data = await resp.data;

        setDataHistoryCompras(data.data.data);
        setDataHistoryComprasCopy(data.data.data);
      }
    } catch (error) {}
  };

  const showModal = (historyCompra: HistoryComprasI) => {
    setDataModal({
      isOpen: true,
      message: (
        <CancelledCompra
          handleCancelPedido={handleCancelPedido}
          historyCompra={historyCompra}
        />
      ),
      type: "info",
      title: "Cancelar compra",
      showActions: false,

      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        // setDataModal((prev) => ({ ...prev, isOpen: false }));
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const showUbicationStore = (storeId: string): void => {
    let horarios: { horarios: { dia: any; hora: any }[]; storeId: string }[] = [
      {
        storeId: "PCinBOX-SFD",
        horarios: [
          { dia: "Lunes a Viernes", hora: "9:00am a 6:30pm" },
          { dia: "Sábado", hora: "9:00am a 2:30pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
      {
        storeId: "PCinBOX-AG2D",
        horarios: [
          { dia: "Lunes a Viernes", hora: "9:00am a 7:00pm" },
          { dia: "Sábado", hora: "9:00am a 3:00pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
      {
        storeId: "PCinBOX-León",
        horarios: [
          { dia: "Lunes a Viernes", hora: "10:30am a 7:00pm" },
          { dia: "Sábado", hora: "10:30am a 3:00pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
      {
        storeId: "PCinBOX-AGD",
        horarios: [
          {
            dia: "Lunes a Viernes",
            hora: "9:00am a 6:30pm",
          },
          { dia: "Sábado", hora: "9:00am a 2:30pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
    ];

    setDataModal({
      isOpen: true,
      type: "info",
      message: (
        <div className="p-6 space-y-5">
          {/* Dirección */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Ubicación
            </p>
            <p className="text-slate-700 font-medium leading-relaxed text-sm">
              {(() => {
                switch (storeId) {
                  case "PCinBOX-SFD":
                    return `
                         Carretera Panamericana #708 Condominio Santa Fe Tecno Park Jesús María, Ciudad: Aguascalientes.
                        `;
                  case "PCinBOX-AG2D":
                    return `Av. Convención de 1914 Norte #1405 Col. Arboledas, Ciudad: Aguascalientes.`;

                  case "PCinBOX-AGD":
                    return `Av. Convención de 1914 Norte #201 Col. Gremial CP:20030 Aguascalientes Aguascalientes.`;

                  case "PCinBOX-León":
                    return `Blvd. Juan Alonso de Torres Pte. No. 1917 Local 1 Colonia Unión Comunitaria de León C.P 37239 Ciudad de León, Guanajuato, México`;

                  default:
                    return "Tienda desconocida";
                }
              })()}
            </p>
          </div>

          {/* Horarios */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horarios
            </p>
            <div className="space-y-2">
              {horarios
                .filter((itemF) => itemF.storeId === storeId)[0]
                .horarios.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {item.dia}
                    </span>
                    <span
                      className={`text-sm font-semibold ${item.hora === "Cerrado" ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {item.hora}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* CTA Button */}
          <a
            onClick={() => {
              let url = "";

              switch (storeId) {
                case "PCinBOX-SFD":
                  url =
                    "https://www.google.com/maps/place/CEDIS+DICOTECH/@22.0252284,-102.2861256,17z/data=!3m1!4b1!4m6!3m5!1s0x8429e5885d9bfb11:0x70022dc2ed8396ef!8m2!3d22.0252284!4d-102.2835507!16s%2Fg%2F11l2q9rmt5?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";
                  break;
                case "PCinBOX-León":
                  url =
                    "https://www.google.com/maps/place/pcinbox/@21.145074,-101.649971,17z/data=!3m2!4b1!5s0x842bbec23a6339d7:0x97fd35425c83c996!4m6!3m5!1s0x842bbf44ccdc84cd:0x38a155fcdc248313!8m2!3d21.1450741!4d-101.6451001!16s%2Fg%2F11mvmjh65f?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";
                  break;
                case "PCinBOX-AG2D":
                  url =
                    "https://www.google.com/maps/place/Zegucom+c%C3%B3mputo+AGUASCALIENTES/@21.8984101,-102.3046535,17z/data=!3m1!4b1!4m6!3m5!1s0x8429eef5ca83ab93:0x609128c20d232c21!8m2!3d21.8984101!4d-102.3020786!16s%2Fg%2F1tjz884g?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";
                  break;
                case "PCinBOX-AG":
                  url =
                    "https://www.google.com/maps/place/DICOTECH+Gremial/@21.8995775,-102.3018894,16z/data=!4m10!1m2!2m1!1sAv.+Convenci%C3%B3n+de+1914+Norte+%23201+Col.+Gremial+CP:20030+Aguascalientes+Aguascalientes.!3m6!1s0x8429ef0e6225de6f:0xfd013390fcaed156!8m2!3d21.9007454!4d-102.2914005!15sCldBdi4gQ29udmVuY2nDs24gZGUgMTkxNCBOb3J0ZSAjMjAxIENvbC4gR3JlbWlhbCBDUDoyMDAzMCBBZ3Vhc2NhbGllbnRlcyBBZ3Vhc2NhbGllbnRlcy5aViJUYXYgY29udmVuY2nDs24gZGUgMTkxNCBub3J0ZSAjMjAxIGNvbCBncmVtaWFsIGNwIDIwMDMwIGFndWFzY2FsaWVudGVzIGFndWFzY2NhbGllbnRlcyB...";
                  break;
                default:
                  url = "";
              }
              if (url) window.open(url, "_blank");
            }}
            style={{
              marginBottom: "10px",
            }}
            className="w-full mt-6 bg-slate-900 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform flex items-center justify-center gap-2 group"
          >
            <MdLocationOn className="w-4 h-4" />
            Ver en Google Maps
          </a>
        </div>
      ),
      title: "",
      showActions: true,
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleCancelPedido = async (historyCompra: HistoryComprasI) => {
    try {
      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: true,
      }));

      const estadosNoCancelables = new Set([
        "entregado",
        "cancelado",
        "disponible",
        "enviado",
      ]);

      const tieneEstadoNoCancelable = historyCompra?.products?.some((item) =>
        estadosNoCancelables.has(item?.statusShip),
      );

      if (tieneEstadoNoCancelable) {
        setDataModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "No es posible cancelar la compra",
          showActions: true,
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      const resp = await requestPostPagos(
        {
          idOrder: historyCompra.idOrder,
          userId: Number(localStorage.getItem("idUser")),
        },
        "/openpay/cancelledPaymantOpenPay",
      );
      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: false,
      }));

      if (resp.status == 200) {
        const data = resp.data;
        console.log(data.data.data.idOrder);

        setDataHistoryCompras((prevHistoryCompras) => {
          return prevHistoryCompras.map((historyCompra) => {
            if (
              Number(historyCompra.idOrder) === Number(data.data.data.idOrder)
            ) {
              return {
                ...historyCompra,
                products: historyCompra.products?.map((product) => ({
                  ...product,
                  statusShip: "cancelado",
                })),
              };
            }

            return historyCompra;
          });
        });
        setDataModal({
          isOpen: true,
          type: "success",
          message: `Compra ${historyCompra.idOrder} cancelada correctamente.`,
          title: "Compra cancelada",

          onConfirm: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },
          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },
        });
      }
    } catch (error) {
      setLoadingCancelledCompra((prev) => ({
        ...prev,
        [historyCompra?.idOrder]: false,
      }));
    }
  };

  return {
    dataHistoryCompras,
    loadingCancelledCompra,
    showModal,
    setDataFilter,
    dataFilter,
    showUbicationStore,
    setDataHistoryCompras,
    initDataHistory,
  };
};

export default useHistorialDeCompras;
