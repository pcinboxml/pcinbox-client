"use client";

import {
  Autocomplete,
  createFilterOptions,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  InputAdornment,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import useEnterpriseSearch from "@/app/hooks/useEnterpriseSearch";
import useService from "@/app/services/useService";
import ProductI from "@/app/interfaces/products/product.interface";
import "./searchProduct.css";

interface SearchProductProps {
  setIsFocusedSearch: (focused: boolean) => void;
}

const SearchProduct = ({ setIsFocusedSearch }: SearchProductProps) => {
  const { onRouterLink } = useService();
  const [inputValue, setInputValue] = useState<string>("");

  // Hook para buscar productos con debounce
  const { data: searchResults = [], isLoading } =
    useEnterpriseSearch(inputValue);

  // Filtro personalizado (para que Autocomplete busque en nombre + descripción)
  const filterOptions = createFilterOptions({
    stringify: (option: ProductI) =>
      `${option.name ?? ""} ${option.description ?? ""} ${option.sku ?? ""} ${option.upc ?? ""}`,
  });

  const handleSelect = (
    event: SyntheticEvent<Element, Event>,
    value: ProductI | null,
  ) => {
    if (!value) return;
    setInputValue("");
    setIsFocusedSearch(false);
    onRouterLink(
      `/result-search-category?idProduct=${value.idProduct}&name=${value.name}`,
    );
  };

  useEffect(() => {
    setIsFocusedSearch(inputValue.length >= 3);
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
            `/result-search-category?idProduct=${null}&name=${inputValue}`,
          );
        }
      }}
    >
      <Autocomplete
        disablePortal
        forcePopupIcon
        isOptionEqualToValue={(option: any, value: any) =>
          option.idProduct === value.idProduct
        }
        options={inputValue.length >= 3 ? searchResults : []}
        getOptionLabel={(option: ProductI) => option.name ?? option.upc ?? ""}
        filterOptions={filterOptions}
        onChange={(_, value) => handleSelect(_, value)}
        inputValue={inputValue}
        onInputChange={(_, value, reason) => {
          if (reason === "input") setInputValue(value);
        }}
        loading={isLoading}
        noOptionsText="Sin resultados disponibles"
        sx={{ width: "100%" }}
        renderOption={(props, option: any) => (
          <Box
            component="li" // 🔹 indica que Box será un <li>
            {...props}
            key={option.idProduct}
            sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}
          >
            <Avatar
              src={option.image_url?.[0]}
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
        )}
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
                        style={{
                          fontSize: "18px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                        onClick={() => {
                          setInputValue("");
                          setIsFocusedSearch(false);
                        }}
                      >
                        X
                      </span>
                    </InputAdornment>
                  )}
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
