export interface ChargesOpenPay {
  id: string;
  authorization: null | any;
  card?: {
    address: any;
    allows_charges: boolean;
    allows_payouts: boolean;
    bank_code: string;
    bank_name: string;
    brand: string;
    card_business_type: any;
    card_number: string;
    dcc: any;
    expiration_month: string;
    expiration_year: string;
    holder_name: string;
    points_card: boolean;
    points_type: string;
    type: string;
  };
  payment_plan?: {
    payments: number;
    payments_type: string;
  };
  operation_type: string;
  transaction_type: string;
  status: string;
  conciliated: boolean;
  creation_date: string;
  operation_date: string;
  description: string;
  error_message: null | string;
  order_id: string;
  customer_id: string;
  payment_method: {
    type: string;
    reference?: string;
    barcode_url?: string;
    url_store?: string;
    agreement?: string;
    bank?: string;
    clabe?: string;
    name?: string;
    url_spei?: string;
  };
  amount: number;
  currency: string;
  method: string;
}
