"use client";

import { useState } from "react";

const useDetailsProduct = () => {
  const [amountProduct, setAmountProduct] = useState<number>(1);

  const handleAdd = () => {
    setAmountProduct((prev) => prev + 1);
  };

  const handleSubstract = () => {
    setAmountProduct((prev) => (prev == 0 ? 0 : prev - 1));
  };

  return {
    amountProduct,
    handleAdd,
    handleSubstract,
  };
};

export default useDetailsProduct;
