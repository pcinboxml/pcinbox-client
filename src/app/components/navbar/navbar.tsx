"use client";

import "./navbar.css";
import { MdArrowDropDown, MdClose, MdList, MdAutorenew } from "react-icons/md";
import useNavbar from "./useNavbar";
import useService from "@/app/services/useService";
import { ChangeEvent, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Alert } from "@mui/material";
import useLogin from "@/app/services/useLogin";

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

  const { onRouterLink, formatCurrency, Logout } = useService();
  const {
    messageError,
    showAlert,
    formData,
    loadingLogin,
    closeAlert,
    onSubmit,
    setFormData,
  } = useLogin();
  const pathname = usePathname();
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
          <img src="/logo.png" />
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
            <img src="/carrito.png" />
            <span
              className="absolute badge badge-car"
              style={{ background: "#bb3d4b" }}
            >
              99+
            </span>
          </div>

          <div className="container-cash">
            <b style={{ color: "#BB3D4B" }}>{formatCurrency(0)}</b>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div
          className="container-products"
          onMouseLeave={
            pathname == "/index" || pathname == "/"
              ? () => {}
              : onMouseLeaveProducts
          }
        >
          <button
            className="btn-products"
            onMouseEnter={
              pathname == "/index" || pathname == "/"
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
                pathname == "/index" || pathname == "/" ? "block" : "none",
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

        <div className="container-submenu">
          <div className="icon-hamburguer relative">
            <div className="flex p-0">
              <form action="" className="flex w-full">
                <input
                  type="search"
                  placeholder="¿Qué articulo buscas?"
                  className="w-full border"
                />
                <button
                  style={{
                    width: "100px",
                    color: "#fff",
                    background: "#4d4d4d",
                    borderBottomRightRadius: "25px",
                  }}
                >
                  <span className="px-2 text-white">Buscar</span>
                </button>
              </form>
              <button
                onClick={handleToggleNav}
                id="btnHamburguer"
                className="text-white"
              >
                <MdList size={22} color="white" />
              </button>
            </div>

            {/* Sub menu responsivo para celulares */}
            {navRefResponsive ? (
              <div
                id="container-submenu-responsive"
                className="absolute flex flex-col justify-center shadow container-submenu-responsive bg-white rounded-2xl"
              >
                <ul>
                  <li>
                    <a href="#">{hasToken ? "Mi cuenta" : "Ingresar"}</a>
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
                    <a href="#" style={{ color: "#BB3D4B", fontWeight: "600" }}>
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
                  {hasToken ? "Mi cuenta" : "Ingresar"}
                  <MdArrowDropDown size={22} color="gray" />
                </a>

                <div
                  id="1"
                  style={{ display: "none" }}
                  className="absolute bg-white container-sub-menu shadow"
                >
                  <ul className="list-options-cuenta cursor-default">
                    {!hasToken ? (
                      <>
                        <form className="formLogin" onSubmit={onSubmit}>
                          <div className="form-group">
                            <label htmlFor="1">Email</label>
                            <input
                              type="email"
                              placeholder="Email"
                              className="border"
                              value={formData.email}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email: event.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="2">Contraseña</label>
                            <input
                              type="password"
                              placeholder="Contraseña"
                              className="border"
                              value={formData.password}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>
                              ) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: event.target.value,
                                }))
                              }
                            />
                          </div>
                          <br />
                          {showAlert ? (
                            <Alert
                              color="error"
                              icon
                              className="mb-1 mt-1"
                              action={
                                <button
                                  onClick={(e) => [
                                    e.preventDefault(),
                                    closeAlert(),
                                  ]}
                                >
                                  {" "}
                                  <MdClose />
                                </button>
                              }
                            >
                              <span>{messageError}</span>
                            </Alert>
                          ) : null}

                          <div className="linea"></div>
                          <br />
                          <a href="/forgotpassword">Olvidé mi contraseña</a>
                          <br />
                          <div className="group-btn">
                            <button
                              type="submit"
                              className="cursor-pointer"
                              disabled={loadingLogin}
                            >
                              {loadingLogin ? (
                                <MdAutorenew size={12} />
                              ) : (
                                "Iniciar Sesión"
                              )}
                            </button>
                            <button className="cursor-pointer">
                              Registrarse
                            </button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <div className="flex w-auto container-mi-cuenta flex-col">
                        <ul>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Mi cuenta
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Configuración de cuenta
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Datos de envío, pago y facturación
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Historial de pedidos
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Mi perfil
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Mis PC's configuradas
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                            >
                              Mis reembolso
                            </a>
                          </li>
                        </ul>

                        <button className="btn-logout" onClick={Logout}>
                          Salir de cuenta
                        </button>
                      </div>
                    )}
                    {/* {hasToken ? (
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
                    ) : null} */}
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
                    style={{ color: "#BB3D4B", fontWeight: "600" }}
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
