"use client";

import "./navbar.css";
import {
  MdArrowDropDown,
  MdReceiptLong,
  MdList,
  MdAdjust,
  MdLogin,
  MdPersonAdd,
} from "react-icons/md";
import useNavbar from "./useNavbar";
import useService from "@/app/services/useService";
import { MdSettings } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { MdShoppingCart } from "react-icons/md";
import { useEffect } from "react";

const Navbar = () => {
  const {
    navRefResponsive,
    hasToken,
    navRef,
    optionProducts,
    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    handleToggleNav,
    handleDOM,
    handleDetectedScroll,
    onMouseEnterProducts,
    onMouseLeaveProducts,
  } = useNavbar();

  const { onRouterLink, Logout, formatCurrency } = useService();

  useEffect(() => {
    document.addEventListener("click", handleDOM);
    document.addEventListener("scroll", handleDetectedScroll);
    return () => {
      document.removeEventListener("click", handleDOM),
        document.removeEventListener("scroll", handleDetectedScroll);
    };
  }, []);

  return (
    <header className="main-header" ref={navRef}>
      <div className="container-header flex w-full justify-center p-2 items-center">
        <div className="logo" onClick={() => onRouterLink("/index")}>
          <img src="/LOGO_PCINBOX.jpg" />
        </div>
        <div className="search">
          <form action="" className="flex">
            <input type="search" placeholder="¿Qué articulo buscas?" />
            <button>
              <span className="px-2">Buscar</span>
            </button>
          </form>
        </div>
        <div className="container-car">
          <div className="icon-car relative">
            <MdShoppingCart size={22} />
            <span
              className="absolute  translate-middle badge rounded-pill bg-danger"
              style={{ top: "-35%", left: "50%" }}
            >
              99+
            </span>
          </div>

          <div className="container-cash">
            <b>{formatCurrency(0)}</b>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="container-products" onMouseLeave={onMouseLeaveProducts}>
          <button className="btn-products" onMouseEnter={onMouseEnterProducts}>
            Productos
          </button>

          <div
            ref={optionProducts}
            className="container-list-products absolute bg-white shadow"
            style={{ display: "none" }}
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

        <div className="container-submenu">
          <div className="icon-hamburguer relative">
            <button onClick={handleToggleNav} id="btnHamburguer">
              <MdList size={22} color="white" />
            </button>

            {/* Sub menu responsivo para celulares */}
            {navRefResponsive ? (
              <div
                id="container-submenu-responsive"
                className="absolute flex flex-col justify-center shadow container-submenu-responsive bg-white rounded-2xl"
              >
                <ul>
                  <li>
                    <a href="#">Mi cuenta</a>
                    <MdArrowDropDown size={22} color="gray" />
                  </li>
                  <li>
                    <a href="#">Favoritos (0)</a>
                    <MdArrowDropDown size={22} color="gray" />
                  </li>
                  <li>
                    <a href="#">Comparar (0)</a>
                    <MdArrowDropDown size={22} color="gray" />
                  </li>
                  <li>
                    <a href="#">Configurador de PC</a>
                    <MdArrowDropDown size={22} color="gray" />
                  </li>
                  <li>
                    <a href="#" style={{ color: "#2F6AAC", fontWeight: "600" }}>
                      ¿Eres nuevo? ¡Registrate!
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
            {/*Fin Sub menu responsivo para celulares */}
          </div>
          <div className="submenu">
            <ul>
              <li
                className="relative"
                onMouseEnter={() => onMouseEnterSubmenu("1")}
                onMouseLeave={() => onMouseLeaveSubMenu("1")}
              >
                <a href="#">
                  Mi cuenta
                  <MdArrowDropDown size={22} color="gray" />
                </a>

                <div
                  id="1"
                  style={{ display: "none" }}
                  className="absolute bg-white container-sub-menu shadow"
                >
                  <ul className="list-options-cuenta">
                    {!hasToken ? (
                      <>
                        <li className="hover:bg-gray-100">
                          <a
                            role="button"
                            onClick={() => onRouterLink("/login")}
                          >
                            <MdLogin size={22} />
                            Iniciar Sesión
                          </a>
                        </li>
                        <li className="hover:bg-gray-100">
                          <a
                            role="button"
                            onClick={() => onRouterLink("/register")}
                          >
                            <MdPersonAdd size={22} />
                            Registrate
                          </a>
                        </li>
                      </>
                    ) : null}
                    {hasToken ? (
                      <li className="hover:bg-gray-100">
                        <a
                          role="button"
                          onClick={() => onRouterLink("/configUser")}
                        >
                          <MdSettings size={22} />
                          Ajustes generales
                        </a>
                      </li>
                    ) : null}
                    {hasToken ? (
                      <li className="hover:bg-gray-100">
                        <a role="button" onClick={() => Logout()}>
                          <MdLogout size={22} />
                          Cerrar sesión
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </li>
              <li
                className="relative"
                onMouseEnter={() => onMouseEnterSubmenu("2")}
                onMouseLeave={() => onMouseLeaveSubMenu("2")}
              >
                <a href="#">
                  Favoritos (0)
                  <MdArrowDropDown size={22} color="gray" />
                </a>

                <div
                  id="2"
                  className="absolute w-full h-96 bg-white"
                  style={{ top: "100%", zIndex: "90", display: "none" }}
                >
                  contenido
                </div>
              </li>
              <li>
                <a href="#">Comparar (0)</a>
                <MdArrowDropDown size={22} color="gray" />
              </li>
              <li>
                <a href="#">Configurador de PC</a>
                <MdArrowDropDown size={22} color="gray" />
              </li>
              {!hasToken ? (
                <li>
                  <a
                    role="button"
                    onClick={() => {
                      onRouterLink("/register");
                    }}
                    style={{ color: "#2F6AAC", fontWeight: "600" }}
                  >
                    ¿Eres nuevo? ¡Registrate!
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
