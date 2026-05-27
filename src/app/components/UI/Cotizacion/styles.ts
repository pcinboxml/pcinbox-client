import { StyleSheet } from "@react-pdf/renderer";
// ─── PALETA & TOKENS ────────────────────────────────────────────────────────
const C = {
  black: "#0d0d0d",
  gray900: "#1a1a1a",
  gray700: "#444444",
  gray500: "#777777",
  gray200: "#e4e4e4",
  gray100: "#f4f4f4",
  accent: "#0047cc",
  danger: "#c0392b",
  white: "#ffffff",
};

export const styles = StyleSheet.create({
  // PAGE
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.gray900,
    paddingTop: 110, // ✅ CAMBIO 1: Aumentado para dar espacio al header fijo
    paddingBottom: 150, // ✅ CAMBIO 2: Aumentado para dar espacio al footer fijo
    paddingHorizontal: 48,
    backgroundColor: C.white,
  },

  // ── HEADER ──────────────────────────────────────────────────────────────
  header: {
    position: "absolute", // ✅ CAMBIO 3: Agregado para que flote y se repita
    top: 36, // ✅ CAMBIO 3
    left: 48, // ✅ CAMBIO 3
    right: 48, // ✅ CAMBIO 3
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.gray200,
    marginBottom: 24,
  },
  logoWrap: {
    width: 120,
  },
  logo: {
    width: 120,
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  titleLabel: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: C.black,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerDate: {
    fontSize: 9,
    color: C.gray500,
    marginTop: 4,
  },

  // ── META ROW ────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaBlock: {
    flexDirection: "column",
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: C.gray900,
    fontFamily: "Helvetica-Bold",
  },
  metaValueNormal: {
    fontSize: 10,
    color: C.gray700,
  },

  // ── DIVIDER ─────────────────────────────────────────────────────────────
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.gray200,
    marginBottom: 16,
  },

  // ── TABLE HEADER ────────────────────────────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.gray100,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 2,
  },
  thQty: {
    width: "8%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
  },
  thDesc: {
    width: "56%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
  },
  thUnit: {
    width: "18%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
    textAlign: "right",
  },
  thTotal: {
    width: "18%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
    textAlign: "right",
  },

  // ── TABLE ROW ───────────────────────────────────────────────────────────
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.gray100,
  },
  tdQty: { width: "8%", fontSize: 10, color: C.gray700 },
  tdDesc: { width: "56%", paddingRight: 10 },
  tdUnit: { width: "18%", fontSize: 10, color: C.gray700, textAlign: "right" },
  tdTotal: {
    width: "18%",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.black,
    textAlign: "right",
  },
  productName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.black,
    marginBottom: 2,
  },
  productDesc: {
    fontSize: 8,
    color: C.gray500,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  productProp: {
    fontSize: 8,
    color: C.gray500,
  },
  productPropBold: {
    fontFamily: "Helvetica-Bold",
    color: C.gray700,
  },

  // ── TOTALS ──────────────────────────────────────────────────────────────
  totalsSection: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: C.black,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.black,
    marginRight: 20,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: C.black,
  },
  ivaNote: {
    fontSize: 8,
    color: C.gray500,
    marginTop: 4,
  },

  // ── CALLOUT BOXES ───────────────────────────────────────────────────────
  noteBox: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#eef3ff",
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    padding: 10,
    borderRadius: 2,
  },
  noteText: {
    fontSize: 8,
    color: C.gray700,
    lineHeight: 1.6,
    flex: 1,
  },
  validityBox: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "#fff5f5",
    borderLeftWidth: 3,
    borderLeftColor: C.danger,
    padding: 10,
    borderRadius: 2,
  },
  validityText: {
    fontSize: 8,
    color: C.danger,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.6,
    flex: 1,
  },

  // ── FOOTER ──────────────────────────────────────────────────────────────
  footer: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.gray200,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerCol: {
    flexDirection: "column",
    flex: 1,
    paddingRight: 16,
  },
  footerColLast: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  footerValue: {
    fontSize: 9,
    color: C.gray700,
    lineHeight: 1.5,
  },
  footerEmail: {
    fontSize: 9,
    color: C.accent,
    textDecoration: "underline",
  },
  companyName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: C.black,
    marginBottom: 4,
  },
  paymentNote: {
    marginTop: 6,
    fontSize: 8,
    color: C.gray700,
    lineHeight: 1.5,
  },
  bottomFooter: {
    position: "absolute",
    bottom: 48,
    left: 48,
    right: 48,
    backgroundColor: C.white,
  },
});
