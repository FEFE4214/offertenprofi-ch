import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Calendar, Wallet, ArrowLeft, Lock, Phone, Mail, Coins } from "lucide-react";
import { requireUser, getCurrentCraftsmanProfile } from "@/lib/session";
import { getJobDetail, getLeadUnlock, getCustomerContact } from "@/lib/queries";
import { cantonName } from "@/lib/cantons";
import { JobStatusBadge, OfferStatusBadge } from "@/components/StatusBadge";
import { calculateLeadPrice } from "@/lib/leadPricing";
import { stripeEnabled } from "@/lib/stripe";
import { unlockJobContactAction, confirmStripeSessionIfPaid } from "@/app/actions/payments";
import OfferForm from "./OfferForm";

export const metadata: Metadata = { title: "Auftrag ansehen — Offertenprofi.ch" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ unlock_session_id?: string }>;
};

export default async function CraftsmanJobDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { unlock_session_id } = await searchParams;
  const user = await requireUser("CRAFTSMAN");

  if (unlock_session_id) {
    await confirmStripeSessionIfPaid(unlock_session_id);
  }

  const detail = await getJobDetail(id);
  if (!detail) notFound();

  const { job, category, customerName, offers } = detail;
  const myOffer = offers.find((o) => o.craftsmanId === user.id) ?? null;

  const unlock = await getLeadUnlock(job.id, user.id);
  const contact = unlock ? await getCustomerContact(job.customerId) : null;
  const profile = await getCurrentCraftsmanProfile();
  const leadPrice = calculateLeadPrice(job);

  return (
    <div className="container-page py-12">
      <Link href="/dashboard/handwerker" className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-accent-600">
        <ArrowLeft size={14} /> Zurück zu den Aufträgen
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-primary-400">{category?.name}</span>
                <h1 className="mt-0.5 text-2xl font-bold text-primary-800">{job.title}</h1>
                <p className="mt-1 text-sm text-primary-500">Auftraggeber: {customerName}</p>
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
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <h2 className="font-semibold text-primary-800">Ihr Angebot</h2>

            {myOffer ? (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-primary-800">CHF {myOffer.price.toLocaleString("de-CH")}</p>
                  <OfferStatusBadge status={myOffer.status} />
                </div>
                <p className="mt-2 text-sm text-primary-600">{myOffer.message}</p>
                {myOffer.estimatedDuration && (
                  <p className="mt-2 text-xs text-primary-400">Geschätzte Dauer: {myOffer.estimatedDuration}</p>
                )}
              </div>
            ) : job.status === "OPEN" ? (
              <OfferForm jobId={job.id} />
            ) : (
              <p className="mt-3 text-sm text-primary-500">
                Dieser Auftrag ist nicht mehr offen für neue Angebote.
              </p>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6">
            <h2 className="font-semibold text-primary-800">Kontaktdaten</h2>

            {contact ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="font-medium text-primary-800">{contact.name}</p>
                {contact.phone && (
                  <p className="inline-flex items-center gap-2 text-primary-600">
                    <Phone size={14} /> {contact.phone}
                  </p>
                )}
                {contact.email && (
                  <p className="inline-flex items-center gap-2 text-primary-600">
                    <Mail size={14} /> {contact.email}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <p className="inline-flex items-center gap-2 text-sm text-primary-500">
                  <Lock size={14} /> Telefon &amp; E-Mail sind noch gesperrt.
                </p>
                <p className="mt-2 text-xs text-primary-400">
                  {profile && profile.creditBalance >= 1
                    ? "Wird mit 1 Freischaltung aus deinem Guthaben bezahlt."
                    : `Einmalige Freischaltung für diesen Auftrag: CHF ${leadPrice}.`}
                </p>
                <form action={unlockJobContactAction.bind(null, job.id)} className="mt-3">
                  <button
                    type="submit"
                    disabled={!profile || (profile.creditBalance < 1 && !stripeEnabled)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {profile && profile.creditBalance >= 1 ? (
                      <>
                        <Coins size={16} /> Mit Guthaben freischalten
                      </>
                    ) : (
                      <>Kontakt freischalten (CHF {leadPrice})</>
                    )}
                  </button>
                </form>
                {(!profile || profile.creditBalance < 1) && !stripeEnabled && (
                  <p className="mt-2 text-xs text-primary-400">
                    Zahlungen sind aktuell noch nicht eingerichtet.
                  </p>
                )}
                <Link
                  href="/dashboard/handwerker/guthaben"
                  className="mt-2 inline-block text-xs font-medium text-accent-600 hover:underline"
                >
                  Guthaben kaufen &amp; günstiger freischalten
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
