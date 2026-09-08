import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Briefcase, Globe, Phone } from "lucide-react";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import { cantonName } from "@/lib/cantons";
import { getCraftsmanDetail } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = await getCraftsmanDetail(id);
  if (!c) return {};
  return { title: `${c.companyName ?? c.name} — Offertenprofi.ch` };
}

export default async function CraftsmanProfilePage({ params }: Props) {
  const { id } = await params;
  const c = await getCraftsmanDetail(id);
  if (!c) notFound();

  return (
    <div className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-primary-800">{c.companyName ?? c.name}</h1>
                <p className="mt-1 text-primary-500">{c.name}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-primary-500">
                  <MapPin size={14} /> {c.city}, {cantonName(c.canton)}
                </p>
              </div>
              {c.verified && <VerifiedBadge />}
            </div>

            <div className="mt-4">
              <StarRating rating={c.rating.avg} count={c.rating.count} size={18} />
            </div>

            {c.bio && <p className="mt-5 whitespace-pre-line text-primary-700">{c.bio}</p>}

            <div className="mt-6 flex flex-wrap gap-2">
              {c.categoryNames.map((name) => (
                <span key={name} className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600">
                  {name}
                </span>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-primary-50 pt-6 text-sm">
              {c.yearsExperience !== null && (
                <div>
                  <dt className="inline-flex items-center gap-1.5 text-primary-400">
                    <Briefcase size={14} /> Erfahrung
                  </dt>
                  <dd className="mt-1 font-medium text-primary-800">{c.yearsExperience} Jahre</dd>
                </div>
              )}
              {c.website && (
                <div>
                  <dt className="inline-flex items-center gap-1.5 text-primary-400">
                    <Globe size={14} /> Webseite
                  </dt>
                  <dd className="mt-1 font-medium text-primary-800">
                    <a href={c.website} target="_blank" rel="noreferrer" className="hover:text-accent-600">
                      {c.website}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-primary-400">Einsatzgebiet</dt>
                <dd className="mt-1 font-medium text-primary-800">
                  {c.serviceAreas.map((code) => cantonName(code)).join(", ")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Reviews */}
          <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-7">
            <h2 className="text-lg font-bold text-primary-800">
              Bewertungen {c.reviews.length > 0 && `(${c.reviews.length})`}
            </h2>
            {c.reviews.length === 0 ? (
              <p className="mt-3 text-sm text-primary-500">Noch keine Bewertungen vorhanden.</p>
            ) : (
              <ul className="mt-5 space-y-5">
                {c.reviews.map((r) => (
                  <li key={r.id} className="border-t border-primary-50 pt-5 first:border-0 first:pt-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-primary-800">{r.customerName}</p>
                      <StarRating rating={r.rating} showCount={false} size={14} />
                    </div>
                    {r.comment && <p className="mt-2 text-sm text-primary-600">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar CTA */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <h3 className="font-semibold text-primary-800">Projekt mit {c.companyName ?? c.name}?</h3>
            <p className="mt-2 text-sm text-primary-500">
              Stellen Sie einen Auftrag ein — {c.name.split(" ")[0]} und weitere passende Handwerker
              aus {cantonName(c.canton)} können Ihnen ein Angebot unterbreiten.
            </p>
            <Link
              href="/auftrag-erstellen"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Auftrag einstellen
            </Link>
            {c.phone && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-primary-500">
                <Phone size={14} /> Kontakt nach Auftragsvergabe sichtbar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
