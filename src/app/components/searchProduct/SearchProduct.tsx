"use client";

import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import "./searchProduct.css";
import { useTheContext } from "@/app/services/globalContext";
import ProductI from "@/app/interfaces/products/product.interface";
import { useEffect, useState } from "react";

const SearchProduct = ({ setIsFocusedSearch }: { setIsFocusedSearch: any }) => {
  const { dataProducts, setDataProducts } = useTheContext();
  const [hasFetchedProducts, setHasFetchedProducts] = useState<boolean>(false);

  const filterOptions = createFilterOptions({
    stringify: (option: ProductI) => `${option.name} ${option.description}`,
  });

  const handleSelect = (
    event: React.SyntheticEvent,
    value: ProductI | null
  ) => {
    console.log("Producto seleccionado:", value);
    if (value) {
    }
  };

  useEffect(() => {
    if (!hasFetchedProducts && dataProducts.length === 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL_PROVEEDOR}/getAllProduct`).then(
        async (res) => {
          const data = await res.json();
          setDataProducts(data.data);
          setHasFetchedProducts(true);
        }
      );
    }
  }, [hasFetchedProducts]);
  return (
    <form className="flex">
      <Autocomplete
        disablePortal
        options={dataProducts.length > 0 ? dataProducts : []}
        noOptionsText="Sin resultados disponibles"
        className="z-20 relative focus:outline-none bg-white border-0"
        onFocus={() => setIsFocusedSearch(true)}
        onBlur={() => setIsFocusedSearch(false)}
        sx={{ width: "100%", border: "none" }}
        renderInput={(params) => <TextField {...params} label="" />}
        getOptionLabel={(option: ProductI) => option.name}
        filterOptions={filterOptions}
        onChange={handleSelect}
        getOptionKey={(option: ProductI) => option.idProduct}
      />
      <button className="z-20 relative will-change-contents">
        <span className="px-2">Buscar</span>
      </button>
    </form>
  );
};

export default SearchProduct;
