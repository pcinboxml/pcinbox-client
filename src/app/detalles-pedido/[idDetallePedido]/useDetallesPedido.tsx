"use client";

import useService from "../../services/useService";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";

const useDetallesPedido = () => {
  const { formatCurrency, requestPost, onRouterLink } = useService();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [rows, setRows] = useState([]);

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

  const columns = [
    {
      field: "img",
      headerName: "Imagen",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,

      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center h-[150px] max-h-[200px] p-1">
              <Carousel
                showIndicators={true}
                showThumbs={false}
                showStatus={false}
                showArrows={true}
                // onClickItem={() => {
                //   onRouterLink(`/detailsProduct/${params.row.id}`);
                // }}
              >
                {params.value && params.value.length > 0
                  ? params.value.map((img: string, i: number) => (
                      <div key={i}>
                        <img
                          src={img}
                          style={{
                            objectFit: "contain",
                            height: "150px",
                            marginTop: "12px",
                          }}
                        />
                      </div>
                    ))
                  : [<div key="no-img">Sin imágenes</div>]}
              </Carousel>
              {/* <img
                src={params.value[0]}
                alt="User"
                width={50}
                height={50}
                className="mx-auto my-2"
              /> */}
            </div>
          );
        }
      },
    },
    {
      field: "description",
      headerName: "Descripción",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 350 : undefined,
      renderCell: (params: any) => {
        if (params) {
          return (
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                title={params.value}
                className="inline-block text-center text-sm leading-snug w-full text-[#808080]"
                style={{
                  display: "inline-block",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {params?.value?.length > 150
                  ? `${params.value.slice(0, 150)}...`
                  : params.value}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {params.value}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "unitPrice",
      headerName: "Precio Unitario",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {formatCurrency(Number(params.value))}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "totalPrice",
      headerName: "Precio Total",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {formatCurrency(Number(params.value))}
              </span>
            </div>
          );
        }
      },
    },
  ];

  const handleGetSalesByUser = async (idOrder: any) => {
    try {
      const resp = await requestPost(
        { idOrder: idOrder },
        "/sales/getSalesByUser"
      );
      if (resp.status == 200) {
        const data = resp.data;

        let dataRow = data.data.data.map((item: any) => {
          return {
            id: item.idOrder,
            img: item.image_url,
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.price),
            totalPrice: Number(item.totalAmount),
          };
        });

        const grouped: any = Object.values(
          dataRow.reduce((acc: any, item: any) => {
            if (!acc[item.id]) {
              // Clonar el item para no modificar el original
              acc[item.id] = { ...item };
            } else {
              // Sumar quantity
              acc[item.id].quantity += item.quantity;

              // (Opcional) combinar arrays de imágenes sin duplicar
              acc[item.id].img = Array.from(
                new Set([...acc[item.id].img, ...item.img])
              );
            }
            return acc;
          }, {})
        );

        setRows(grouped);
      }
    } catch (error) {
      setRows([]);
    }
  };
  return {
    columns,
    rows,
    handleGetSalesByUser,
  };
};

export default useDetallesPedido;
