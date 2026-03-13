"use client";
import { useTheContext } from "@/app/services/globalContext";
import { usePathname } from "next/navigation";
import style from "./submenuproducts.module.css";

const SubMenuProductos = ({
  forceVisible,
  styles,
}: {
  styles?: any;
  forceVisible: boolean;
}) => {
  const { showProductsMenu, dataCategories } = useTheContext();
  const pathname = usePathname();

  // const [subMenus, setSubMenus] = useState<{ content: any }[]>([]);

  const isVisible =
    forceVisible || pathname === "/principal" || showProductsMenu;

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
        <div
          className={`${style.menu1} h-[100%] max-h-[550px] ${forceVisible ? "w-full" : "w-[150px]"}  overflow-y-auto overflow-x-hidden`}
          style={{
            padding: forceVisible ? "10px" : "2px",
          }}
        >
          <ul>
            {dataCategories && dataCategories.length > 0
              ? dataCategories.map((categoria) => {
                  if (
                    categoria.name != "" &&
                    categoria.name != null &&
                    categoria.name != "MOTHERBOARDS" &&
                    categoria.name != "MINI PCS Y PORTATILES"
                  ) {
                    return (
                      <li key={categoria.idCategorie}>
                        <a
                          href={`/result-search-category?categoryId=${categoria.idCategorie}`}
                          style={{
                            wordBreak: "break-word", // corta palabras largas si no caben
                            overflowWrap: "break-word", // compatibilidad extra
                            whiteSpace: "normal", // permite que las frases se rompan en espacios
                            display: "inline-block",
                            maxWidth: "150px",
                            fontSize: "13px",
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
