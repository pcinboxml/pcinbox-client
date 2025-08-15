"use client";

import { useState } from "react";

const useCard = () => {
  const [showActions, setShowActions] = useState<boolean>(false);

  const handleMouseEnter = () => setShowActions(true);
  const handleMouseLeave = () => setShowActions(false);

  return {
    handleMouseEnter,
    handleMouseLeave,
    showActions,
  };
};

export default useCard;
