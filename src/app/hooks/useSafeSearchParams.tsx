"use client";

import { useSearchParams } from "next/navigation";

export const useSafeSearchParams = <
  T extends Record<string, string | null>,
>() => {
  const params = useSearchParams();

  const get = (key: string) => params.get(key);

  return {
    get,
    params: Object.fromEntries(params.entries()) as T,
  };
};
