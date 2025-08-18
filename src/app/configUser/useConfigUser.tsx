"use client";

import { useTheContext } from "../services/globalContext";

const useConfigUser = () => {
  const { setDataModal } = useTheContext();

  const handleChangePassword = () => {
    // setDataModal({
    //     isOpen: true,
    //     message: "dadsa",
    //     title: "dsada",
    //     type: "info",
    //     children: "spy children",
    //     onClose: () => setDataModal(prev => ({...prev, isOpen: false})),
    //     onConfirm:
    // })
  };

  return {
    handleChangePassword,
  };
};

export default useConfigUser;
