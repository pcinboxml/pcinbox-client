"use client";

import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import Login from "../login/Login";

const submenu: {
  id: number;
  label: string;
  html: any;
  icon: any;
}[] = [
  {
    id: 1,
    label: "Ingresar",
    html: <Login />,

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

  const onMouseEnterSubmenu = (id: number) => {
    setSubmenuActivo(id);
  };

  const onMouseLeaveSubMenu = () => {
    setSubmenuActivo(null);
  };

  return {
    submenu,
    onMouseEnterSubmenu,
    onMouseLeaveSubMenu,
    submenuActivo,
  };
};

export default useNavbar;
