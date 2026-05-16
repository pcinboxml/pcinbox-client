"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

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

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
// REGLAS para react-pdf:
// • No usar position:absolute para layout estructural — usar Flexbox puro
// • Porcentajes de ancho sólo dentro de un flex container con flexDirection:"row"
// • borderBottomWidth/borderTopWidth son seguros; evitar borders shorthand
// • No hay gap — usar marginBottom en los hijos
const styles = StyleSheet.create({
  // PAGE
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.gray900,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 48,
    backgroundColor: C.white,
  },

  // ── HEADER ──────────────────────────────────────────────────────────────
  header: {
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    value,
  );

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formatDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d} de ${m} del ${y}`;
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const CotizacionPDF = ({
  noCotizacion,
  products,
}: {
  noCotizacion: string | number;
  products: ProductI[] | ProductI | null;
}) => {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setHours(expiry.getHours() + 24);

  // Normalizar a array
  const productsArr: ProductI[] = products
    ? Array.isArray(products)
      ? products
      : [products]
    : [];

  // Total
  const total = productsArr.reduce((acc, p) => {
    const price = Number(p?.price ?? 0);
    const qty = Number(p?.quantity ?? 0);
    return isNaN(price) || isNaN(qty) ? acc : acc + price * qty;
  }, 0);

  // Renderizar una fila de producto
  const renderRow = (product: ProductI) => {
    let caracteristicas: { prop: string; value: string }[] = [];
    try {
      caracteristicas = JSON.parse(product.caracteristicas || "[]");
    } catch {
      /* noop */
    }

    const qty = Number(product.quantity ?? 1);
    const price = Number(product.price ?? 0);
    const subtotal = qty * price;

    return (
      <View key={product.idProduct} style={styles.tableRow} wrap={false}>
        {/* Cantidad */}
        <Text style={styles.tdQty}>{qty}</Text>

        {/* Descripción */}
        <View style={styles.tdDesc}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.description ? (
            <Text style={styles.productDesc}>{product.description}</Text>
          ) : null}
          {caracteristicas.slice(0, 3).map((car, i) => (
            <Text key={i} style={styles.productProp}>
              <Text style={styles.productPropBold}>{car.prop}: </Text>
              {car.value}
            </Text>
          ))}
        </View>

        {/* Precio unitario */}
        <Text style={styles.tdUnit}>{formatCurrency(price)}</Text>

        {/* Subtotal */}
        <Text style={styles.tdTotal}>{formatCurrency(subtotal)}</Text>
      </View>
    );
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <View style={styles.header} fixed>
          <View style={styles.logoWrap}>
            <Image src="/logo.png" style={styles.logo} />
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.titleLabel}>Cotización</Text>
            <Text style={styles.headerDate}>Fecha: {formatDate(now)}</Text>
          </View>
        </View>

        {/* ── META ROW ───────────────────────────────────────────────── */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Cliente</Text>
            <Text style={styles.metaValueNormal}>Venta público general</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>No. Cotización</Text>
            <Text style={styles.metaValue}>{noCotizacion}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Vigencia</Text>
            <Text style={styles.metaValueNormal}>{formatDate(expiry)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── TABLE HEADER ───────────────────────────────────────────── */}
        <View style={styles.tableHeader}>
          <Text style={styles.thQty}>Cant.</Text>
          <Text style={styles.thDesc}>Descripción</Text>
          <Text style={styles.thUnit}>P. Unitario</Text>
          <Text style={styles.thTotal}>Subtotal</Text>
        </View>

        {/* ── ROWS ───────────────────────────────────────────────────── */}
        {productsArr.map(renderRow)}

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <View style={styles.bottomFooter} fixed>
          {/* TOTALS */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>

              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>

            <Text style={styles.ivaNote}>Precios incluyen I.V.A.</Text>
          </View>

          {/* NOTAS */}
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Recomendación:{" "}
              </Text>
              Para el uso correcto y garantía de su equipo se recomienda
              ampliamente contar con regulador y supresor de picos integrado.
            </Text>
          </View>

          <View style={styles.validityBox}>
            <Text style={styles.validityText}>
              ⚠ Cotización vigente hasta el {formatDate(expiry)} o hasta agotar
              existencias.
            </Text>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              {/* Empresa */}
              <View style={styles.footerCol}>
                <Text style={styles.companyName}>pcinbox</Text>

                <Text style={styles.footerValue}>
                  Blvd. Juan Alonso de Torres Pte. 1917-Local 01{"\n"}
                  Unión Comunitaria de León, 37239 León, Gto.
                </Text>
              </View>

              {/* Contacto */}
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>CONTACTO</Text>

                <Text style={styles.footerEmail}>admon@pcinbox.com.mx</Text>

                <Text style={styles.footerValue}>
                  Tel. Oficina: 477 330 04 37{"\n"}
                  Móvil: 477 533 41 27
                </Text>
              </View>

              {/* Condiciones */}
              <View style={styles.footerColLast}>
                <Text style={styles.footerLabel}>CONDICIONES DE PAGO</Text>

                <Text style={styles.footerValue}>
                  Pago anticipado requerido
                </Text>

                <Text style={[styles.footerValue, { marginTop: 4 }]}>
                  Garantía por defecto de fábrica
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CotizacionPDF;
