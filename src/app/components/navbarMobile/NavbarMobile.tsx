"use client";

import "./../navbar/navbar.css";
import "./navbarResponsive.css";
import {
  MdArrowDropDown,
  MdClose,
  MdList,
  MdAutorenew,
  MdFavorite,
  MdMenu,
  MdSearch,
  MdShoppingCart,
  MdPerson,
  MdHome,
  MdChevronRight,
  MdLaptop,
} from "react-icons/md";
import useNavbar from "./../navbar/useNavbar";
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
import useStorage from "@/app/services/useStorage";
import { useSession } from "next-auth/react";
import Image from "next/image";

const NavbarResponsive = () => {
  const {
    openSubmenu,
    navRef,
    showProductsMenu,
    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    handleToggleNav,
    handleDOM,
    handleDetectedScroll,
    onMouseEnterProducts,
    onMouseLeaveProducts,
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
    dataCategories,
    totalFavorites,
  } = useTheContext();

  const [totalItems, setTotalItems] = useState<number>(0);
  const { onMouseEnterCart, onMouseLeaveCart, showDivCart } = useCart();
  // const { totalPrice } = useService();
  const { data: session, status } = useSession();
  const { getPhotoUser } = usePerfil();
  const [isFocusedSearch, setIsFocusedSearch] = useState<boolean>(false);

  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<
    "main" | "login" | "account" | "products" | "search"
  >("main");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleDOM);
    document.addEventListener("scroll", handleDetectedScroll);
    return () => {
      document.removeEventListener("click", handleDOM);
      document.removeEventListener("scroll", handleDetectedScroll);
    };
  }, []);

  useEffect(() => {
    const authGoogle = localStorage.getItem("authGoogle");
    if (session && status === "authenticated" && authGoogle === "true") {
      const token = (session as any)?.token;
      const idUser = (session as any)?.idUser;
      const isValidToken = (session as any)?.isValidToken;
      const totalFavoritesSession = (session as any)?.totalFavorites;
      console.log(totalFavoritesSession);

      if (token && token !== "undefined" && token !== "null" && token != null) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", session.user?.email!);
        localStorage.setItem("name", session.user?.name!);
        localStorage.setItem("idUser", idUser);
        localStorage.setItem("lastname", "");
        if (isValidToken?.idUser) {
          const now = Math.floor(Date.now() / 1000);
          setHasToken(isValidToken?.exp < now ? false : true);
        }
      }
    } else if (authGoogle === "false") {
      if (localStorage.getItem("token")) {
        const validToken = isTokenExpired(localStorage.getItem("token")!);
        setHasToken(validToken === true ? false : true);
      } else {
        setHasToken(false);
      }
    }
  }, [session, status]);

  useEffect(() => {
    if (hasToken) getPhotoUser();
  }, [hasToken]);

  useEffect(() => {
    const total = dataCart
      .filter((item) => Number(item.stock) !== 0)
      .reduce((acc, item) => acc + Number(item.quantity), 0);
    setTotalItems(total);
  }, [dataCart, dataCartStorege]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileView("main");
  };

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
        .filter((itemF) => itemF.stock != 0)
        .map((item) => Number(item.price) * item.quantity)
        .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart, dataCartStorege]);

  return (
    <>
      {/* ======================== DESKTOP NAVBAR (original behavior) ======================== */}
      <header className="main-header desktop-only" ref={navRef}>
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
          <div className="container-products">
            <button
              className="btn-products"
              onMouseEnter={onMouseEnterProducts}
              onMouseLeave={onMouseLeaveProducts}
            >
              Productos
              {showProductsMenu && <SubMenuProductos forceVisible={false} />}
            </button>
          </div>
          <div>
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
                  closeMobileMenu();
                }
              }}
            >
              Gama de Laptops 2026 <MdLaptop size={26} />
            </button>
          </div>
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
                    style={{
                      display: openSubmenu === "1" ? "block" : "none",
                      left: "-50px",
                    }}
                    className="absolute bg-white container-sub-menu shadow"
                  >
                    <ul className="list-options-cuenta cursor-default">
                      {!hasToken ? (
                        <form className="formLogin" onSubmit={onSubmit}>
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              placeholder="Email"
                              className="border"
                              value={formData.email}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Contraseña</label>
                            <input
                              type="password"
                              placeholder="Contraseña"
                              className="border"
                              value={formData.password}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <br />
                          {showAlert && (
                            <Alert
                              color="error"
                              icon
                              className="mb-1 mt-1"
                              action={
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    closeAlert();
                                  }}
                                >
                                  <MdClose />
                                </button>
                              }
                            >
                              <span>{messageError}</span>
                            </Alert>
                          )}
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
                      ) : (
                        <div
                          className="flex w-auto container-mi-cuenta"
                          style={{ zIndex: "120" }}
                        >
                          <div className="containerImageUser min-w-[180px] min-h-[200px] mt-2 flex flex-col">
                            <Image
                              alt="Foto de perfil"
                              width={120}
                              height={120}
                              src={
                                rutaImgPerfil === ""
                                  ? "/user.jpeg"
                                  : rutaImgPerfil
                              }
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "contain",
                                margin: "auto",
                              }}

                              priority={true}
                            />
                            <span
                              className="text-[#A67845] text-center"
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                marginTop: "10px",
                              }}
                            >
                              {`${localStorage.getItem("name") || ""} ${localStorage.getItem("lastname") || ""}`}
                            </span>
                          </div>
                          <div className="ml-2 flex flex-col justify-center min-w-[150px]">
                            <ul className="pl-0 pr-2">
                              {[
                                { path: "/perfil", name: "Mi perfil" },
                                {
                                  path: "/cambiar-contrasena",
                                  name: "Cambiar contraseña",
                                },
                                { path: "/ordenes", name: "Carrito" },
                                {
                                  path: "/historial-de-compras",
                                  name: "Mis compras",
                                },
                              ].map((item: any) => (
                                <li key={item.path}>
                                  <a
                                    role="button"
                                    className="hover:!text-[#bb3d4b] hover:!font-semibold hover:!underline hover:!decoration-[#a67845] hover:!decoration-[3px]"
                                    onClick={() => onRouterLink(item.path)}
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              ))}
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
                    Favoritos ({(totalFavorites ?? 0).toLocaleString()})
                    <MdArrowDropDown size={22} color="gray" />
                  </a>
                  <div
                    id="2"
                    className="absolute w-auto bg-white p-1 cursor-default shadow-2xl rounded"
                    // style={{ top: "100%", zIndex: "60", display: "none" }}
                    style={{
                      display: openSubmenu === "2" ? "block" : "none",
                      zIndex: "60",
                      top: "100%",
                    }}
                  >
                    {(totalFavorites ?? 0) > 0 ? (
                      <div className="grid grid-cols-[1fr_1fr] w-[450px] border">
                        <div className="p-3 flex flex-col">
                          <span
                            className="text-[#bb3d4b] text-center"
                            style={{ fontSize: "18px", fontWeight: "bold" }}
                          >
                            Mis favoritos
                          </span>
                          <a
                            className="text-[#606060] text-sm text-center"
                            style={{
                              fontSize: "10px",
                              borderBottom: "3px solid #a67845",
                            }}
                          >
                            {(totalFavorites ?? 0)} Articulos (predeterminada)
                          </a>
                        </div>
                        <div
                          className="flex flex-col justify-center items-center"
                          style={{
                            boxShadow:
                              "inset 10px 0px 20px -10px rgba(0,0,0,0.3)",
                          }}
                        >
                          {/* <div className="w-full flex justify-center flex-wrap mb-3 mt-3">
                            {dataFavorites.slice(0, 3).map((item, index) => (
                              <img
                                key={index}
                                src={item.image_url[0]}
                                width={50}
                                height={50}
                                style={{ objectFit: "contain" }}
                                loading="lazy"
                              />
                            ))}
                          </div> */}
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
                {!hasToken && (
                  <li>
                    <a
                      role="button"
                      onClick={() => onRouterLink("/register")}
                      style={{ color: "#BB3D4B", fontWeight: "600" }}
                    >
                      ¿Eres nuevo? ¡Registrate!
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* ======================== MOBILE / TABLET NAVBAR ======================== */}
      <header className="mobile-navbar">
        {/* Top bar */}
        <div className="mobile-topbar">
          <div className="mobile-topbar-inner">
            <span>¡Bienvenido a PCINBOX!</span>
            <span style={{ fontStyle: "italic" }}>Gaming</span>
          </div>
        </div>

        {/* Main bar */}
        <div className="mobile-mainbar">
          <button
            className="mobile-hamburger"
            onClick={() => {
              setMobileMenuOpen(true);
              setMobileView("main");
            }}
          >
            <MdMenu size={26} color="#333" />
          </button>

          <div
            className="mobile-logo"
            onClick={() => onRouterLink("/principal")}
          >
            <img src="/logo.png" loading="lazy" alt="PCINBOX" />
          </div>

          <div className="mobile-actions">
            <button
              className="mobile-action-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <MdSearch size={24} color="#333" />
            </button>
            <button
              className="mobile-action-btn relative"
              onClick={() => onRouterLink("/ordenes")}
            >
              <MdShoppingCart size={24} color="#333" />
              {totalItems > 0 && (
                <span className="mobile-cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="mobile-search-bar">
            <SearchProduct setIsFocusedSearch={setIsFocusedSearch} />
            <button
              className="mobile-search-close"
              onClick={() => setSearchOpen(false)}
            >
              <MdClose size={22} />
            </button>
          </div>
        )}
      </header>

      {/* ======================== MOBILE SIDE DRAWER ======================== */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="drawer-header">
              <img src="/logo.png" alt="PCINBOX" className="drawer-logo" />
              <button className="drawer-close" onClick={closeMobileMenu}>
                <MdClose size={24} />
              </button>
            </div>

            {/* ---- MAIN VIEW ---- */}
            {mobileView === "main" && (
              <div className="drawer-content">
                {hasToken && (
                  <div className="drawer-user-card">
                    <img
                      src={rutaImgPerfil === "" ? "/user.jpeg" : rutaImgPerfil}
                      alt="perfil"
                      className="drawer-user-avatar"
                    />
                    <div>
                      <p className="drawer-user-name">
                        {`${localStorage.getItem("name") || ""} ${localStorage.getItem("lastname") || ""}`.trim()}
                      </p>
                      <p className="drawer-user-email">
                        {localStorage.getItem("email") || ""}
                      </p>
                    </div>
                  </div>
                )}

                <nav className="drawer-nav">
                  <button
                    className="drawer-nav-item"
                    onClick={() => {
                      onRouterLink("/principal");
                      closeMobileMenu();
                    }}
                  >
                    <MdHome size={20} color="#bb3d4b" />
                    <span>Inicio</span>
                    <MdChevronRight
                      size={18}
                      color="#ccc"
                      className="ml-auto"
                    />
                  </button>

                  <button
                    className="drawer-nav-item"
                    onClick={() => setMobileView("products")}
                  >
                    <MdList size={20} color="#bb3d4b" />
                    <span>Productos</span>
                    <MdChevronRight
                      size={18}
                      color="#ccc"
                      className="ml-auto"
                    />
                  </button>

                  <button
                    className="drawer-nav-item"
                    onClick={() => {
                      onRouterLink("/favorites");
                      closeMobileMenu();
                    }}
                  >
                    <MdFavorite size={20} color="#bb3d4b" />
                    <span>Favoritos</span>
                    <span className="drawer-badge">{dataFavorites.length}</span>
                    <MdChevronRight
                      size={18}
                      color="#ccc"
                      className="ml-auto"
                    />
                  </button>

                  {/* <button
                    className="drawer-nav-item"
                    onClick={() => {
                      onRouterLink("/ordenes");
                      closeMobileMenu();
                    }}
                  >
                    <MdShoppingCart size={20} color="#bb3d4b" />
                    <span>Carrito</span>
                    {totalItems > 0 && (
                      <span className="drawer-badge">{totalItems}</span>
                    )}
                    <MdChevronRight
                      size={18}
                      color="#ccc"
                      className="ml-auto"
                    />
                  </button> */}

                  <button
                    className="drawer-nav-item"
                    onClick={() =>
                      setMobileView(hasToken ? "account" : "login")
                    }
                  >
                    <MdPerson size={20} color="#bb3d4b" />
                    <span>{hasToken ? "Mi cuenta" : "Ingresar"}</span>
                    <MdChevronRight
                      size={18}
                      color="#ccc"
                      className="ml-auto"
                    />
                  </button>

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
                        closeMobileMenu();
                      }
                    }}
                  >
                    Gama de Laptops 2026 <MdLaptop size={26} />
                  </button>
                </nav>

                {!hasToken && (
                  <div className="drawer-register-cta">
                    <p>¿Eres nuevo?</p>
                    <button
                      onClick={() => {
                        onRouterLink("/register");
                        closeMobileMenu();
                      }}
                      className="drawer-register-btn"
                    >
                      Registrate aquí
                    </button>
                  </div>
                )}

                {hasToken && (
                  <button
                    className="drawer-logout-btn"
                    onClick={() => {
                      Logout();
                      closeMobileMenu();
                    }}
                  >
                    Salir de la cuenta
                  </button>
                )}
              </div>
            )}

            {/* ---- PRODUCTS VIEW ---- */}
            {mobileView === "products" && (
              <div className="drawer-content">
                <button
                  className="drawer-back-btn"
                  onClick={() => setMobileView("main")}
                >
                  ← Atrás
                </button>
                <h3 className="drawer-section-title">Productos</h3>
                <SubMenuProductos
                  forceVisible={true}
                  styles={{
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "none",
                    width: "100%",
                  }}
                />
              </div>
            )}

            {/* ---- LOGIN VIEW ---- */}
            {mobileView === "login" && (
              <div className="drawer-content">
                <button
                  className="drawer-back-btn"
                  onClick={() => setMobileView("main")}
                >
                  ← Atrás
                </button>
                <h3 className="drawer-section-title">Iniciar Sesión</h3>
                <form
                  className="drawer-login-form"
                  onSubmit={(e) => {
                    onSubmit(e);
                  }}
                >
                  <div className="drawer-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      className="drawer-input"
                      value={formData.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="drawer-form-group">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="drawer-input"
                      value={formData.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {showAlert && (
                    <Alert
                      color="error"
                      icon
                      className="mb-2"
                      action={
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            closeAlert();
                          }}
                        >
                          <MdClose />
                        </button>
                      }
                    >
                      <span>{messageError}</span>
                    </Alert>
                  )}

                  <a href="/forgotpassword" className="drawer-forgot-link">
                    Olvidé mi contraseña
                  </a>

                  <button
                    type="submit"
                    className="drawer-submit-btn"
                    disabled={loadingLogin}
                  >
                    {loadingLogin ? (
                      <MdAutorenew size={20} className="the-spinner" />
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </button>

                  <div className="drawer-divider">
                    <span>o</span>
                  </div>

                  <button
                    type="button"
                    className="drawer-google-btn"
                    onClick={() => {
                      onLoginGoogle();
                    }}
                  >
                    {loadingLoginGoogle ? (
                      <MdAutorenew size={20} className="the-spinner" />
                    ) : (
                      <>
                        <FcGoogle size={22} /> Iniciar con Google
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="drawer-register-secondary"
                    onClick={() => {
                      onRouterLink("/register");
                      closeMobileMenu();
                    }}
                  >
                    Crear una cuenta nueva
                  </button>
                </form>
              </div>
            )}

            {/* ---- ACCOUNT VIEW ---- */}
            {mobileView === "account" && (
              <div className="drawer-content">
                <button
                  className="drawer-back-btn"
                  onClick={() => setMobileView("main")}
                >
                  ← Atrás
                </button>
                <h3 className="drawer-section-title">Mi Cuenta</h3>
                <nav className="drawer-nav">
                  {[
                    { path: "/perfil", name: "Mi perfil" },
                    { path: "/cambiar-contrasena", name: "Cambiar contraseña" },
                    { path: "/ordenes", name: "Carrito" },
                    { path: "/historial-de-compras", name: "Mis compras" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      className="drawer-nav-item"
                      onClick={() => {
                        onRouterLink(item.path);
                        closeMobileMenu();
                      }}
                    >
                      <span>{item.name}</span>
                      <MdChevronRight
                        size={18}
                        color="#ccc"
                        className="ml-auto"
                      />
                    </button>
                  ))}
                </nav>
                <button
                  className="drawer-logout-btn mt-4"
                  onClick={() => {
                    Logout();
                    closeMobileMenu();
                  }}
                >
                  Salir de la cuenta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarResponsive;
