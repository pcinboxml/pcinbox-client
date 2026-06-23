"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import {
  getFilteredBranchStocks,
  shouldShowBranchStockTooltip,
} from "@/app/utils/branchDisplay";
import { Tooltip, styled } from "@mui/material";
import { MdStore } from "react-icons/md";
import { ReactNode } from "react";

const BranchStockTooltipPopper = styled(({ className, ...props }: any) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "transparent",
    padding: 0,
    maxWidth: 300,
    boxShadow: "none",
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#1e1e2f",
  },
}));

type BranchStockTooltipProps = {
  product: ProductI;
  children: ReactNode;
  className?: string;
};

const BranchStockTooltipContent = ({
  product,
}: {
  product: ProductI;
}) => {
  const branches = getFilteredBranchStocks(product);

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #1e1e2f 0%, #2d2d44 100%)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 240,
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MdStore size={18} color="#bb3d4b" />
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.02em",
          }}
        >
          Stock por sucursal
        </p>
      </div>

      <div style={{ padding: "8px 10px 10px" }}>
        {branches.map((branch) => {
          const hasStock = branch.stock > 0;
          const isLow = branch.stock > 0 && branch.stock <= 10;

          return (
            <div
              key={branch.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 6px",
                borderRadius: 8,
                transition: "background 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.88)",
                  fontWeight: 500,
                  flex: 1,
                  lineHeight: 1.3,
                }}
              >
                {branch.name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                  background: hasStock
                    ? isLow
                      ? "rgba(251, 191, 36, 0.18)"
                      : "rgba(52, 211, 153, 0.18)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: hasStock
                    ? isLow
                      ? "#fbbf24"
                      : "#34d399"
                    : "#f87171",
                  border: `1px solid ${
                    hasStock
                      ? isLow
                        ? "rgba(251, 191, 36, 0.35)"
                        : "rgba(52, 211, 153, 0.35)"
                      : "rgba(239, 68, 68, 0.3)"
                  }`,
                }}
              >
                {hasStock ? `${branch.stock} pzas.` : "Agotado"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BranchStockTooltip = ({
  product,
  children,
  className,
}: BranchStockTooltipProps) => {
  const branches = getFilteredBranchStocks(product);
  const showTooltip =
    shouldShowBranchStockTooltip(product) && branches.length > 0;

  if (!showTooltip) {
    return <>{children}</>;
  }

  return (
    <BranchStockTooltipPopper
      title={<BranchStockTooltipContent product={product} />}
      placement="top"
      enterDelay={250}
      leaveDelay={80}
      enterNextDelay={150}
    >
      <span
        className={className}
        style={{
          cursor: "help",
          display: "inline-flex",
          alignItems: "center",
          borderBottom: "1px dashed rgba(187, 61, 75, 0.45)",
        }}
      >
        {children}
      </span>
    </BranchStockTooltipPopper>
  );
};

export default BranchStockTooltip;
