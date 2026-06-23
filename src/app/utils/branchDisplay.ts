import ProductI from "@/app/interfaces/products/product.interface";

export const TECHSMART_PROVIDER_ID = 2;
export const DICOTECH_PROVIDER_ID = 3;

type BranchStockRow = {
  id: number;
  name: string;
  stock: number;
  rawName?: string | null;
};

export function getBranchDisplayName(sucursal: {
  branches?: { name?: string | null; providerId?: number | string | null };
  name?: string | null;
}): string {
  const providerId = Number(sucursal?.branches?.providerId);
  const name = sucursal?.branches?.name;

  if (providerId === DICOTECH_PROVIDER_ID) {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "local") {
      switch (name) {
        case "gdl":
          return "PCinBOX-GDL";
        case "leon2":
          return "PCinBOX-León";
        case "dicoags2":
          return "PCinBOX-AG2D";
        case "Arboledas":
          return "PCinBOX-AGD";
        case "CDMX":
          return "PCinBOX-CDMX";
        case "GDL":
          return "PCinBOX-GDL";
        default:
          return name ?? "";
      }
    }

    switch (name) {
      case "santafe":
        return "PCinBOX-SFD";
      case "leon2":
        return "PCinBOX-León";
      case "dicoags2":
        return "PCinBOX-AG2D";
      case "Arboledas":
        return "PCinBOX-AGD";
      case "CDMX":
        return "PCinBOX-CDMX";
      case "GDL":
        return "PCinBOX-GDL";
      default:
        return name ?? "";
    }
  }

  if (providerId === TECHSMART_PROVIDER_ID) {
    switch (name) {
      case "GDL":
        return "PCinBOX-GDL";
      case "CDMX":
        return "PCinBOX-CDMX";
      default:
        return name ?? sucursal?.name ?? "";
    }
  }

  return name ?? sucursal?.name ?? "";
}

export function shouldShowBranchStockTooltip(
  product: Pick<ProductI, "providerId" | "product_stock">,
): boolean {
  const providerId = Number(product.providerId);
  return (
    (providerId === TECHSMART_PROVIDER_ID ||
      providerId === DICOTECH_PROVIDER_ID) &&
    !!product.product_stock?.length
  );
}

export function getFilteredBranchStocks(product: ProductI): BranchStockRow[] {
  if (!product.product_stock?.length) return [];

  const branches = product.product_stock
    .filter(
      (productStock) =>
        Number(productStock.branches?.providerId) ===
        Number(product.providerId),
    )
    .map((productStock) => ({
      id: productStock.idProductStock,
      name: getBranchDisplayName(productStock),
      stock: productStock.stock,
      rawName: productStock.branches?.name,
    }));

  if (Number(product.providerId) === DICOTECH_PROVIDER_ID) {
    const allowed =
      process.env.NEXT_PUBLIC_NODE_ENV === "local"
        ? ["Arboledas", "dicoags2", "gdl"]
        : ["santafe", "leon2"];

    return branches.filter((branch) => allowed.includes(branch.rawName ?? ""));
  }

  return branches;
}
