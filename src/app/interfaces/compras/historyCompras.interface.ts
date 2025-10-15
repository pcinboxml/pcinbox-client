export interface HistoryComprasI {
  createdAt: string;
  description: string;
  idOrder: number;
  image_url: string[];
  name: string;
  price: string;
  quantity: number;
  totalAmount: string;
  status: any;
  statusEnvio: any;
  userId: number;
  pay_method: any;
  idProduct: number;
  stripePaymentIntentId: string;
}

export interface GroupByIdI {
  idShipment: number;
  idOrder: number;
  statusEnvio: any;
  createdAt: any;
  pay_method: any;
  price: number;
  paidAtOxxo: number;
  shipping_method: any;
  stripePaymentIntentId: string;
  street: string;
  noExt: any;
  noInt: any;
  cologne: any;
  city: any;
  state: any;
  country: any;
  products: HistoryComprasI[];
}
