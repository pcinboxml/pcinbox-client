"use client";
import useService from "@/app/services/useService";
import styles from "./sidebar-mi-cuenta.module.css";
import useSidebarMiCuenta from "./useSidebarMiCuenta";

const SidebarMiCuenta = () => {
  const { isRouteActive } = useSidebarMiCuenta();
  const { onRouterLink } = useService();

  return (
    <aside className="w-[100%] border">
      <ul className="flex w-full flex-col pl-0" style={{ paddingLeft: "0px" }}>
        <li className={`${styles.li} ${isRouteActive("/mi-cuenta")[1]}`}>
          <a
            role="button"
            onClick={() => onRouterLink("/mi-cuenta")}
            className={`${styles.tagA} ${isRouteActive("/mi-cuenta")[0]}`}
          >
            Mi cuenta
          </a>
        </li>
        <li
          className={`${styles.li} ${
            isRouteActive("/configuration-cuenta")[1]
          }`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${
              isRouteActive("/configuration-cuenta")[0]
            }`}
          >
            Configuración de cuenta
          </a>
        </li>
        <li
          className={`${styles.li} ${
            isRouteActive("/datos-envio-pago-facturacion")[1]
          }`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${
              isRouteActive("/datos-envio-pago-facturacion")[0]
            }`}
          >
            Datos de envío, pago y facturación
          </a>
        </li>
        <li
          className={`${styles.li} ${
            isRouteActive("/datos-envio-pago-facturacion")[1]
          }`}
        >
          <a
            role="button"
            className={`${styles.tagA} ${
              isRouteActive("/datos-envio-pago-facturacion")[0]
            }`}
          >
            Historial de pedidos
          </a>
        </li>

        <li className={`${styles.li} ${isRouteActive("/mis-favoritos")[1]}`}>
          <a
            role="button"
            className={`${styles.tagA} ${isRouteActive("/mis-favoritos")[0]}`}
          >
            Mis favoritos
          </a>
        </li>

        <li className={`${styles.li} ${isRouteActive("/perfil")[1]}`}>
          <a
            role="button"
            onClick={() => onRouterLink("/perfil")}
            className={`${styles.tagA} ${isRouteActive("/perfil")[0]}`}
          >
            Mi perfil
          </a>
        </li>
        <li className={styles.li}>
          <a href="#" className={styles.tagA}>
            Mis PC´s configuradas
          </a>
        </li>
        <li className={styles.li}>
          <a href="#" className={styles.tagA}>
            Mis opiniones
          </a>
        </li>

        <li className={styles.li}>
          <a href="#" className={styles.tagA}>
            Mis preguntas
          </a>
        </li>

        <li className={styles.li}>
          <a href="#" className={styles.tagA}>
            Mis respuestas
          </a>
        </li>

        <li className={styles.li}>
          <a href="#" className={styles.tagA}>
            Mis reembolsos
          </a>
        </li>
        <li className={styles.li}>
          <a href="#" className={styles.tagA}>
            Suscripciones
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarMiCuenta;
