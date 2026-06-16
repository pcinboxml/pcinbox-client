"use client";

import styles from "./detallesPedido.module.css";
import useService from "../../services/useService";
import useDetallesPedido from "./useDetallesPedido";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Alert } from "@mui/material";
import {
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { IMAGE_SIZES, optimizeImageUrl } from "@/app/lib/optimizeImage";
import { MdAccountBalance, MdMoney } from "react-icons/md";

const DetallesPedido = () => {
  const { formatCurrency, onRouterLink } = useService();
  const { dataSalesByUser, handleGetSalesByUser } = useDetallesPedido();

  const router = useParams();
  const { idDetallePedido } = router;

  useEffect(() => {
    if (idDetallePedido) {
      handleGetSalesByUser(idDetallePedido);
    }
  }, [idDetallePedido]);

  return dataSalesByUser &&
    dataSalesByUser?.status == "paid" &&
    dataSalesByUser?.shipments?.length &&
    dataSalesByUser?.shipments?.[0].status == "entregado" ? (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header con gradiente mejorado */}
        <div
          style={{
            background: "linear-gradient(to right, #bb3d4b, #d4475a)",
            borderRadius: "24px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            padding: "2rem",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decoración de fondo */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "256px",
              height: "256px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              marginRight: "-128px",
              marginTop: "-128px",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "192px",
              height: "192px",
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "50%",
              marginLeft: "-96px",
              marginBottom: "-96px",
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  padding: "0.75rem",
                  borderRadius: "16px",
                }}
              >
                <Package
                  style={{ width: "32px", height: "32px", color: "white" }}
                />
              </div>
              <div>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Pedido Completado
                </p>
                <h1
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: "bold",
                    color: "white",
                    margin: 0,
                  }}
                >
                  #{idDetallePedido}
                </h1>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <CheckCircle2
                style={{ width: "20px", height: "20px", color: "#86efac" }}
              />
              <span
                style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}
              >
                Entregado exitosamente
              </span>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth >= 1024 ? "2fr 1fr" : "1fr",
            gap: "2rem",
          }}
        >
          {/* Columna izquierda */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Card de fechas y entrega */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                padding: "1.5rem",
                transition: "box-shadow 0.3s",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    window.innerWidth >= 768 ? "1fr 1fr" : "1fr",
                  gap: "1.5rem",
                }}
              >
                {/* Fechas */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#dbeafe",
                        padding: "0.75rem",
                        borderRadius: "12px",
                        transition: "background 0.3s",
                      }}
                    >
                      <Calendar
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#2563eb",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#111827",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Fecha de compra
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {new Date(dataSalesByUser?.createdAt).toLocaleString(
                          "es-MX",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#dcfce7",
                        padding: "0.75rem",
                        borderRadius: "12px",
                        transition: "background 0.3s",
                      }}
                    >
                      <Truck
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#16a34a",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#111827",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Fecha de entrega
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {new Date(
                          dataSalesByUser?.shipments?.[0]?.createdAt
                        ).toLocaleString("es-MX", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tipo de entrega */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#f3e8ff",
                        padding: "0.75rem",
                        borderRadius: "12px",
                      }}
                    >
                      <MapPin
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#9333ea",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#111827",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Tipo de entrega
                      </p>

                      {dataSalesByUser?.shipping_method !== "sucursal" ? (
                        dataSalesByUser?.shipments?.length > 0 ? (
                          <div>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                background:
                                  "linear-gradient(to right, #dbeafe, #bfdbfe)",
                                color: "#1e40af",
                                marginBottom: "0.75rem",
                              }}
                            >
                              🏠 Se entregó a domicilio
                            </span>
                            <div
                              style={{
                                background:
                                  "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
                                borderRadius: "16px",
                                padding: "1rem",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  color: "#374151",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                Dirección de entrega
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.25rem",
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                }}
                              >
                                <p style={{ margin: 0 }}>
                                  {
                                    dataSalesByUser?.shipments[0]?.addresses
                                      ?.street
                                  }{" "}
                                  #
                                  {
                                    dataSalesByUser?.shipments[0]?.addresses
                                      ?.noExt
                                  }
                                  {dataSalesByUser?.shipments[0]?.addresses
                                    ?.noInt &&
                                    ` Int. ${dataSalesByUser?.shipments[0]?.addresses?.noInt}`}
                                </p>
                                <p style={{ margin: 0 }}>
                                  {
                                    dataSalesByUser?.shipments[0]?.addresses
                                      ?.cologne
                                  }
                                  {", CP "}
                                  {
                                    dataSalesByUser?.shipments[0]?.addresses
                                      ?.postalCode
                                  }
                                </p>
                                <p style={{ margin: 0, fontWeight: "500" }}>
                                  {
                                    dataSalesByUser?.shipments[0]?.addresses
                                      ?.city
                                  }
                                  {", "}
                                  {
                                    dataSalesByUser?.shipments[0]?.addresses
                                      ?.state
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null
                      ) : (
                        <div>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              background:
                                "linear-gradient(to right, #f3e8ff, #e9d5ff)",
                              color: "#6b21a8",
                              marginBottom: "0.75rem",
                            }}
                          >
                            🏪 Se entregó en sucursal
                          </span>
                          <div
                            style={{
                              background:
                                "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
                              borderRadius: "16px",
                              padding: "1rem",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                color: "#374151",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Sucursal
                            </p>
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: "#111827",
                                fontWeight: "600",
                                margin: 0,
                              }}
                            >
                              PCinBOX León
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de productos */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
                transition: "box-shadow 0.3s",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(to right, #1f2937, #111827)",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "white",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Package style={{ width: "20px", height: "20px" }} />
                  Productos del pedido
                </h2>
              </div>

              <div style={{ borderTop: "1px solid #f3f4f6" }}>
                {dataSalesByUser?.sales?.map((product, indexProduct) => (
                  <div
                    key={indexProduct}
                    style={{
                      padding: "1.5rem",
                      borderBottom:
                        indexProduct < dataSalesByUser.sales.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={optimizeImageUrl(
                              product?.products?.image_url?.length > 0
                                ? product?.products?.image_url[0]
                                : "",
                              { width: IMAGE_SIZES.cardLg },
                            )}
                            alt={product?.products?.name}
                            style={{
                              width: "112px",
                              height: "112px",
                              objectFit: "cover",
                              borderRadius: "16px",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "2px solid #f3f4f6",
                              transition: "transform 0.3s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "bold",
                            color: "#111827",
                            marginBottom: "0.75rem",
                            cursor: "pointer",
                            transition: "color 0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#B92B3D")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#111827")
                          }
                          onClick={() => {
                            onRouterLink(
                              `/detailsProduct/${product?.products?.idProduct}`
                            );
                          }}
                        >
                          {product?.products?.name?.length > 50
                            ? `${product?.products?.name?.slice(0, 50)}...`
                            : product?.products?.name}
                        </h3>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
                              padding: "0.625rem 1rem",
                              borderRadius: "12px",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                display: "block",
                                marginBottom: "0.125rem",
                              }}
                            >
                              Cantidad
                            </span>
                            <span
                              style={{ fontWeight: "bold", color: "#111827" }}
                            >
                              {product?.quantity}{" "}
                              {product?.quantity > 1 ? "unidades" : "unidad"}
                            </span>
                          </div>
                          <div
                            style={{
                              background:
                                "linear-gradient(to bottom right, #dbeafe, #bfdbfe)",
                              padding: "0.625rem 1rem",
                              borderRadius: "12px",
                              border: "1px solid #93c5fd",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#1e40af",
                                display: "block",
                                marginBottom: "0.125rem",
                              }}
                            >
                              Precio unitario
                            </span>
                            <span
                              style={{ fontWeight: "bold", color: "#1e3a8a" }}
                            >
                              {formatCurrency(Number(product?.total))}
                            </span>
                          </div>
                          <div
                            style={{
                              background:
                                "linear-gradient(to bottom right, #bb3d4b, #d4475a)",
                              padding: "0.625rem 1rem",
                              borderRadius: "12px",
                              boxShadow:
                                "0 4px 6px -1px rgba(187, 61, 75, 0.3)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "rgba(255, 255, 255, 0.8)",
                                display: "block",
                                marginBottom: "0.125rem",
                              }}
                            >
                              Total
                            </span>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "white",
                                fontSize: "1.125rem",
                              }}
                            >
                              {formatCurrency(
                                Number(product?.quantity) *
                                  Number(product?.total)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div>
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
                position: "sticky",
                top: "2rem",
                transition: "box-shadow 0.3s",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(to right, #1f2937, #111827)",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "white",
                    margin: 0,
                  }}
                >
                  Resumen del pedido
                </h2>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Estado de pago */}
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom right, #dcfce7, #a7f3d0)",
                    borderRadius: "16px",
                    padding: "1rem",
                    border: "2px solid #86efac",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <CheckCircle2
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "#16a34a",
                      }}
                    />
                    <p
                      style={{
                        fontWeight: "600",
                        color: "#111827",
                        fontSize: "0.875rem",
                        margin: 0,
                      }}
                    >
                      Estado de pago
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#15803d",
                      margin: 0,
                    }}
                  >
                    Pagado
                  </p>
                </div>

                {/* Método de pago */}
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Método de pago
                  </p>
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
                      borderRadius: "16px",
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {dataSalesByUser.pay_method === "tarjeta_de_debito" ||
                      dataSalesByUser.pay_method === "tarjeta_de_credito" ? (
                        <>
                          <div
                            style={{
                              background: "white",
                              padding: "0.5rem",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <CreditCard
                              style={{
                                width: "20px",
                                height: "20px",
                                color: "#6b7280",
                              }}
                            />
                          </div>
                          <span style={{ fontWeight: "500", color: "#111827" }}>
                            {dataSalesByUser.pay_method === "tarjeta_de_debito"
                              ? "Tarjeta de Débito"
                              : "Tarjeta de Crédito"}
                          </span>
                        </>
                      ) : dataSalesByUser.pay_method ===
                        "transferencia_bancaria" ? (
                        <>
                          <div
                            style={{
                              background: "white",
                              padding: "0.5rem",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <MdAccountBalance
                              size={20}
                              style={{ color: "#6b7280" }}
                            />
                          </div>
                          <span style={{ fontWeight: "500", color: "#111827" }}>
                            Transferencia bancaria
                          </span>
                        </>
                      ) : dataSalesByUser.pay_method === "oxxo" ? (
                        <>
                          <div
                            style={{
                              background: "white",
                              padding: "0.5rem",
                              borderRadius: "8px",
                              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <MdMoney size={20} style={{ color: "#6b7280" }} />
                          </div>
                          <span style={{ fontWeight: "500", color: "#111827" }}>
                            Efectivo
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div
                  style={{ paddingTop: "1rem", borderTop: "2px solid #e5e7eb" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom right, #bb3d4b, #d4475a)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      boxShadow: "0 10px 15px -3px rgba(187, 61, 75, 0.3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Total pagado
                        </p>
                        <p
                          style={{
                            fontSize: "1.875rem",
                            fontWeight: "bold",
                            color: "white",
                            margin: 0,
                          }}
                        >
                          {formatCurrency(
                            dataSalesByUser?.sales?.reduce(
                              (acc, sale) =>
                                acc +
                                Number(sale.quantity) * Number(sale.total),
                              0
                            )
                          )}
                        </p>
                      </div>
                      <div style={{ fontSize: "2.25rem" }}>💰</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <Alert severity="info" style={{ maxWidth: "448px" }}>
        Sin contenido disponible
      </Alert>
    </div>
  );
};

export default DetallesPedido;
