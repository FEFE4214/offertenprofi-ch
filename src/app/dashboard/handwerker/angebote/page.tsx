import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOffersForCraftsman } from "@/lib/queries";
import { OfferStatusBadge, JobStatusBadge } from "@/components/StatusBadge";
import { withdrawOfferAction } from "@/app/actions/offers";

export const metadata: Metadata = { title: "Meine Angebote — Offertenprofi.ch" };

export default async function CraftsmanOffersPage() {
  const user = await requireUser("CRAFTSMAN");
  const offers = await getOffersForCraftsman(user.id);

  return (
    <div className="container-page py-12">
      <Link href="/dashboard/handwerker" className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-accent-600">
        <ArrowLeft size={14} /> Zurück zu den Aufträgen
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-primary-800">Meine Angebote</h1>

      {offers.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center text-sm text-primary-500">
          Sie haben noch keine Angebote abgegeben.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-xl border border-primary-100 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-primary-400">{offer.categoryName}</span>
                  <Link
                    href={`/dashboard/handwerker/auftrag/${offer.jobId}`}
                    className="mt-0.5 block font-semibold text-primary-800 hover:text-accent-600"
                  >
                    {offer.jobTitle}
                  </Link>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-primary-500">
                    <MapPin size={14} /> {offer.jobCity}, {offer.jobCanton}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-bold text-primary-800">CHF {offer.price.toLocaleString("de-CH")}</p>
                  <div className="flex gap-1.5">
                    <OfferStatusBadge status={offer.status} />
                    <JobStatusBadge status={offer.jobStatus} />
                  </div>
                </div>
              </div>
              {offer.status === "PENDING" && (
                <form action={withdrawOfferAction.bind(null, offer.id)} className="mt-4">
                  <button type="submit" className="text-sm font-medium text-red-500 hover:underline">
                    Angebot zurückziehen
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
