"use client";

import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useRef, useState } from "react";

const useNavbar = () => {
  const [navRefResponsive, setNavRefResponsive] = useState(false);
  const { requestGet } = useService();
  const navRef = useRef<HTMLDivElement>(null);
  const { hasToken, showProductsMenu, setShowProductsMenu, setDataCart } =
    useTheContext();

  const onMouseEnterSubmenu = (idSubmenu: string) => {
    const idSub = document.getElementById(idSubmenu);

    if (idSub) {
      idSub.style.display = "block";
    }
  };

  const onMouseLeaveSubMenu = (idSubmenu: string) => {
    const idSub = document.getElementById(idSubmenu);

    if (idSub) {
      idSub.style.display = "none";
    }
  };

  const onMouseEnterProducts = () => {
    setShowProductsMenu(true);
  };

  const onMouseLeaveProducts = () => {
    setShowProductsMenu(false);
  };

  const handleToggleNav = () => {
    setNavRefResponsive(!navRefResponsive);
  };

  const handleDOM = (e: any) => {
    if (
      !e.target.closest("#btnHamburguer") &&
      !e.target.closest("#container-submenu-responsive")
    ) {
      setNavRefResponsive(false);
    }
  };

  const handleGetDataCart = async () => {
    try {
      const resp = await requestGet("/cart/getCart", true);
      if (resp && resp.status == 200) {
        const data = await resp.data;
        setDataCart(data.data);
      }
    } catch (error: any) {}
  };

  const handleDetectedScroll = () => {
    //const scrollY = window.scrollY;
    // if (scrollY > 120) {
    //   if (navRef.current) {
    //     navRef.current.style.position = "fixed";
    //     navRef.current.style.zIndex = "300";
    //   }
    // } else {
    //   if (navRef.current) {
    //     navRef.current.style.position = "relative";
    //   }
    // }
  };

  const handleClickTopScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    hasToken,
    handleToggleNav,
    handleDOM,
    navRefResponsive,
    handleDetectedScroll,
    navRef,
    onMouseEnterProducts,
    onMouseLeaveProducts,
    showProductsMenu,
    setNavRefResponsive,
    handleGetDataCart,
    handleClickTopScroll,
  };
};

export default useNavbar;
