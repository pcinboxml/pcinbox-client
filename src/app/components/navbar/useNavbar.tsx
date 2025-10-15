"use client";

import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useEffect, useRef, useState } from "react";

const useNavbar = () => {
  const [navRefResponsive, setNavRefResponsive] = useState(false);
  const { requestGet } = useService();
  const navRef = useRef<HTMLDivElement>(null);
  const optionProducts = useRef<HTMLDivElement>(null);
  const { hasToken, setDataCart } = useTheContext();

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
    if (optionProducts.current) {
      optionProducts.current.style.display = "block";
    }
  };

  const onMouseLeaveProducts = () => {
    if (optionProducts.current) {
      optionProducts.current.style.display = "none";
    }
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
    optionProducts,
    setNavRefResponsive,
    handleGetDataCart,
  };
};

export default useNavbar;
