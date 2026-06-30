"use client";

import { SalesByUserI } from "@/app/interfaces/compras/salesByUser.interface";
import useService from "../../services/useService";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";

const useDetallesPedido = () => {
  const { formatCurrency, requestPost, onRouterLink } = useService();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [dataSalesByUser, setDataSalesByUser] = useState<SalesByUserI | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const match = window.matchMedia("(max-width: 1550px)");
    setIsSmallScreen(match.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    match.addEventListener("change", handler);

    return () => {
      match.removeEventListener("change", handler);
    };
  }, []);

  // const columns = [
  //   {
  //     field: "img",
  //     headerName: "Imagen",
  //     flex: isSmallScreen ? undefined : 1,
  //     width: isSmallScreen ? 170 : undefined,

  //     renderCell: (params: any) => {
  //       if (params.value) {
  //         return (
  //           <div className="flex justify-center items-center h-[150px] max-h-[200px] p-1">
  //             <Carousel
  //               showIndicators={true}
  //               showThumbs={false}
  //               showStatus={false}
  //               showArrows={true}
  //               // onClickItem={() => {
  //               //   onRouterLink(`/detailsProduct/${params.row.id}`);
  //               // }}
  //             >
  //               {params.value && params.value.length > 0
  //                 ? params.value.map((img: string, i: number) => (
  //                     <div key={i}>
  //                       <img
  //                         src={img}
  //                         style={{
  //                           objectFit: "contain",
  //                           height: "150px",
  //                           marginTop: "12px",
  //                         }}
  //                         loading="lazy"
  //                       />
  //                     </div>
  //                   ))
  //                 : [<div key="no-img">Sin imágenes</div>]}
  //             </Carousel>
  //             {/* <img
  //               src={params.value[0]}
  //               alt="User"
  //               width={50}
  //               height={50}
  //               className="mx-auto my-2"
  //             /> */}
  //           </div>
  //         );
  //       }
  //     },
  //   },
  //   {
  //     field: "description",
  //     headerName: "Descripción",
  //     flex: isSmallScreen ? undefined : 1,
  //     width: isSmallScreen ? 350 : undefined,
  //     renderCell: (params: any) => {
  //       if (params) {
  //         return (
  //           <div className="flex justify-center items-center min-h-[100%] p-1">
  //             <span
  //               title={params.value}
  //               className="inline-block text-center text-sm leading-snug w-full text-[#808080]"
  //               style={{
  //                 display: "inline-block",
  //                 wordBreak: "break-word",
  //                 whiteSpace: "normal",
  //               }}
  //             >
  //               {params?.value?.length > 150
  //                 ? `${params.value.slice(0, 150)}...`
  //                 : params.value}
  //             </span>
  //           </div>
  //         );
  //       }
  //     },
  //   },
  //   {
  //     field: "quantity",
  //     headerName: "Cantidad",
  //     flex: isSmallScreen ? undefined : 1,
  //     width: isSmallScreen ? 170 : undefined,
  //     renderCell: (params: any) => {
  //       if (params.value) {
  //         return (
  //           <div className="flex justify-center items-center min-h-[100%] p-1">
  //             <span
  //               className="text-[#808080] block text-center"
  //               style={{ fontSize: "18px", fontWeight: "600" }}
  //             >
  //               {params.value}
  //             </span>
  //           </div>
  //         );
  //       }
  //     },
  //   },
  //   {
  //     field: "unitPrice",
  //     headerName: "Precio Unitario",
  //     flex: isSmallScreen ? undefined : 1,
  //     width: isSmallScreen ? 170 : undefined,
  //     renderCell: (params: any) => {
  //       if (params.value) {
  //         return (
  //           <div className="flex justify-center items-center min-h-[100%] p-1">
  //             <span
  //               className="text-[#808080] block text-center"
  //               style={{ fontSize: "18px", fontWeight: "600" }}
  //             >
  //               {formatCurrency(Number(params.value))}
  //             </span>
  //           </div>
  //         );
  //       }
  //     },
  //   },
  //   {
  //     field: "totalPrice",
  //     headerName: "Precio Total",
  //     flex: isSmallScreen ? undefined : 1,
  //     width: isSmallScreen ? 170 : undefined,
  //     renderCell: (params: any) => {
  //       if (params.value) {
  //         return (
  //           <div className="flex justify-center items-center min-h-[100%] p-1">
  //             <span
  //               className="text-[#808080] block text-center"
  //               style={{ fontSize: "18px", fontWeight: "600" }}
  //             >
  //               {formatCurrency(Number(params.value))}
  //             </span>
  //           </div>
  //         );
  //       }
  //     },
  //   },
  // ];

  const handleGetSalesByUser = async (idOrder: any) => {
    setLoading(true);
    try {
      const resp = await requestPost(
        { idOrder: idOrder },
        "/sales/getSalesByUser"
      );
      if (resp.status == 200) {
        const data = resp.data;
        setDataSalesByUser(data.data.data);
      } else {
        setDataSalesByUser(null);
      }
    } catch (error) {
      setDataSalesByUser(null);
    } finally {
      setLoading(false);
    }
  };
  return {
    dataSalesByUser,
    loading,
    handleGetSalesByUser,
  };
};

export default useDetallesPedido;
