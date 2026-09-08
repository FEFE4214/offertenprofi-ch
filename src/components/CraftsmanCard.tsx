import Link from "next/link";
import { MapPin } from "lucide-react";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import type { CraftsmanCardData } from "@/lib/queries";

export default function CraftsmanCard({ craftsman }: { craftsman: CraftsmanCardData }) {
  const c = craftsman;
  return (
    <Link
      href={`/handwerker/${c.userId}`}
      className="flex flex-col rounded-xl border border-primary-100 bg-white p-6 transition hover:border-accent-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-primary-800">{c.companyName ?? c.name}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-primary-500">
            <MapPin size={14} /> {c.city}, {c.canton}
          </p>
        </div>
        {c.verified && <VerifiedBadge className="flex-none" />}
      </div>

      {c.bio && <p className="mt-3 line-clamp-3 text-sm text-primary-500">{c.bio}</p>}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {c.categoryNames.slice(0, 3).map((name) => (
          <span
            key={name}
            className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-600"
          >
            {name}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-primary-50 pt-4">
        <StarRating rating={c.rating.avg} count={c.rating.count} />
        {c.yearsExperience !== null && (
          <span className="text-xs text-primary-400">{c.yearsExperience} Jahre Erfahrung</span>
        )}
      </div>
    </Link>
  );
}
