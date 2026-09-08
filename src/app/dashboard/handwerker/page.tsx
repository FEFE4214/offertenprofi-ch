import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Wallet, ArrowRight, ListChecks } from "lucide-react";
import { requireUser, getCurrentCraftsmanProfile } from "@/lib/session";
import { getOpenJobsForCraftsman } from "@/lib/queries";

export const metadata: Metadata = { title: "Offene Aufträge — Offertenprofi.ch" };

export default async function CraftsmanDashboardPage() {
  const user = await requireUser("CRAFTSMAN");
  const profile = await getCurrentCraftsmanProfile();
  const jobs = await getOpenJobsForCraftsman(user.id);

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Passende Aufträge</h1>
          <p className="text-sm text-primary-500">Willkommen zurück, {user.name.split(" ")[0]}.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/handwerker/angebote"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
          >
            <ListChecks size={16} /> Meine Angebote
          </Link>
          <Link
            href="/dashboard/handwerker/profil"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Profil bearbeiten
          </Link>
        </div>
      </div>

      {!profile?.verified && (
        <div className="mt-6 rounded-xl border border-accent-100 bg-accent-50 p-4 text-sm text-accent-700">
          Ihr Profil ist noch nicht verifiziert. Ein vollständiges Profil mit Erfahrung und Referenzen erhöht Ihre Chancen auf Aufträge.
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center">
          <p className="font-semibold text-primary-700">Aktuell keine passenden Aufträge</p>
          <p className="mt-1 text-sm text-primary-500">
            Erweitern Sie Ihre Gewerke oder Einsatzgebiete, um mehr Aufträge zu sehen.
          </p>
          <Link
            href="/dashboard/handwerker/profil"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Profil erweitern
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/handwerker/auftrag/${job.id}`}
              className="block rounded-xl border border-primary-100 bg-white p-6 transition hover:border-accent-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-primary-400">{job.categoryName}</span>
                  <h2 className="mt-0.5 font-semibold text-primary-800">{job.title}</h2>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-primary-500">
                    <MapPin size={14} /> {job.city}, {job.canton}
                  </p>
                </div>
                {job.alreadyOffered ? (
                  <span className="inline-flex rounded-full bg-success-100 px-2.5 py-1 text-xs font-semibold text-success-500">
                    Angebot abgegeben
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                    Angebot abgeben <ArrowRight size={14} />
                  </span>
                )}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-primary-600">{job.description}</p>
              {(job.budgetMin || job.budgetMax) && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary-500">
                  <Wallet size={14} /> Budget: CHF {job.budgetMin ?? "?"}–{job.budgetMax ?? "?"}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
