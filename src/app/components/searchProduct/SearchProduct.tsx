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
import { History } from "lucide-react";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useEnterpriseSearch from "@/app/hooks/useEnterpriseSearch";
import useService from "@/app/services/useService";
import ProductI from "@/app/interfaces/products/product.interface";
import { highlightMatch } from "@/app/utils/searchHighlight";
import {
  addSearchHistory,
  clearSearchDraft,
  getSearchDraft,
  getSearchHistory,
  setSearchDraft,
} from "@/app/utils/searchStorage";
import "./searchProduct.css";

interface SearchProductProps {
  setIsFocusedSearch: (focused: boolean) => void;
}

type HistoryOption = {
  isHistory: true;
  term: string;
  id: string;
};

type SearchOption = ProductI | HistoryOption;

const SearchAutocomplete = Autocomplete as unknown as React.ComponentType<any>;

const isHistoryOption = (option: SearchOption): option is HistoryOption =>
  (option as HistoryOption).isHistory === true;

const buildResultsUrl = (params: {
  idProduct?: string | number;
  name?: string;
  categoryId?: string | number;
  search?: string;
  single?: boolean;
}) => {
  const query = new URLSearchParams();

  if (params.idProduct) query.set("idProduct", String(params.idProduct));
  if (params.name) query.set("name", params.name);
  if (params.categoryId) query.set("categoryId", String(params.categoryId));
  if (params.search) query.set("search", params.search);
  if (params.single) query.set("single", "1");

  return `/result-search-category?${query.toString()}`;
};

