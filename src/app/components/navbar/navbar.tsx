"use client";

import "./navbar.css";
import { MdShoppingCart } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";

import { useTheContext } from "./../../services/globalContext";
import useNavbar from "./useNavbar";
import useService from "@/app/services/useService";
import { MdSettings } from "react-icons/md";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const { onMouseEnter, onMouseLeave, visible } = useTheContext();

  const {
    submenu,
    submenuActivo,
    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    hasToken,
    menuCuentaRef,
    onMouseEnterMenuCuenta,
    onMouseLeaveMenuCuenta,
  } = useNavbar();

  const { onRouterLink, Logout } = useService();

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <span className="cursor-pointer" onClick={() => onRouterLink("/")}>
            PCINBOX
          </span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            id="searchInput"
          />
          <button
          //onclick="performSearch()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        </div>
        <div className="header-actions">
          <div
            className="header-btn relative"
            onMouseEnter={onMouseEnterMenuCuenta}
            onMouseLeave={onMouseLeaveMenuCuenta}
            style={{ position: "relative" }}
          >
            <div
              className="flex items-center gap-1 cursor-pointer"
              style={{ position: "relative" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="black"
                className="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
              Mi cuenta
              <div
                ref={menuCuentaRef}
                className="absolute w-48 bg-white rounded-md shadow-lg z-10 animate-fadeIn"
                style={{
                  marginLeft: "-45px",
                  display: "none",
                  marginTop: "70px",
                }}
              >
                <div className="py-1">
                  <a
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    className=" flex justify-center gap-2 items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-150"
                  >
                    Ajustes
                    <MdSettings size={22} />
                  </a>
                </div>

                {hasToken ? (
                  <div className="py-1">
                    <a
                      style={{
                        textDecoration: "none",
                        color: "black",
                        cursor: "pointer",
                      }}
                      role="button"
                      onClick={Logout}
                      className="flex justify-center gap-2 items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-150"
                    >
                      Cerrar Sesión
                      <MdLogout size={22} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <a href="#" className="header-btn" id="cartBtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="black"
              className="bi bi-cart"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
            Carrito
            <span className="cart-count" id="cartCount">
              0
            </span>
          </a>
        </div>
      </div>
      <div className="container-sub-menu">
        <div
          className="container-categories"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="text-categories">
            <span>Categorías</span>
            <MdArrowDropDown size={30} color="#666666" />
          </div>

          {/* Menu de categorias */}
          <div className="list-categorias" style={{ display: visible }}>
            <ul>
              <li>
                <span>Categoria 1</span>
              </li>
              <li>
                <span>Categoria 2</span>
              </li>
              <li>
                <span>Categoria 3</span>
              </li>
              <li>
                <span>Categoria 4</span>
              </li>
            </ul>
          </div>
        </div>

        <nav className="submenu flex w-full justify-center pb-1">
          <ul>
            {submenu
              .filter((currentSubMenu) => {
                if (hasToken) {
                  return currentSubMenu.label !== "Ingresar";
                }

                return true;
              })
              .map((sub) => {
                return (
                  <li
                    key={sub.id}
                    onMouseEnter={() => onMouseEnterSubmenu(sub.id)}
                    onMouseLeave={() => onMouseLeaveSubMenu()}
                  >
                    <span>{sub.label}</span>
                    {sub.icon}
                    {submenuActivo == sub.id ? sub.html : null}
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
