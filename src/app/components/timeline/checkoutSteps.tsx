export enum CheckoutStep {
  CONFIRMAR_PRODUCTOS = 0,
  OPCIONES_ENTREGA = 1,
  FORMA_DE_PAGO = 2,
  RESUMEN = 3,
}

export const checkoutRoutes = {
  [CheckoutStep.CONFIRMAR_PRODUCTOS]: "/confirma-productos",
  [CheckoutStep.OPCIONES_ENTREGA]: "/opciones-entrega",
  [CheckoutStep.FORMA_DE_PAGO]: "/forma-de-pago",
  [CheckoutStep.RESUMEN]: "/resumen",
};