const SearchProduct = ({ setIsFocusedSearch }: SearchProductProps) => {
  const { onRouterLink } = useService();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<SearchOption | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  const { data: searchResultsRaw = [], isLoading } =
    useEnterpriseSearch(inputValue);

  const searchResults = useMemo(() => {
    const seen = new Set<string>();
    return searchResultsRaw
      .filter((item: ProductI) => Number(item.stock) > 0)
      .filter((item: ProductI) => {
        const id = String(item.idProduct);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
  }, [searchResultsRaw]);

  const historyOptions = useMemo((): HistoryOption[] => {
    void historyVersion;
    const term = inputValue.trim().toLowerCase();
    return getSearchHistory()
      .filter((item) => !term || item.toLowerCase().includes(term))
      .map((item) => ({
        isHistory: true,
        term: item,
        id: `history-${item}`,
      }));
  }, [inputValue, historyVersion]);

  const options: SearchOption[] =
    inputValue.length >= 3 ? searchResults : historyOptions;

  const filterOptions = createFilterOptions({
    stringify: (option: SearchOption) => {
      if (isHistoryOption(option)) return option.term;
      return `${option.name ?? ""} ${option.description ?? ""} ${option.sku ?? ""} ${option.upc ?? ""} ${(option as ProductI & { nameMarca?: string }).nameMarca ?? ""}`;
    },
  });

  useEffect(() => {
    const fromUrl =
      pathname.startsWith("/result-search-category")
        ? searchParams.get("search") || searchParams.get("name") || ""
        : "";
    const draft = fromUrl || getSearchDraft();
    if (draft) {
      setInputValue(draft);
    }
  }, [pathname, searchParams]);

  const getOptionKey = (option: SearchOption) => {
    if (isHistoryOption(option)) return option.id;
    return `product-${option.idProduct}`;
  };

  const persistSearchTerm = (term: string) => {
    const normalized = term.trim();
    if (!normalized) return;
    setSearchDraft(normalized);
    addSearchHistory(normalized);
    setHistoryVersion((prev) => prev + 1);
  };

  const navigateWithTerm = (term: string, singleProduct?: ProductI) => {
    persistSearchTerm(term);
    setInputValue(term);
    setIsFocusedSearch(false);

    if (singleProduct) {
      onRouterLink(
        buildResultsUrl({
          idProduct: singleProduct.idProduct,
          name: singleProduct.name,
          categoryId: singleProduct.categoryId,
          search: term,
          single: true,
        }),
      );
      return;
    }

    onRouterLink(
      buildResultsUrl({
        name: term,
        search: term,
      }),
    );
  };

  const handleSelect = (
    _event: SyntheticEvent<Element, Event>,
    value: SearchOption | null,
  ) => {
    if (!value) return;

    setSelectedValue(null);

    if (isHistoryOption(value)) {
      navigateWithTerm(value.term);
      return;
    }

    navigateWithTerm(value.name ?? "", value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const term = inputValue.trim();
    if (!term) return;

    const exactMatch = searchResults.find(
      (item: ProductI) =>
        item.upc?.toLowerCase() === term.toLowerCase() ||
        item.sku?.toLowerCase() === term.toLowerCase(),
    );

    if (exactMatch) {
      navigateWithTerm(term, exactMatch);
    } else {
      navigateWithTerm(term);
    }
  };

  return (
    <form
      style={{ zIndex: "21" }}
      className="flex w-full relative"
      onSubmit={handleSubmit}
    >
      <SearchAutocomplete
        disablePortal
        forcePopupIcon
        options={options}
        getOptionKey={getOptionKey}
        onOpen={() => setIsFocusedSearch(true)}
        onClose={() => setIsFocusedSearch(false)}
        getOptionLabel={(option: SearchOption) => {
          if (isHistoryOption(option)) return option.term;
          if (option.name) return option.name;
          if (option.upc) return option.upc;
          if (option.sku) return option.sku;
          return "";
        }}
        isOptionEqualToValue={(option: SearchOption, value: SearchOption) => {
          if (isHistoryOption(option) && isHistoryOption(value)) {
            return option.term === value.term;
          }
          if (!isHistoryOption(option) && !isHistoryOption(value)) {
            return String(option.idProduct) === String(value.idProduct);
          }
          return false;
        }}
        filterOptions={filterOptions}
        value={selectedValue}
        onChange={(_: SyntheticEvent, value: SearchOption | null) => {
          setSelectedValue(value);
          handleSelect(_, value);
        }}
        inputValue={inputValue}
        onInputChange={(_: SyntheticEvent, value: string, reason: string) => {
          if (reason === "input") {
            setInputValue(value);
            setSearchDraft(value);
          }
        }}
        loading={isLoading && inputValue.length >= 3}
        noOptionsText={
          inputValue.length >= 3
            ? "Sin coincidencias con stock disponible"
            : "Sin búsquedas recientes"
        }
        sx={{ width: "100%" }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: { xs: 300, sm: 400 },
              overflowY: "auto",
            },
          },
        }}
        renderOption={(
          props: React.HTMLAttributes<HTMLLIElement> & { key?: string },
          option: SearchOption,
        ) => {
          const { key: _muiKey, ...optionProps } = props;
          const optionKey = getOptionKey(option);

          if (isHistoryOption(option)) {
            return (
              <Box
                component="li"
                key={optionKey}
                {...optionProps}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: { xs: 1.5, sm: 1 },
                  px: { xs: 2, sm: 1 },
                  minWidth: 0,
                }}
              >
                <History size={18} color="#6b7280" />
                <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                  {highlightMatch(option.term, inputValue)}
                </Typography>
                <Chip
                  label="Reciente"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.65rem", flexShrink: 0 }}
                />
              </Box>
            );
          }

          return (
            <Box
              component="li"
              key={optionKey}
              {...optionProps}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: { xs: 2, sm: 1 },
                px: { xs: 2, sm: 1 },
                minWidth: 0,
              }}
            >
              <Avatar
                src={
                  (option as ProductI & { image_url?: string[] }).image_url?.[0] ??
                  option.imageUrl?.[0]
                }
                alt={option.name}
                variant="rounded"
                sx={{ width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  overflow: "hidden",
                  flex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {highlightMatch(option.name, inputValue)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {highlightMatch(option.description, inputValue)}
                </Typography>
                {(option.sku || option.upc) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {option.sku ? `SKU: ${option.sku}` : ""}
                    {option.sku && option.upc ? " · " : ""}
                    {option.upc ? `UPC: ${option.upc}` : ""}
                  </Typography>
                )}
              </Box>
              <Chip
                label={`Stock: ${option.stock}`}
                color="success"
                size="small"
                sx={{
                  ml: "auto",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  flexShrink: 0,
                }}
              />
            </Box>
          );
        }}
        renderInput={(params: any) => (
          <TextField
            {...params}
            className="bg-white border-0"
            placeholder="Buscar producto..."
            variant="outlined"
            size="small"
            onFocus={() => setIsFocusedSearch(true)}
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
                          clearSearchDraft();
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
        style={{ marginLeft: "2px" }}
        className="ml-1 px-2 py-1 bg-[#BB3D4B] text-white rounded transition-colors"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchProduct;
