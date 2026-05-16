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

import { styles } from "./styles";

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
// REGLAS para react-pdf:
// • No usar position:absolute para layout estructural — usar Flexbox puro
// • Porcentajes de ancho sólo dentro de un flex container con flexDirection:"row"
// • borderBottomWidth/borderTopWidth son seguros; evitar borders shorthand
// • No hay gap — usar marginBottom en los hijos

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
