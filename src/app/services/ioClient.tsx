// "use client";
// import { useEffect, useRef } from "react";
// import io from "socket.io-client";
// import type { Socket } from "socket.io-client";

// const useSocket = () => {
//   const socketServer = useRef<typeof Socket | null>(null);
//   const socketPagos = useRef<typeof Socket | null>(null);

//   useEffect(() => {
//     socketServer.current = io(process.env.NEXT_PUBLIC_SOCKET_PROVEEDOR || "");
//     socketPagos.current = io(process.env.NEXT_PUBLIC_SOCKET_PAGOS || "");

//     if (localStorage.getItem("idUser")) {
//       socketPagos.current?.emit("idUser", localStorage.getItem("idUser"));
//     }

//     return () => {
//       socketServer.current?.disconnect();
//       socketPagos.current?.disconnect();
//     };
//   }, []);

//   return {
//     socketServer,
//     socketPagos,
//   };
// };

// export default useSocket;
