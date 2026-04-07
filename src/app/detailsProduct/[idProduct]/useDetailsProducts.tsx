"use client";

import { ChangeEvent, useEffect, useState } from "react";
import ProductI from "../../interfaces/products/product.interface";
import useService from "../../services/useService";
import { useTheContext } from "../../services/globalContext";
import useProveedores from "@/app/services/proveedores/useProveedores";

const useDetailsProduct = () => {
  const [quantity, setQuantity] = useState<number | string>(1);
  const { requestPost } = useService();
  const { requestGetProveedor } = useProveedores();
  const { setDataCart, setDataModal, setDataNotification } = useTheContext();
  const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [changeImg, setChangeImg] = useState<string>("");
  const { onRouterLink } = useService();

  // const [dataProduct, setProduct] = useState<ProductI>({
  //   categoryId: "",
  //   createdAt: "",
  //   description: "",
  //   idProduct: "",
  //   imageUrl: [],
  //   name: "",
  //   price: "",
  //   providerId: "",
  //   quantity: 0,
  //   stock: 0,
  //   reviews: [],
  //   rating: 0,
  //   sku: "",
  //   caracteristicas: [],
  // });

  const handleAdd = (stockProp: number) => {
    const newQuantity = Number(quantity) + 1;

    if (newQuantity > stockProp) {
      return;
    }
    setQuantity(newQuantity);

    updateLocalStorageQuantity(newQuantity);
  };

  const handleSubstract = () => {
    const newQuantity = Number(quantity) > 1 ? Number(quantity) - 1 : 1;
    setQuantity(newQuantity);
    updateLocalStorageQuantity(newQuantity);
  };
  const updateLocalStorageQuantity = (newQuantity: number) => {
    const productStorage = localStorage.getItem("product");
    if (productStorage) {
      const parsed = JSON.parse(productStorage);
      const updatedProduct = { ...parsed, quantity: newQuantity };
      localStorage.setItem("product", JSON.stringify(updatedProduct));
    }
  };

  const handleAddProductCart = async (
    dataProduct: ProductI,
    quantityProp: number,
  ) => {
    try {
      const stored = localStorage.getItem("dataCartStorage");
      const products: (typeof dataProduct)[] = stored ? JSON.parse(stored) : [];

      const existingProductIndex = products.findIndex(
        (p: any) =>
          Number(p.idProduct) === Number(dataProduct.idProduct) &&
          Number(p.storeId) === Number(dataProduct.storeId),
      );

      const stock = Number(dataProduct?.stock);

      if (existingProductIndex !== -1) {
        const currentQuantity = products[existingProductIndex].quantity;

        // Validar límite de stock
        if (currentQuantity >= stock) {
          return;
        }

        products[existingProductIndex].quantity += 1;
      } else {
        // Si el stock es 0 tampoco agregar
        if (stock <= 0) return;

        products.push({
          ...dataProduct,
          quantity: 1,
        });
      }

      localStorage.setItem("dataCartStorage", JSON.stringify(products));
      setLoadingAddProduct(true);

      const resp = await requestPost(
        {
          idProduct: Number(dataProduct?.idProduct),
          quantity: quantityProp,
          price: dataProduct.price,
          isDetails: true,
        },
        "/cart/addProduct",
      );

      setLoadingAddProduct(false);

      if (resp && resp.status == 200) {
        // setDataNotification({
        //   open: true,
        //   handleClose: () =>
        //     setDataNotification((prevNoti) => ({
        //       ...prevNoti,
        //       open: false,
        //     })),
        //   message: "Producto agregado al carrito correctamente",
        //   type: "success",
        // });

        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(dataProduct.idProduct),
          );
          if (existingProduct) {
            return prev.map((item) =>
              Number(item.idProduct) == Number(existingProduct.idProduct)
                ? {
                    ...item,
                    quantity: quantityProp
                      ? quantityProp + Number(item.quantity)
                      : 1,
                  }
                : item,
            );
          } else {
            return [
              ...prev,
              {
                categoryId: dataProduct.categoryId,
                createdAt: dataProduct.createdAt,
                description: dataProduct.description,
                idProduct: dataProduct.idProduct,
                imageUrl: dataProduct.imageUrl,
                name: dataProduct.name,
                price: dataProduct.price,
                providerId: dataProduct.providerId,
                stock: dataProduct.stock,
                rating: dataProduct.rating,
                reviews: dataProduct.reviews,
                quantity: quantityProp ? quantityProp : 1,
                sku: dataProduct.sku,
                isPC: dataProduct?.isPC,
                isPc: dataProduct?.isPc,
                caracteristicas: dataProduct?.caracteristicas,
                height: dataProduct?.height,
                idProductExt: dataProduct?.idProductExt,
                largo: dataProduct?.largo,
                storeId: dataProduct?.storeId,
                upc: dataProduct?.upc,
                width: dataProduct?.width,
                product_stock: dataProduct?.product_stock,
              },
            ];
          }
        });
      }
    } catch (error: any) {
      setLoadingAddProduct(false);

      setDataModal({
        isOpen: true,
        title: "Error",
        type: "error",
        message: error.response.message || error.message,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value == "") {
      setQuantity("");
    } else {
      setQuantity(Number(value));
    }
  };

  const handleKeyBoard = (
    event: React.KeyboardEvent<HTMLInputElement>,
    dataProduct: ProductI,
  ) => {
    if (quantity != "" && quantity != 0 && event.key == "Enter") {
      handleAddProductCart(dataProduct, Number(quantity));
    }
  };

  // const handleGetDataProduct = async (idProduct: any) => {
  //   try {
  //     const resp = await requestGetProveedor(`/getProduct/${idProduct}`);
  //     if (resp.status == 200) {
  //       const data = resp.data;
  //       setProduct(data.data.data);
  //     }
  //   } catch (error) {}
  // };

  return {
    quantity,
    loadingAddProduct,
    openModal,
    changeImg,
    // dataProduct,
    setOpenModal,
    setChangeImg,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
    handleOnChange,
    handleKeyBoard,
    // handleGetDataProduct,
  };
};

export default useDetailsProduct;
