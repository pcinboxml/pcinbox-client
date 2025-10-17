"use client";
import { useTheContext } from "@/app/services/globalContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SubMenuProductos = ({ styles }: { styles?: any }) => {
  const { showProductsMenu } = useTheContext();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const isVisible =
    pathname === "/principal" || pathname === "/" || showProductsMenu;

  return (
    <div
      className={`container-list-products absolute bg-white shadow ${
        isVisible ? "block" : "hidden"
      }`}
      style={{
        zIndex: 999, // Asegura visibilidad
        ...styles,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
        }}
      >
        <ul>
          <li>
            <a href="#">Procesadores</a>
          </li>
          <li>
            <a href="#">Tarjetas de video</a>
          </li>
          <li>
            <a href="#">Placas madre</a>
          </li>
          <li>
            <a href="#">Memoria Ram</a>
          </li>
          <li>
            <a href="#">Almacenamiento</a>
          </li>
          <li>
            <a href="#">Gabinetes para PC</a>
          </li>
          <li>
            <a href="#">Fuentes de Poder</a>
          </li>
          <li>
            <a href="#">Enfriamientos</a>
          </li>
          <li>
            <a href="#">Monitores</a>
          </li>
          <li>
            <a href="#">Teclados</a>
          </li>
          <li>
            <a href="#">Mouse</a>
          </li>
          <li>
            <a href="#">Energia</a>
          </li>
          <li>
            <a href="#">Redes</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubMenuProductos;
