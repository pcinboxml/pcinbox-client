export function formatPaymentMethodLabel(method?: string): string {
  const labels: Record<string, string> = {
    tarjeta_de_credito: "Tarjeta de crédito",
    tarjeta_de_debito: "Tarjeta de débito",
    tarjeta_sucursal: "Tarjeta en sucursal",
    transferencia_bancaria: "Transferencia bancaria",
    mercadopago: "Mercado Pago",
    oxxo: "Efectivo en establecimiento",
    efectivo_sucursal: "Efectivo en establecimiento",
    efectivo: "Efectivo",
  };

  if (!method) return "Pago registrado";
  return labels[method] ?? method.replace(/_/g, " ");
}

export function getCancelRefundMessage(paymentMethod?: string): string {
  const method = (paymentMethod || "").toLowerCase();

  if (
    method === "tarjeta_de_credito" ||
    method === "tarjeta_de_debito" ||
    method === "tarjeta_sucursal" ||
    method === "mercadopago"
  ) {
    return "Tu reembolso se reflejará en 5 a 10 días hábiles en el mismo método de pago.";
  }

  if (method === "transferencia_bancaria") {
    return "Comunícate con la sucursal PCInbox para coordinar el reembolso por transferencia.";
  }

  if (method === "oxxo" || method === "efectivo" || method === "efectivo_sucursal") {
    return "El pago se realizó en un establecimiento afiliado (farmacia, tienda u otro). Para tu reembolso, acude a la sucursal PCInbox con tu comprobante y número de orden; te apoyaremos en efectivo o por transferencia bancaria.";
  }

  return "Recibirás instrucciones de reembolso según el método de pago utilizado.";
}

export function getCancelSuccessMessage(
  idOrder: number,
  paymentMethod?: string,
): string {
  return `Compra #${idOrder} cancelada correctamente. ${getCancelRefundMessage(paymentMethod)}`;
}
