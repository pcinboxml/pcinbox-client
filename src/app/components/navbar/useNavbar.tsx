"use client";

import useService from "@/app/services/useService";
import { useEffect, useRef, useState } from "react";

const useNavbar = () => {
  const [hasToken, setHasToken] = useState(false);
  const [navRefResponsive, setNavRefResponsive] = useState(false);
  const { requestGet } = useService();
  const navRef = useRef<HTMLDivElement>(null);
  const optionProducts = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    requestGet("/cookies/getCookie", false)
      .then((res) => {
        if (res && res.status == 200) {
          setHasToken(true);
        }
      })
      .catch((er) => {
        if (er.response.status == 401) {
          setHasToken(false);
        }
      });
  }, [hasToken]);

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
  };
};

export default useNavbar;
