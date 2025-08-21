"use client";
import useService from "./useService";

const useProtectedRoutes = () => {
  const { onRouterLink, requestGet } = useService();

  const ProtectedLoginAndRegister = async () => {
    // try {
    //   const res = await requestGet("/cookies/getCookie");
    //   if (res.status == 200) {
    //     const dataRes = res.data;
    //     if (dataRes.isAuthenticated) {
    //       onRouterLink("/index");
    //       return;
    //     }
    //   }
    // } catch (error: any) {}
  };

  return {
    ProtectedLoginAndRegister,
  };
};

export default useProtectedRoutes;
