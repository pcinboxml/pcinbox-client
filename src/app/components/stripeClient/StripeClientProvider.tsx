"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function StripeProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
