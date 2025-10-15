"use client";
import { useState } from "react";
import useNavbar from "../navbar/useNavbar";
import style from "./submenuproducts.module.css";
import { usePathname } from "next/navigation";

const SubMenuProductos = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  const pathname = usePathname();

  const { onMouseEnterProducts, onMouseLeaveProducts, optionProducts } =
    useNavbar();
  return (
    <div
      className="container-products z-10"
      onMouseLeave={
        pathname == "/principal" || pathname == "/"
          ? () => {}
          : onMouseLeaveProducts
      }
    >
      <button
        className="btn-products"
        onMouseEnter={
          pathname == "/principal" || pathname == "/"
            ? () => {}
            : onMouseEnterProducts
        }
      >
        Productos
      </button>

      <div
        ref={optionProducts}
        className="container-list-products absolute bg-white shadow"
        style={{
          display:
            pathname == "/principal" || pathname == "/" ? "block" : "none",
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
    </div>
  );
};

export default SubMenuProductos;
