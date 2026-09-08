import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Coins, CheckCircle2 } from "lucide-react";
import { requireUser, getCurrentCraftsmanProfile } from "@/lib/session";
import { CREDIT_PACKAGES } from "@/lib/leadPricing";
import { stripeEnabled } from "@/lib/stripe";
import { confirmStripeSessionIfPaid, buyCreditsAction } from "@/app/actions/payments";

export const metadata: Metadata = { title: "Guthaben — Offertenprofi.ch" };

type Props = { searchParams: Promise<{ purchase_session_id?: string }> };

export default async function CreditsPage({ searchParams }: Props) {
  await requireUser("CRAFTSMAN");
  const { purchase_session_id } = await searchParams;

  if (purchase_session_id) {
    await confirmStripeSessionIfPaid(purchase_session_id);
  }

  const profile = await getCurrentCraftsmanProfile();

  return (
    <div className="container-page py-12">
      <Link
        href="/dashboard/handwerker"
        className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-accent-600"
      >
        <ArrowLeft size={14} /> Zurück zu den Aufträgen
      </Link>

      <div className="mx-auto mt-4 max-w-3xl">
        <h1 className="text-2xl font-bold text-primary-800">Guthaben</h1>
        <p className="mt-1 text-sm text-primary-500">
          Mit Guthaben schaltest du Kontaktdaten von Aufträgen frei, ohne bei jeder einzelnen
          Anfrage zu bezahlen — günstiger als der Einzelkauf.
        </p>

        {purchase_session_id && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-success-200 bg-success-100 p-4 text-sm text-success-700">
            <CheckCircle2 size={18} /> Zahlung erhalten — dein Guthaben wurde aufgeladen.
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary-100 bg-white p-6">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <Coins size={22} />
          </span>
          <div>
            <p className="text-sm text-primary-500">Aktuelles Guthaben</p>
            <p className="text-2xl font-bold text-primary-800">
              {profile?.creditBalance ?? 0} Freischaltung{profile?.creditBalance === 1 ? "" : "en"}
            </p>
          </div>
        </div>

        {!stripeEnabled && (
          <div className="mt-6 rounded-xl border border-accent-100 bg-accent-50 p-4 text-sm text-accent-700">
            Zahlungen sind aktuell noch nicht eingerichtet. Der Betreiber muss zuerst ein
            Stripe-Konto verbinden, danach kannst du hier Guthaben-Pakete kaufen.
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between rounded-2xl border border-primary-100 bg-white p-6"
            >
              <div>
                <p className="text-lg font-bold text-primary-800">{pkg.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-primary-700">
                  CHF {pkg.amountChf}
                </p>
                <p className="mt-1 text-xs text-primary-400">
                  ≈ CHF {(pkg.amountChf / pkg.credits).toFixed(0)} pro Freischaltung
                </p>
              </div>
              <form action={buyCreditsAction.bind(null, pkg.id)} className="mt-5">
                <button
                  type="submit"
                  disabled={!stripeEnabled}
                  className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Kaufen
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
