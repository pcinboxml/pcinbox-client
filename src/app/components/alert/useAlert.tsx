"use client";

import { RefObject, useEffect, useRef } from "react";

interface UseAlertReturn {
  handleDismissAlert: () => void;
  handleOpenAlert: () => void;
  alertRef: RefObject<HTMLDivElement | null>;
}

const useAlert = ({ idAlert }: { idAlert: string }): UseAlertReturn => {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alertRef.current) {
      alertRef.current.style.display = "none";
    }
  }, []);

  const handleDismissAlert = () => {
    if (alertRef.current) {
      alertRef.current.style.display = "none";
    }
  };

  const handleOpenAlert = () => {
    if (alertRef.current) {
      alertRef.current.style.display = "block";
    }
  };

  return {
    alertRef,
    handleDismissAlert,
    handleOpenAlert,
  };
};

export default useAlert;
