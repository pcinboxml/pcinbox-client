export interface HistoryComprasI {
  idOrder: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
  payment_method: string;
  products: {
    idShipment: number;
    description: string;
    price: string;
    idProduct: number;
    name: string;
    quantity: number;
    statusShip: string;
    shipping_method: string;
    status: string;
    image_url: string[];
    trackingNumber: any;
    shippingType: any;
    address: {
      idAddress: number;
      userId: number;
      street: string;
      noExt: any;
      noInt: any;
      cologne: any;
      city: string;
      state: string;
      country: string;
      postalCode: any;
      phone1: any;
      phone2: any;
      createdAt: any;
      updatedAt: any;
      active: number;
    } | null;
  }[];
}
