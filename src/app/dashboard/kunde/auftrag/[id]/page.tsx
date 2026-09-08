import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Calendar, Wallet, ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getJobDetail } from "@/lib/queries";
import { cantonName } from "@/lib/cantons";
import { JobStatusBadge, OfferStatusBadge } from "@/components/StatusBadge";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import { acceptOfferAction } from "@/app/actions/offers";
import { markJobCompleteAction, cancelJobAction } from "@/app/actions/jobs";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = { title: "Auftragsdetail — Offertenprofi.ch" };

type Props = { params: Promise<{ id: string }> };

export default async function CustomerJobDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireUser("CUSTOMER");
  const detail = await getJobDetail(id);
  if (!detail || detail.job.customerId !== user.id) notFound();

  const { job, category, offers, review } = detail;

  return (
    <div className="container-page py-12">
      <Link href="/dashboard/kunde" className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-accent-600">
        <ArrowLeft size={14} /> Zurück zu meinen Aufträgen
      </Link>

      <div className="mt-4 rounded-2xl border border-primary-100 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-primary-400">{category?.name}</span>
            <h1 className="mt-0.5 text-2xl font-bold text-primary-800">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-primary-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {job.city}, {cantonName(job.canton)}
              </span>
              {(job.budgetMin || job.budgetMax) && (
                <span className="inline-flex items-center gap-1.5">
                  <Wallet size={14} /> CHF {job.budgetMin ?? "?"}–{job.budgetMax ?? "?"}
                </span>
              )}
              {job.desiredDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} /> Wunschtermin: {job.desiredDate}
                </span>
              )}
            </div>
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <p className="mt-5 whitespace-pre-line text-primary-700">{job.description}</p>

        {job.status === "OPEN" && (
          <form action={cancelJobAction.bind(null, job.id)} className="mt-6">
            <button type="submit" className="text-sm font-medium text-red-500 hover:underline">
              Auftrag stornieren
            </button>
          </form>
        )}

        {job.status === "IN_PROGRESS" && (
          <form action={markJobCompleteAction.bind(null, job.id)} className="mt-6">
            <button
              type="submit"
              className="rounded-lg bg-success-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Als abgeschlossen markieren
            </button>
          </form>
        )}
      </div>

      {job.status === "COMPLETED" && (
        <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-7">
          <h2 className="text-lg font-bold text-primary-800">Bewertung</h2>
          {review ? (
            <div className="mt-3">
              <StarRating rating={review.rating} showCount={false} />
              {review.comment && <p className="mt-2 text-sm text-primary-600">{review.comment}</p>}
            </div>
          ) : (
            <ReviewForm jobId={job.id} />
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-bold text-primary-800">
          Eingegangene Angebote {offers.length > 0 && `(${offers.length})`}
        </h2>

        {offers.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-primary-200 bg-white p-8 text-center text-sm text-primary-500">
            Noch keine Angebote eingegangen. Passende Handwerker werden benachrichtigt.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-xl border border-primary-100 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/handwerker/${offer.craftsmanId}`} className="font-semibold text-primary-800 hover:text-accent-600">
                        {offer.craftsmanCompany ?? offer.craftsmanName}
                      </Link>
                      {offer.craftsmanVerified && <VerifiedBadge />}
                    </div>
                    <div className="mt-1">
                      <StarRating rating={offer.craftsmanRating.avg} count={offer.craftsmanRating.count} size={14} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-800">CHF {offer.price.toLocaleString("de-CH")}</p>
                    <OfferStatusBadge status={offer.status} />
                  </div>
                </div>
                <p className="mt-3 text-sm text-primary-600">{offer.message}</p>
                {offer.estimatedDuration && (
                  <p className="mt-2 text-xs text-primary-400">Geschätzte Dauer: {offer.estimatedDuration}</p>
                )}
                {job.status === "OPEN" && offer.status === "PENDING" && (
                  <form action={acceptOfferAction.bind(null, offer.id)} className="mt-4">
                    <button
                      type="submit"
                      className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      Angebot annehmen
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
