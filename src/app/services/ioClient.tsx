"use client";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const useSocket = () => {
  const socket = useRef<typeof Socket | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET || "");

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
