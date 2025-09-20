"use client";

import { useState } from "react";

const ITEMS_PER_PAGE = 4;

const usePaginationComponent = () => {
  const [page, setPage] = useState<number>(1);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return {
    page,
    setPage,
    startIndex,
    endIndex,
    handleChangePage,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};

export default usePaginationComponent;
