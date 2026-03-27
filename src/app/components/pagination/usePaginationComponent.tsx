"use client";

import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 4;

const usePaginationComponent = () => {
  const [page, setPage] = useState<number>(1);

  // useEffect(() => {
  //   const scrollContainer = document.getElementById("scroll-container");
  //   console.log(scrollContainer);
  //   if (scrollContainer) {
  //     scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  //   } else {
  //     window?.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // }, [page]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
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
