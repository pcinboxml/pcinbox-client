"use client";
import { usePathname } from "next/navigation";
import styles from "./sidebar-mi-cuenta.module.css";

const useSidebarMiCuenta = () => {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    return pathname == href ? [styles.activeA, styles.activeLi] : ["", ""];
  };

  return {
    isRouteActive,
  };
};

export default useSidebarMiCuenta;
