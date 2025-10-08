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
  idOrder: number;
  statusEnvio: any;
  createdAt: any;
  pay_method: any;
  price: number;
  paidAtOxxo: number;
  stripePaymentIntentId: string;
  products: HistoryComprasI[];
}
