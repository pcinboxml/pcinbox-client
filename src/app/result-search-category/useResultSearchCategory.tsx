"use client";

import { useEffect, useState } from "react";
import useService from "../services/useService";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const ITEMS_PER_PAGE = 20;

const useResultSearchCategory = () => {
  const [loadingAddProductCar, setLoadingAddProductCar] = useState<
    Record<any, boolean>
  >({});
  const { requestPost } = useService();
  const { setDataCart, dataCart } = useTheContext();

  const [page, setPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(page);
    console.log(window);
  }, [page]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());

    //router.push(`${pathName}${params.toString()}`, { scroll: false });
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handleAddProductCart = async (productProp: ProductI) => {
    try {
      // Buscar el producto en el carrito
      const productInCart = dataCart?.find(
        (item) => Number(item.idProduct) === Number(productProp.idProduct),
      );

      if (productInCart && productInCart.quantity >= (productProp.stock || 0)) {
        return;
      }

      // Marcar producto como cargando
      setLoadingAddProductCar((prev) => ({
        ...prev,
        [productProp.idProduct]: true,
      }));

      // Llamada al backend
      const resp = await requestPost(
        {
          idProduct: Number(productProp?.idProduct),
          //  product: productProp,
          quantity: 1,
          price: productProp.price,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      // Terminar loading
      setLoadingAddProductCar((prev) => ({
        ...prev,
        [productProp.idProduct]: false,
      }));

      if (resp.status === 200) {
        setDataCart((prevCart) => {
          if (productInCart) {
            // Incrementar quantity pero sin superar el stock
            return prevCart.map((item) =>
              Number(item.idProduct) === Number(productProp.idProduct)
                ? {
                    ...item,
                    quantity: Math.min(
                      (Number(item.quantity) || 0) + 1,
                      Number(productProp.stock) || 0,
                    ),
                  }
                : item,
            );
          } else {
            // Agregar nuevo producto al carrito
            return [
              ...prevCart,
              {
                categoryId: productProp.categoryId,
                createdAt: productProp.createdAt,
                description: productProp.description,
                idProduct: productProp.idProduct,
                imageUrl:
                  productProp.imageUrl || (productProp as any).image_url,
                name: productProp.name,
                price: productProp.price,
                providerId: productProp.providerId,
                stock: productProp.stock,
                rating: productProp.rating,
                reviews: productProp.reviews,
                sku: productProp.sku,
                quantity: 1, // cantidad inicial
                isPC: productProp?.isPC,
                isPc: productProp?.isPc,
                caracteristicas: productProp?.caracteristicas,
                height: productProp?.height,
                idProductExt: productProp?.idProductExt,
                largo: productProp?.largo,
                storeId: productProp?.storeId,
                upc: productProp?.upc,
                width: productProp?.width,
                product_stock: productProp?.product_stock,
              },
            ];
          }
        });
      }
    } catch (error) {
      setLoadingAddProductCar((prev) => ({
        ...prev,
        [productProp.idProduct]: false,
      }));
      console.error("Error agregando producto al carrito:", error);
    }
  };

  return {
    handleAddProductCart,
    loadingAddProductCar,
    page,
    setPage,
    startIndex,
    endIndex,
    handleChangePage,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};

export default useResultSearchCategory;
