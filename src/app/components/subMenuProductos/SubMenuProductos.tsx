"use client";
import { useTheContext } from "@/app/services/globalContext";
import useProveedores from "@/app/services/proveedores/useProveedores";
import useService from "@/app/services/useService";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SubMenuProductos = ({ styles }: { styles?: any }) => {
  const { showProductsMenu, dataProducts } = useTheContext();
  const { onRouterLink } = useService();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const [dataCategories, setDataCategories] = useState<
    {
      idCategorie: number;
      name: string;
      providerId: number;
    }[]
  >([]);

  // const [subMenus, setSubMenus] = useState<{ content: any }[]>([]);

  const { requestGetProveedor } = useProveedores();

  const getDataCategories = async () => {
    try {
      const resp = await requestGetProveedor("/getAllCategoriPrincipal");
      if (resp.status == 200) {
        const data = resp.data;

        setDataCategories(data.data.data);
      }
    } catch (error) {
      setDataCategories([]);
    }
  };

  useEffect(() => {
    getDataCategories();
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const isVisible =
    pathname === "/principal" || pathname === "/" || showProductsMenu;

  return (
    <div
      className={`container-list-products absolute bg-white shadow ${
        isVisible ? "block" : "hidden"
      }`}
      style={{
        zIndex: 999, // Asegura visibilidad
        ...styles,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
        }}
      >
        <div className="menu1 h-[100%] max-h-[550px] w-[150px]  overflow-y-auto overflow-x-hidden">
          <ul>
            {dataCategories && dataCategories.length > 0
              ? dataCategories.map((categoria) => {
                  if (categoria.name != "" && categoria.name != null) {
                    return (
                      <li key={categoria.idCategorie}>
                        <a
                          href={`/result-search-category?categoryId=${categoria.idCategorie}`}
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            display: "inline-block",
                            maxWidth: "150px",
                          }}
                          // onMouseEnter={() => {
                          //   if (categoria) {
                          //     let findProductByCategori = dataProducts
                          //       .filter(
                          //         (product) =>
                          //           Number(product.categoryId) ==
                          //           Number(categoria.idCategorie)
                          //       )
                          //       .map((mProduct, indexProduct) => {
                          //         return (
                          //           <li
                          //             key={indexProduct}
                          //             className="mt-1 block"
                          //           >
                          //             <a href="#">{mProduct.name}</a>
                          //           </li>
                          //         );
                          //       });
                          //     setSubMenus((prevSubMenu) => [
                          //       {
                          //         content: (
                          //           <div
                          //             key={1}
                          //             className="h-[100%] max-h-[550px] w-[150px]  overflow-y-auto overflow-x-hidden"
                          //           >
                          //             <ul>{findProductByCategori}</ul>
                          //           </div>
                          //         ),
                          //       },
                          //     ]);
                          //   }
                          // }}
                        >
                          {categoria.name}
                        </a>
                      </li>
                    );
                  }
                })
              : null}
          </ul>
        </div>
        {/* {subMenus && subMenus.map((mSubMenu) => mSubMenu.content)} */}
      </div>
    </div>
  );
};

export default SubMenuProductos;
