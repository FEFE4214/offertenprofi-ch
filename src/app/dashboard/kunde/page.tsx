import Link from "next/link";
import type { Metadata } from "next";
import { Plus, MapPin, MessageSquare } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getJobsForCustomer } from "@/lib/queries";
import { JobStatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Meine Aufträge — Offertenprofi.ch" };

export default async function CustomerDashboardPage() {
  const user = await requireUser("CUSTOMER");
  const jobs = await getJobsForCustomer(user.id);

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Meine Aufträge</h1>
          <p className="text-sm text-primary-500">Willkommen zurück, {user.name.split(" ")[0]}.</p>
        </div>
        <Link
          href="/auftrag-erstellen"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          <Plus size={16} /> Neuer Auftrag
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center">
          <p className="font-semibold text-primary-700">Sie haben noch keine Aufträge erstellt</p>
          <p className="mt-1 text-sm text-primary-500">
            Beschreiben Sie Ihr Projekt und erhalten Sie kostenlos Offerten von Handwerkern.
          </p>
          <Link
            href="/auftrag-erstellen"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
          >
            <Plus size={16} /> Ersten Auftrag einstellen
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/kunde/auftrag/${job.id}`}
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
                <JobStatusBadge status={job.status} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-primary-50 pt-4 text-sm">
                <span className="inline-flex items-center gap-1.5 text-primary-500">
                  <MessageSquare size={14} />
                  {job.offerCount} {job.offerCount === 1 ? "Angebot" : "Angebote"}
                </span>
                {(job.budgetMin || job.budgetMax) && (
                  <span className="text-primary-500">
                    Budget: CHF {job.budgetMin ?? "?"}–{job.budgetMax ?? "?"}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
