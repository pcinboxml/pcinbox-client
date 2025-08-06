"use client";

import "./navbar.css";
import { MdShoppingCart } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";

import { useTheContext } from "./../../services/globalContext";
import useNavbar from "./useNavbar";

const Navbar = () => {
  const { onMouseEnter, onMouseLeave, visible } = useTheContext();

  const { submenu, submenuActivo, onMouseEnterSubmenu, onMouseLeaveSubMenu } =
    useNavbar();
  return (
    <nav className="menu  pt-1 pl-7 flex flex-row flex-wrap">
      <div style={{ width: "90%" }}>
        <div
          className="flex flex-row p-2 items-center"
          style={{ width: "100%" }}
        >
          <div className="logo">
            <img src="/logo.png" width={50} height={50} />
          </div>
          <form className="form">
            <input type="text" placeholder="¿Qué deseas buscar?" />
            <button className="btnSubmit bg-amber-300 shadow-amber-50 font-bold">
              Buscar
            </button>
          </form>
        </div>

        <div className="flex  justify-center container-sub-menu">
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
              {submenu.map((sub) => (
                <li
                  key={sub.id}
                  onMouseEnter={() => onMouseEnterSubmenu(sub.id)}
                  onMouseLeave={() => onMouseLeaveSubMenu()}
                >
                  <span>{sub.label}</span>
                  {sub.icon}
                  {submenuActivo == sub.id ? sub.html : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="container-icon-car">
        <MdShoppingCart size={30} style={{ color: "gray" }} />

        <span className="total">$10.00</span>
      </div>
    </nav>
  );
};

export default Navbar;
