import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = loadStripe(stripePublishableKey);

export const PLAN_PRICE_IDS: Record<string, string> = {
  standard: 'price_standard_monthly',
  premium: 'price_premium_monthly',
  enterprise: 'price_enterprise_monthly',
};

export const simulateStripePayment = async (
  planId: string,
  cardDetails: { number: string; expiry: string; cvc: string }
): Promise<{ success: boolean; transactionId: string; customerId: string }> => {
  // Simulation sandbox Stripe
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (cardDetails.number === '4000000000000002') {
    throw new Error('Votre carte a été refusée.');
  }

  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    customerId: `cus_${Math.random().toString(36).substr(2, 14)}`,
  };
};
