"use client";

import {
  Autocomplete,
  AutocompleteChangeReason,
  createFilterOptions,
  TextField,
} from "@mui/material";
import "./searchProduct.css";
import { useTheContext } from "@/app/services/globalContext";
import ProductI from "@/app/interfaces/products/product.interface";
import { SyntheticEvent, useState } from "react";
import useService from "@/app/services/useService";

const SearchProduct = ({ setIsFocusedSearch }: { setIsFocusedSearch: any }) => {
  const { dataProducts } = useTheContext();

  const filterOptions = createFilterOptions({
    stringify: (option: ProductI) => `${option.name} ${option.description}`,
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductI | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const { onRouterLink } = useService();

  const handleSelect = (
    event: SyntheticEvent<Element, Event>,
    value: string | ProductI | null,
    reason: AutocompleteChangeReason
  ) => {
    if (value) {
      setSelectedProduct(typeof value !== "string" ? value : null);
      onRouterLink(
        `/result-search-category?idProduct=${
          typeof value != "string" ? value.idProduct : null
        }&name=${typeof value != "string" ? value.name : null}`
      );
      setIsFocusedSearch(false);
    }
  };

  return (
    <form
      className="flex"
      onSubmit={(event) => {
        event.preventDefault(); // Evita que la página se recargue
        if (inputValue) {
          onRouterLink(
            `/result-search-category?idProduct=${null}&name=${inputValue}`
          );
          setIsFocusedSearch(false);
        }
      }}
    >
      <Autocomplete
        freeSolo
        disablePortal
        options={
          inputValue.length >= 3
            ? dataProducts && dataProducts.length > 0
              ? dataProducts.filter((product) => product.categoryId == "1")
              : []
            : []
        } //Solo productos de la categoria TARJETAS DE VIDEO
        noOptionsText="Sin resultados disponibles"
        className="z-20 relative border-none focus:outline-none bg-white border-0"
        onFocus={() => setIsFocusedSearch(true)}
        onBlur={() => setIsFocusedSearch(false)}
        sx={{ width: "100%", border: "none" }}
        renderInput={(params) => <TextField {...params} label="" />}
        getOptionLabel={(option: string | ProductI) => {
          if (typeof option === "string") return option;
          return option.name;
        }}
        filterOptions={filterOptions}
        onChange={handleSelect}
        inputValue={inputValue}
        onInputChange={(event, value) => {
          setInputValue(value);
        }}
        getOptionKey={(option: string | ProductI) => {
          if (typeof option != "string") {
            return option.idProduct;
          }
          return option;
        }}
      />
      <button
        type="button"
        className="z-20 relative will-change-contents"
        onClick={(event) => {
          event.preventDefault();
          if (inputValue) {
            onRouterLink(
              `/result-search-category?idProduct=${null}&name=${inputValue}`
            );
            setIsFocusedSearch(false);
          }
        }}
      >
        <span className="px-2">Buscar</span>
      </button>
    </form>
  );
};

export default SearchProduct;
