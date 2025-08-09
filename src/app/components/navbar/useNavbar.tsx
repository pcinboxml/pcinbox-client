"use client";

import { useEffect, useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

const submenu: {
  id: number;
  label: string;
  html: any;
  icon: any;
}[] = [
  {
    id: 1,
    label: "test",
    html: "",

    icon: <MdArrowDropDown size={22} color="gray" />,
  },

  {
    id: 2,
    label: "Favoritos",
    html: "",
    icon: <MdArrowDropDown size={22} color="gray" />,
  },
  {
    id: 3,
    label: "Comparar",
    html: "",
    icon: <MdArrowDropDown size={22} color="gray" />,
  },
];

const useNavbar = () => {
  const [submenuActivo, setSubmenuActivo] = useState<number | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const menuCuentaRef = useRef<HTMLDivElement>(null);

  const onMouseEnterSubmenu = (id: number) => {
    setSubmenuActivo(id);
  };

  const onMouseLeaveSubMenu = () => {
    setSubmenuActivo(null);
  };

  useEffect(() => {
    setHasToken(!!localStorage.getItem("token"));
  }, []);

  const onMouseEnterMenuCuenta = () => {
    if (menuCuentaRef.current) {
      menuCuentaRef.current.style.display = "block";
    }
  };

  const onMouseLeaveMenuCuenta = () => {
    if (menuCuentaRef.current) {
      menuCuentaRef.current.style.display = "none";
    }
  };

  return {
    submenu,
    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    submenuActivo,
    hasToken,
    menuCuentaRef,
    onMouseEnterMenuCuenta,
    onMouseLeaveMenuCuenta,
  };
};

export default useNavbar;
