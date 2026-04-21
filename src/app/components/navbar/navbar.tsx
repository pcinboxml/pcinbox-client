"use client";

import "./navbar.css";
import {
  MdArrowDropDown,
  MdClose,
  MdList,
  MdAutorenew,
  MdFavorite,
  MdLaptop,
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
import usePerfil from "@/app/perfil/usePerfil";
import SubMenuProductos from "../subMenuProductos/SubMenuProductos";
import SearchProduct from "../searchProduct/SearchProduct";
import { usePathname } from "next/navigation";
import useStorage from "@/app/services/useStorage";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const {
    navRefResponsive,
    navRef,
    showProductsMenu,
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
  const { dataCartStorege } = useStorage();
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
    setDataCart,
    setHasToken,
    hasToken,
    rutaImgPerfil,
    dataFavorites,
    socketPagos,
    dataCategories,
  } = useTheContext();
  const [totalItems, setTotalItems] = useState<number>(0);
  const { onMouseEnterCart, onMouseLeaveCart, showDivCart } = useCart();
  const { totalPrice } = useService();
  const { data: session, status } = useSession();
  const { getPhotoUser } = usePerfil();
  const [isFocusedSearch, setIsFocusedSearch] = useState<boolean>(false);
  const { handleWriteStorageDataCart } = useStorage();

  useEffect(() => {
    document.addEventListener("click", handleDOM);
    document.addEventListener("scroll", handleDetectedScroll);
    return () => {
      (document.removeEventListener("click", handleDOM),
        document.removeEventListener("scroll", handleDetectedScroll));
    };
  }, []);

  useEffect(() => {
    const authGoogle = localStorage.getItem("authGoogle");

    if (session && status == "authenticated" && authGoogle == "true") {
      const token = (session as any)?.token;
      const idUser = (session as any)?.idUser;
      const isValidToken = (session as any)?.isValidToken;
      if (token && token !== "undefined" && token !== "null" && token != null) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", session.user?.email!);
        localStorage.setItem("name", session.user?.name!);
        localStorage.setItem("idUser", idUser);
        localStorage.setItem("lastname", "");

        if (isValidToken?.idUser) {
          const now = Math.floor(Date.now() / 1000);

          // validar
          if (isValidToken?.exp < now) {
            setHasToken(false);
          } else {
            setHasToken(true);
          }
        }
      }
    } else if (authGoogle == "false") {
      if (localStorage.getItem("token")) {
        const validToken = isTokenExpired(localStorage.getItem("token")!);

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

  // useEffect(() => {
  //   if (dataCart.length === 0 && dataCartStorege.length > 0) {
  //     setDataCart(dataCartStorege);
  //   }
  // }, []);

  useEffect(() => {
    // Siempre prioriza dataCart sobre dataCartStorege
    const items = dataCart;

    const total = items
      .filter((item) => Number(item.stock) !== 0)
      .reduce((acc, item) => acc + Number(item.quantity), 0);

    setTotalItems(total);

    // Sincroniza el storage con el estado global
    // handleWriteStorageDataCart(dataCart);
  }, [dataCart, dataCartStorege]);

  // En tu componente Navbar.tsx

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
          <img src="/logo.png" loading="lazy" />
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

            {totalItems > 0 && (
              <span
                className="absolute badge badge-car"
                style={{ background: "#bb3d4b" }}
              >
                {totalItems}
              </span>
            )}
          </div>

          <div className="container-cash">
            <b style={{ color: "#BB3D4B" }}>{formatCurrency(totalPrice)}</b>
          </div>
        </div>
      </div>
      <div className="flex container">
        <div
          className="container-products"
          // onMouseLeave={
          //   pathname == "/principal" || pathname == "/"
          //     ? () => {}
          //     : onMouseLeaveProducts
          // }
          // onMouseEnter={
          //   pathname == "/principal" || pathname == "/"
          //     ? () => {}
          //     : onMouseEnterProducts
          // }
        >
          <button
            className="btn-products"
            onMouseEnter={onMouseEnterProducts}
            onMouseLeave={onMouseLeaveProducts}
          >
            Productos
            {/* {showProductsMenu && <SubMenuProductos  />} */}
          </button>

          {/* <div
            // ref={showProductsMenu}
            className="container-list-products absolute bg-white shadow"
            style={{
              display:
                pathname == "/principal" || pathname == "/" ? "block" : "none",
            }}
          >
            <SubMenuProductos />
            {/* <ul>
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
          </div> */}
        </div>
        <button
          className="bg-[#BB3D4B] rounded text-white font-bold flex items-center gap-2 px-3 py-2 whitespace-nowrap"
          style={{
            marginLeft: "-10px",
          }}
          onClick={() => {
            let findIdCategory = dataCategories.find(
              (category) => category.name === "LAPTOPS",
            );
            if (findIdCategory) {
              onRouterLink(
                `/result-search-category?categoryId=${findIdCategory?.idCategorie}`,
              );
            }
          }}
        >
          Gama de Laptops 2026 <MdLaptop size={26} />
        </button>

        {/* <div
          className="container-products"
          style={{ position: "relative", zIndex: 100 }} // Asegúrate del zIndex
        >
          <SubMenuProductos />
        </div> */}

        <div className="container-submenu">
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
                                event: ChangeEvent<HTMLInputElement>,
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
                                event: ChangeEvent<HTMLInputElement>,
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
                              onClick={() => {
                                onLoginGoogle();
                              }}
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
                            loading="lazy"
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
                              // {
                              //   path: "/mis-pedidos",
                              //   name: "Mis pedidos",
                              // },
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
                                  loading="lazy"
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
