"use client";

import {
  Autocomplete,
  AutocompleteChangeReason,
  createFilterOptions,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "./searchProduct.css";
import { useTheContext } from "@/app/services/globalContext";
import ProductI from "@/app/interfaces/products/product.interface";
import { SyntheticEvent, useEffect, useState } from "react";
import useService from "@/app/services/useService";

interface SearchProductProps {
  setIsFocusedSearch: (focused: boolean) => void;
}

const SearchProduct = ({ setIsFocusedSearch }: SearchProductProps) => {
  const { dataProducts } = useTheContext();
  const { onRouterLink } = useService();

  // const [selectedProduct, setSelectedProduct] = useState<ProductI | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Filtro personalizado
  const filterOptions = createFilterOptions({
    stringify: (option: ProductI) => `${option.name} ${option.description}`,
  });

  const handleSelect = (
    event: SyntheticEvent<Element, Event>,
    value: ProductI | null,
    reason: AutocompleteChangeReason
  ) => {
    if (value) {
      // setSelectedProduct(value);
      setInputValue("");
      setIsFocusedSearch(false);
      onRouterLink(
        `/result-search-category?idProduct=${value.idProduct}&name=${value.name}`
      );
      setIsFocusedSearch(false);
    }
  };

  useEffect(() => {
    if (inputValue.length >= 3) {
      setIsFocusedSearch(true);
    } else {
      setIsFocusedSearch(false);
    }
  }, [inputValue]);

  return (
    <form
      style={{ zIndex: "21" }}
      className="flex w-full relative"
      onSubmit={(event) => {
        event.preventDefault();
        if (inputValue) {
          setIsFocusedSearch(false);
          onRouterLink(
            `/result-search-category?idProduct=${null}&name=${inputValue}`
          );
        }
      }}
    >
      <Autocomplete
        disablePortal
        forcePopupIcon={true}
        options={
          inputValue && inputValue.length >= 3
            ? dataProducts.filter((product) => {
                const search = inputValue.toLowerCase().trim();
                return (
                  product.name?.toLowerCase().includes(search) ||
                  product.description?.toLowerCase().includes(search) ||
                  product.sku?.toLowerCase().includes(search) ||
                  product.upc?.toLowerCase().includes(search)
                );
              })
            : []
        }
        getOptionLabel={(option) => option.name}
        filterOptions={filterOptions}
        onChange={(_, value) => handleSelect(_, value, "selectOption")}
        inputValue={inputValue}
        onInputChange={(_, value, reason) => {
          if (reason === "input") {
            setInputValue(value);
          }
        }}
        noOptionsText="Sin resultados disponibles"
        // onFocus={() =>{
        //     if (inputValue) {

        //     }
        //   setIsFocusedSearch(inputValue?.length >= 3 ? true : false)
        // }
        // }
        // onBlur={() => setIsFocusedSearch(false)}
        sx={{ width: "100%" }}
        renderOption={(props, option) => {
          const { key, ...rest } = props; // extraemos key
          return (
            <Box
              key={option?.idProduct} // React necesita key directamente
              component="li"
              {...rest} // resto de props
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
              }}
            >
              <Avatar
                src={option.imageUrl[0]}
                alt={option.name}
                variant="rounded"
                sx={{ width: 50, height: 50 }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" fontWeight={500}>
                  {option.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
              <Chip
                label={option.stock > 0 ? `Stock: ${option.stock}` : "Agotado"}
                color={option.stock > 0 ? "success" : "error"}
                size="small"
                sx={{ ml: "auto" }}
              />
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className="bg-white border-0"
            placeholder="Buscar producto..."
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {inputValue && (
                    <InputAdornment position="end">
                      <span
                        onClick={() => {
                          setInputValue("");
                          setIsFocusedSearch(false);
                        }}
                        style={{
                          fontSize: "18px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        X
                      </span>
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <button
        type="submit"
        className="ml-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchProduct;
