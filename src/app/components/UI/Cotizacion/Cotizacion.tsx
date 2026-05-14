"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Estilos convertidos de CSS a React-PDF (escalados de px a pt para que quepan en la hoja)
const styles = StyleSheet.create({
  page: {
    width: "100%",
    minHeight: "100%",
    padding: "40 55",
    boxSizing: "border-box",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#000",
    position: "relative",
  },

  // HEADER
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 165, // Equivalente visual a 220px
    objectFit: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 24, // Equivalente visual a 48px
    fontWeight: 400,
    margin: 0,
  },
  date: {
    fontSize: 12, // Equivalente visual a 24px
    marginTop: 5,
  },

  // CLIENT
  clientSection: {
    marginTop: 30, // Equivalente visual a 55px
  },
  clientTitle: {
    fontSize: 17, // Equivalente visual a 34px
    marginBottom: 5,
  },
  client: {
    fontSize: 10, // Equivalente visual a 20px
  },

  // CONTENT
  content: {
    marginTop: 25,
    position: "relative",
  },
  leftSide: {
    width: "85%", // Dejamos espacio a la derecha para la línea divisora absoluta
    paddingRight: 20,
  },
  divider: {
    position: "absolute",
    top: 0,
    right: 45, // Equivalente visual a 60px desde el borde de la página
    width: 1.5,
    height: 580, // Equivalente visual a 760px, ajustado para no salir de la hoja
    backgroundColor: "#444",
  },
  quoteInfo: {
    textAlign: "right",
    marginBottom: 25,
    fontSize: 9, // Equivalente visual a 18px
  },
  items: {
    textAlign: "center",
  },
  item: {
    marginBottom: 15, // Equivalente visual a 38px
  },
  itemText: {
    margin: 0,
    fontSize: 9, // Equivalente visual a 18px
    lineHeight: 1.35,
  },
  totalRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    fontSize: 12, // Equivalente visual a 24px
  },
  totalSpacer: {
    width: 35, // Equivalente al gap: 45px
  },
  totalValue: {
    fontSize: 14, // Equivalente visual a 28px
    fontWeight: "bold",
  },

  // RECOMMENDATION
  recommendation: {
    marginTop: 55, // Equivalente visual a 110px
    width: "92%",
  },
  recommendationText: {
    fontSize: 8, // Equivalente visual a 16px
    fontWeight: "bold",
    lineHeight: 1.5,
  },

  // FOOTER
  footer: {
    marginTop: 70, // Equivalente visual a 140px
  },
  footerText: {
    margin: 0,
    fontSize: 9, // Equivalente visual a 18px
    lineHeight: 1.4,
  },
  red: {
    color: "#d50000",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  company: {
    marginTop: 20,
    textAlign: "center",
  },
  companyName: {
    fontSize: 11, // Equivalente visual a 22px
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    color: "#0047cc",
    textDecoration: "underline",
  },
});

const CotizacionPDF = () => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image src="/logo-pcinbox.png" style={styles.logo} />
          <Text style={styles.title}>Cotización</Text>
          <Text style={styles.date}>Fecha: 28/Abril/2026</Text>
        </View>

        {/* CLIENT */}
        <View style={styles.clientSection}>
          <Text style={styles.clientTitle}>PC Workstation</Text>
          <Text style={styles.client}>
            <Text style={{ fontWeight: "bold" }}>A quien corresponda:</Text>{" "}
            Venta público gral.
          </Text>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <View style={styles.leftSide}>
            <View style={styles.quoteInfo}>
              <Text>Cotización no. 868</Text>
              <Text>Descripción:</Text>
            </View>

            <View style={styles.items}>
              <View style={styles.item}>
                <Text style={styles.itemText}>TARJETA DE VIDEO</Text>
                <Text style={styles.itemText}>
                  NVIDIA RTX A1000ATX,8GB,GDDR6,4*MDP,72TC,2304 CC
                </Text>
                <Text style={styles.itemText}>
                  Ancho de banda de memoria: 192 GB/s
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>
                  PROCESADOR INTEL (BX8071512900K) CORE I9-12900K S-1700
                </Text>
                <Text style={styles.itemText}>
                  16CORES 5.2GHZ 125W GRAFICOS UHD770
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>DISIPADOR DUAL FAN 120 MM</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>
                  Placa Madre B760 Wifi/Bluetooth
                </Text>
                <Text style={styles.itemText}>
                  SOCKET 1700 13A,4*DDR4,2*HDMI,DP,PCIE-4.0,MATX
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>
                  ALMACENAMIENTO SSD M.2 1 TB ULTRA RAPIDO
                </Text>
                <Text style={styles.itemText}>
                  Lectura 5000 mbxs x 4500 mbxs Escritura
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>
                  32 gb ram ddr4 a 3200 MT/S (2pzas x 16 gb)
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>
                  GABINETE TIPO SERVIDOR WORKSTATION
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>
                  FUENTE DE PODER DE 850w 80 PLUS GOLD
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemText}>Windows 11 pro</Text>
              </View>
            </View>

            <View style={styles.totalRow}>
              <Text>TOTAL</Text>
              <View style={styles.totalSpacer} />
              <Text style={styles.totalValue}>$30,403.34</Text>
            </View>

            <View style={styles.recommendation}>
              <Text style={styles.recommendationText}>
                Para el uso correcto y garantía de su equipo se recomienda
                ampliamente contar con regulador y supresor de picos integrado.
              </Text>
            </View>
          </View>

          {/* Línea divisora absoluta */}
          <View style={styles.divider} />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Se requiere el pago anticipado para surtir pedido autorizado.
          </Text>
          <Text style={[styles.footerText, styles.red]}>
            Cotización Vigente hasta el 29 de Abril del 2026 o hasta agotar
            existencias.
          </Text>
          <Text style={styles.footerText}>
            Todos nuestros equipos cuentan con garantía por defecto de fábrica.
          </Text>
          <Text style={[styles.footerText, styles.bold]}>
            PRECIOS INCLUYEN I.V.A.
          </Text>

          <View style={styles.company}>
            <Text style={styles.companyName}>pcinbox</Text>
            <Text style={styles.footerText}>
              Blvd. Juan Alonso de Torres Pte. 1917-Local 01, Unión Comunitaria
              de León, 37239 León, Gto.
            </Text>
            <Text style={styles.footerText}>
              Contacto email:{" "}
              <Text style={styles.email}>admon@pcinbox.com.mx</Text>, Tel.
              Oficina 477 330 04 37 - móvil 477 533 41 27
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CotizacionPDF;
