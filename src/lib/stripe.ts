import "server-only";
import Stripe from "stripe";

/**
 * Zahlungen (Kreditkarte, TWINT, Banküberweisung via Stripe) sind nur aktiv, wenn ein
 * echter Stripe-Secret-Key hinterlegt ist. Ohne Key funktioniert die Plattform weiterhin,
 * zeigt Handwerkern aber einen Hinweis statt eines Zahlungs-Buttons.
 *
 * Welche Zahlungsmethoden (Karte, TWINT, Banküberweisung, ...) angeboten werden, wird im
 * Stripe-Dashboard unter "Payment methods" konfiguriert — der Code hier fragt Stripe per
 * `automatic_payment_methods` nach den dort aktivierten Methoden.
 */
export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function getBaseUrl(): string {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL;
  return "http://localhost:3000";
}
