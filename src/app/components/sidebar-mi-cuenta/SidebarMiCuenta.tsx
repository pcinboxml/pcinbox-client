"use client";
import useService from "@/app/services/useService";
import styles from "./sidebar-mi-cuenta.module.css";
import useSidebarMiCuenta from "./useSidebarMiCuenta";
import { useEffect, useState } from "react";

const SidebarMiCuenta = () => {
  const { isRouteActive } = useSidebarMiCuenta();
  const { Logout, onRouterLink } = useService();

  const [idUser, setIdUser] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("idUser");
    setIdUser(id);
  }, []);

  return (
    <aside className="w-[100%]">
      <ul className="flex w-full flex-col pl-0" style={{ paddingLeft: "0px" }}>
        <li>
          <a
            role="button"
            className="mx-1 block font-medium p-2"
            style={{
              textDecoration: "none",
              fontSize: "18px",
              color: "#BB3D4B",
              fontWeight: "bold",
            }}
          >
            Mi cuenta
          </a>
        </li>
        <li
          onClick={() => onRouterLink("/perfil")}
          className={`${styles.li} ${isRouteActive("/perfil")[1]}`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${isRouteActive("/perfil")[0]}`}
          >
            Mi perfil
          </a>
        </li>
        <li
          onClick={() => onRouterLink("/cambiar-contrasena")}
          className={`${styles.li} ${isRouteActive("/cambiar-contrasena")[1]}`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${
              isRouteActive("/cambiar-contrasena")[0]
            }`}
          >
            Cambiar contraseña
          </a>
        </li>
        {/* <li className={`${styles.li} ${isRouteActive("/mis-pedidos")[1]}`}>
          <a
            role="button"
            onClick={() => onRouterLink("/mis-pedidos")}
            className={`${styles.tagA} ${isRouteActive("/mis-pedidos")[0]}`}
          >
            Mis pedidos
          </a>
        </li> */}

        {/* <li
          className={`${styles.tagA} ${
            isRouteActive("/historial-de-compras")[1]
          }`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${
              isRouteActive("/historial-de-compras")[0]
            }`}
          >
            Historial de compras
          </a>
        </li> */}

        <li
          onClick={() => onRouterLink("/ordenes")}
          className={`${styles.li} ${isRouteActive("/ordenes")[1]}`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${isRouteActive("/ordenes")[0]}`}
          >
            Carrito
          </a>
        </li>

        <li
          onClick={() => onRouterLink("/historial-de-compras")}
          className={`${styles.li} ${
            isRouteActive("/historial-de-compras")[1]
          }`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${
              isRouteActive("/historial-de-compras")[0]
            }`}
          >
            Mis compras
          </a>
        </li>

        {/* <li
          onClick={() => onRouterLink("/mis-compras")}
          className={`${styles.li} ${isRouteActive("/mis-compras")[1]}`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${isRouteActive("/mis-compras")[0]}`}
          >
            Mis compras
          </a>
        </li> */}

        <li>
          <a
            role="button"
            onClick={Logout}
            style={{
              textDecoration: "none",
              color: "#808080",
              fontSize: "14px",
              fontWeight: "500",
              marginLeft: "10px",
            }}
          >
            Cerrar sesión
          </a>
        </li>
      </ul>
      <div className="containerNoCuenta flex justify-center p-3 w-full mt-3">
        <span
          className="relative font-medium text-[#BB3D4B]"
          style={{ fontSize: "18px", fontWeight: "700" }}
        >
          Numero de cliente: 000
          {idUser || 0}
        </span>
      </div>
    </aside>
  );
};

export default SidebarMiCuenta;
