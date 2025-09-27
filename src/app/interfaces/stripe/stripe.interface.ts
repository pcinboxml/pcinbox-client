export interface OrderI {
  idOrder: any;
  number: string;
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip: any;
  };
  amount_received: number;
  application: any;
  application_fee_amount: any;
  automatic_payment_methods: any;
  canceled_at: any;
  cancellation_reason: any;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: any;
  description: any;
  excluded_payment_method_types: any;
  last_payment_error: any;
  latest_charge: string;
  livemode: boolean;
  metadata: {
    created_from: string;
    user_id: string;
  };
  next_action: any;
  on_behalf_of: any;
  payment_method: string;
  payment_method_configuration_details: any;
  payment_method_options: {
    oxxo: {
      expires_after_days: number;
    };
  };
  payment_method_types: string[];
  processing: any;
  receipt_email: any;
  review: any;
  setup_future_usage: any;
  shipping: any;
  source: any;
  statement_descriptor: any;
  statement_descriptor_suffix: any;
  status: string;
  transfer_data: any;
  transfer_group: any;
}
