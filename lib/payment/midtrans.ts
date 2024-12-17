import { nanoid } from 'nanoid';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

interface MidtransConfig {
  clientKey: string;
  serverKey: string;
  isProduction: boolean;
}

export const midtransConfig: MidtransConfig = {
  clientKey: MIDTRANS_CLIENT_KEY!,
  serverKey: MIDTRANS_SERVER_KEY!,
  isProduction: process.env.NODE_ENV === 'production',
};

export function generateOrderId(): string {
  return `ORDER-${Date.now()}-${nanoid(6)}`;
}

export function createMidtransTransaction(params: {
  orderId: string;
  amount: number;
  customerDetails: {
    firstName: string;
    email: string;
  };
}) {
  return {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.customerDetails.firstName,
      email: params.customerDetails.email,
    },
    credit_card: {
      secure: true,
    },
  };
}