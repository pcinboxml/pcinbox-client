"use client";

import "./navbar.css";
import {
  MdArrowDropDown,
  MdClose,
  MdList,
  MdAutorenew,
  MdFavorite,
} from "react-icons/md";
import useNavbar from "./useNavbar";
import useService from "@/app/services/useService";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Alert } from "@mui/material";
import useLogin from "@/app/services/useLogin";
import { FcGoogle } from "react-icons/fc";
import { Cart, ModalCart } from "../cart/Cart";
import { useTheContext } from "@/app/services/globalContext";
import useCart from "../cart/useCart";
import { useSession } from "next-auth/react";
import usePerfil from "@/app/perfil/usePerfil";
import SubMenuProductos from "../subMenuProductos/SubMenuProductos";
import SearchProduct from "../searchProduct/SearchProduct";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const {
    navRefResponsive,
    navRef,

    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    handleToggleNav,
    handleDOM,
    handleDetectedScroll,
    handleClickTopScroll,
    onMouseEnterProducts,
    onMouseLeaveProducts,
    setNavRefResponsive,
  } = useNavbar();

  const { onRouterLink, formatCurrency, Logout, isTokenExpired } = useService();
  const {
    messageError,
    showAlert,
    formData,
    loadingLogin,
    loadingLoginGoogle,
    closeAlert,
    onSubmit,
    setFormData,
    onLoginGoogle,
  } = useLogin();

  const {
    dataCart,
    setHasToken,
    hasToken,
    rutaImgPerfil,
    dataFavorites,
    socketPagos,
  } = useTheContext();
  const { onMouseEnterCart, onMouseLeaveCart, showDivCart } = useCart();
  const { data: session, status } = useSession();
  const { getPhotoUser } = usePerfil();
  const [isFocusedSearch, setIsFocusedSearch] = useState<boolean>(false);
  const pathname = usePathname();

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  useEffect(() => {
    document.addEventListener("click", handleDOM);
    document.addEventListener("scroll", handleDetectedScroll);
    return () => {
      document.removeEventListener("click", handleDOM),
        document.removeEventListener("scroll", handleDetectedScroll);
    };
  }, []);

  useEffect(() => {
    const authGoogle = localStorage.getItem("authGoogle");

    if (session && status == "authenticated" && authGoogle == "true") {
      const token = (session as any)?.token;
      const idUser = (session as any)?.idUser;
      const isValidToken = (session as any)?.isValidToken;
      if (token && token !== "undefined" && token !== "null") {
        localStorage.setItem("token", token);
        localStorage.setItem("email", session.user?.email!);
        localStorage.setItem("name", session.user?.name!);
        localStorage.setItem("idUser", idUser);
        localStorage.setItem("lastname", "");
        socketPagos.current?.emit("idUser", idUser);

        if (isValidToken.idUser) {
          setHasToken(true);
        } else {
          setHasToken(false);
        }
      }
    } else if (authGoogle == "false") {
      if (localStorage.getItem("token")) {
        const validToken = isTokenExpired(localStorage.getItem("token")!);
        socketPagos.current?.emit("idUser", localStorage.getItem("idUser"));

        setHasToken(validToken == true ? false : true);
        // setHasToken(true);
      } else {
        setHasToken(false);
      }
    }
  }, [session, status]);

  useEffect(() => {
    if (hasToken) {
      getPhotoUser();
    }
  }, [hasToken]);

  return (
    <header className="main-header" ref={navRef}>
      <div className="flex justify-between px-5 py-1 bg-[#bb3d4b]">
        <span className="text-white font-bold">¡Bienvenido a PCINBOX!</span>
        <span className="text-white" style={{ fontStyle: "italic" }}>
          Tenemos lo más destacado en Gaming!
        </span>
      </div>
      <div className="container-header container flex w-full justify-center p-2 items-center">
        <div className="logo" onClick={() => onRouterLink("/principal")}>
          <img src="/logo.png" />
        </div>
        <div className="search">
          {isFocusedSearch && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-19"
              onClick={() => setIsFocusedSearch(false)}
            />
          )}

          <SearchProduct setIsFocusedSearch={setIsFocusedSearch} />
        </div>
        <div className="container-car container-car-first">
          <div className="icon-car relative cursor-pointer">
            <div onMouseEnter={onMouseEnterCart}>
              <Cart />
            </div>

            <ModalCart
              showDivCart={showDivCart}
              onMouseLeaveCart={onMouseLeaveCart}
            />

            {dataCart && dataCart.length > 0 ? (
              <span
                className="absolute badge badge-car"
                style={{ background: "#bb3d4b" }}
              >
                {dataCart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            ) : null}
          </div>

          <div className="container-cash">
            <b style={{ color: "#BB3D4B" }}>{formatCurrency(totalPrice)}</b>
          </div>
        </div>
      </div>
      <div className="flex container">
        <div
          className="container-products"
          // onMouseLeave={onMouseLeaveProducts}
          style={{ position: "relative", zIndex: 100 }} // Asegúrate del zIndex
        >
          {/* <button
            className="btn-products"
            onMouseEnter={onMouseEnterProducts}
            onClick={() => {
              pathname === "/principal" || pathname === "/"
                ? handleClickTopScroll()
                : null;
            }}
          >
            Productos
          </button> */}

          {/* {pathname != "/principal" && pathname != "/" ? (
            <SubMenuProductos />
          ) : null} */}
        </div>
        {/* <div
          className="container-products"
          onMouseLeave={() => {
            // pathname == "/principal" || pathname == "/"
            //   ? null
            //   :
            onMouseLeaveProducts();
          }}
        >
          <button
            className="btn-products"
            onClick={() => {
              pathname == "/principal" || pathname == "/"
                ? handleClickTopScroll()
                : null;
            }}
            onMouseEnter={() => {
              // pathname == "/principal" || pathname == "/"
              //   ? null
              //   :
              onMouseEnterProducts();
            }}
          >
            Productos
          </button> */}

        {/* {pathname != "/principal" && pathname != "/" ? ( */}
        {/* <SubMenuProductos /> */}
        {/* // ) : null} */}
        {/* </div> */}

        <div className="container-submenu">
          {/* <div className="icon-hamburguer relative">
            <div className="flex p-0">
              <button
                onClick={handleToggleNav}
                id="btnHamburguer"
                className="text-white"
              >
                <MdList size={22} color="white" />
              </button>
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
            </div> */}

          {/* Sub menu responsivo para tablets */}
          {/* {navRefResponsive ? (
              <div
                id="container-submenu-responsive"
                className="absolute flex flex-col justify-center shadow container-submenu-responsive bg-white rounded-2xl"
              >
                <ul>
                  <li>
                    <a
                      role="button"
                      onClick={() =>
                        hasToken
                          ? [
                              onRouterLink("/perfil"),
                              setNavRefResponsive(false),
                            ]
                          : {}
                      }
                      className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                    >
                      {hasToken ? "Mi cuenta" : "Ingresar"}
                    </a>
                  </li>
                  <li>
                    <a
                      role="button"
                      className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                    >
                      Favoritos (0)
                    </a>
                  </li>

                  <li>
                    <a href="#">Configurador de PC</a>
                    <MdArrowDropDown size={22} color="gray" />
                  </li>
                  <li>
                    <a
                      role="button"
                      onClick={() => onRouterLink("/register")}
                      style={{ color: "#BB3D4B", fontWeight: "600" }}
                    >
                      ¿Eres nuevo? ¡Registrate!
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="border w-full flex p-2"
                      style={{
                        background: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        gap: "10px",
                      }}
                      disabled={loadingLoginGoogle}
                      onClick={onLoginGoogle}
                    >
                      {loadingLoginGoogle ? (
                        <MdAutorenew size={20} className="m-auto the-spinner" />
                      ) : (
                        <>
                          <FcGoogle size={20} />
                          Iniciar Sesión con Google
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            ) : null} */}
          {/*Fin Sub menu responsivo para celulares */}
          {/* </div> */}
          {/* {console.log(hasToken)}
          {hasToken != null ? ( */}
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
                  style={{ display: "none", left: "-50px" }}
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
                                <MdAutorenew
                                  size={20}
                                  className="m-auto the-spinner"
                                />
                              ) : (
                                "Iniciar Sesión"
                              )}
                            </button>
                            <button
                              type="button"
                              className="cursor-pointer"
                              onClick={() => onRouterLink("/register")}
                            >
                              Registrarse
                            </button>
                          </div>

                          <div className="containerLineaDivisora flex w-full mt-3 justify-center items-center gap-2">
                            <div
                              style={{
                                width: "40%",
                                height: "4px",
                                background: "#ccc",
                                border: "1px solid #ccc",
                              }}
                            ></div>
                            <span style={{ color: "gray", fontSize: "18px" }}>
                              o
                            </span>
                            <div
                              style={{
                                width: "40%",
                                height: "4px",
                                border: "1px solid #ccc",
                                background: "#ccc",
                              }}
                            ></div>
                          </div>

                          <div className="mt-2 flex w-full justify-center p-1">
                            <button
                              type="button"
                              className="border w-full flex justify-center gap-2 items-center p-2"
                              onClick={onLoginGoogle}
                            >
                              {loadingLoginGoogle ? (
                                <MdAutorenew
                                  size={20}
                                  className="m-auto the-spinner"
                                />
                              ) : (
                                <>
                                  <FcGoogle size={22} />
                                  Iniciar Sesion con Google
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <div
                        className="flex w-auto container-mi-cuenta"
                        style={{ zIndex: "120" }}
                      >
                        <div className="containerImageUser min-w-[180px] min-h-[200px] mt-2 flex flex-col">
                          <img
                            src={
                              rutaImgPerfil == "" ? "/user.jpeg" : rutaImgPerfil
                            }
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "contain",
                              margin: "auto",
                            }}
                          />

                          <span
                            className="text-[#A67845] text-center"
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              marginTop: "10px",
                            }}
                          >
                            {`${
                              localStorage.getItem("name")
                                ? localStorage.getItem("name")
                                : ""
                            }
                              
                              ${
                                localStorage.getItem("lastname")
                                  ? localStorage.getItem("lastname")
                                  : ""
                              }
                              
                              `}
                          </span>
                        </div>

                        <div className="ml-2 flex flex-col justify-center min-w-[150px]">
                          <ul className="pl-0 pr-2">
                            {[
                              {
                                path: "/perfil",
                                name: "Mi perfil",
                              },
                              {
                                path: "/cambiar-contrasena",
                                name: "Cambiar contraseña",
                              },
                              {
                                path: "/mis-pedidos",
                                name: "Mis pedidos",
                              },
                              {
                                path: "/ordenes",
                                name: "Carrito",
                              },
                              {
                                path: "/historial-de-compras",
                                name: "Mis compras",
                              },
                              // {
                              //   path: "/mis-compras",
                              //   name: "Mis compras",
                              // },
                            ].map((item: any) => {
                              return (
                                <li key={item.path}>
                                  <a
                                    role="button"
                                    className="
                              hover:!text-[#bb3d4b] 
                              hover:!font-semibold 
                              hover:!underline 
                              hover:!decoration-[#a67845] 
                              hover:!decoration-[3px]"
                                    onClick={() => onRouterLink(item.path)}
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>

                          <button className="btn-logout" onClick={Logout}>
                            Salir de la cuenta
                          </button>
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              </li>
              <li
                className="relative"
                onMouseEnter={() => onMouseEnterSubmenu("2")}
                onMouseLeave={() => onMouseLeaveSubMenu("2")}
              >
                <a href="#">
                  Favoritos ({dataFavorites.length.toLocaleString()})
                  <MdArrowDropDown size={22} color="gray" />
                </a>

                <div
                  id="2"
                  className="absolute w-auto  bg-white p-1 cursor-default shadow-2xl rounded"
                  style={{ top: "100%", zIndex: "60", display: "none" }}
                >
                  {dataFavorites && dataFavorites.length > 0 ? (
                    <div className="grid grid-cols-[1fr_1fr] w-[450px] border">
                      <div className="p-3 flex flex-col">
                        <span
                          className="text-[#bb3d4b] text-center"
                          style={{ fontSize: "18px", fontWeight: "bold" }}
                        >
                          Mis favoritos
                        </span>
                        <a
                          className="text-[#606060] text-sm text-center underline decoration-[#a67845] decoration-[3px]"
                          style={{
                            fontSize: "10px",
                            borderBottom: "3px solid #a67845",
                          }}
                        >
                          {dataFavorites.length.toLocaleString()} Articulos
                          (predeterminada)
                        </a>
                      </div>

                      <div
                        className="flex flex-col justify-center items-center"
                        style={{
                          boxShadow:
                            "inset 10px 0px 20px -10px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <div className="w-full flex justify-center flex-wrap mb-3 mt-3">
                          {dataFavorites &&
                            dataFavorites.length > 0 &&
                            dataFavorites.slice(0, 3).map((item, index) => {
                              return (
                                <img
                                  key={index}
                                  src={item.image_url[0]}
                                  width={50}
                                  height={50}
                                  style={{ objectFit: "contain" }}
                                />
                              );
                            })}
                        </div>
                        <div className="w-full flex justify-center mb-2">
                          <button
                            className="border px-4 py-1 bg-white"
                            onClick={() => onRouterLink("/favorites")}
                          >
                            Ver lista
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-[200px] flex justify-center items-center p-2"
                      style={{ borderRadius: "10px" }}
                    >
                      <span
                        className="text-[#bb3d4b]"
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          textAlign: "center",
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        No tienes productos favoritos
                        <MdFavorite
                          size={20}
                          color="#bb3d4b"
                          className="mx-2"
                        />
                      </span>
                    </div>
                  )}
                </div>
              </li>

              {/* <li>
                <a href="#">Configurador de PC</a>
                <MdArrowDropDown size={22} color="gray" />
              </li> */}
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
          {/* // ) : null} */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
