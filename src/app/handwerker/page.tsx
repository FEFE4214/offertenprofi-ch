import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import CraftsmanCard from "@/components/CraftsmanCard";
import { getCategories, searchCraftsmen } from "@/lib/queries";
import { CANTONS } from "@/lib/cantons";

export const metadata: Metadata = {
  title: "Handwerker finden — Offertenprofi.ch",
  description: "Durchsuchen Sie geprüfte Handwerker in der ganzen Schweiz nach Gewerk und Kanton.",
};

type Props = {
  searchParams: Promise<{ gewerk?: string; kanton?: string; bewertung?: string }>;
};

export default async function CraftsmenSearchPage({ searchParams }: Props) {
  const { gewerk, kanton, bewertung } = await searchParams;
  const categories = await getCategories();
  const minRating = bewertung ? Number(bewertung) : undefined;

  const craftsmen = await searchCraftsmen({
    categorySlug: gewerk || undefined,
    canton: kanton || undefined,
    minRating,
  });

  return (
    <div className="container-page py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Search size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Handwerker finden</h1>
          <p className="text-sm text-primary-500">Geprüfte Profis für Ihr Projekt in der ganzen Schweiz.</p>
        </div>
      </div>

      <form className="mt-8 flex flex-wrap items-end gap-4 rounded-xl border border-primary-100 bg-white p-5" method="GET">
        <div>
          <label className="mb-1 block text-xs font-medium text-primary-600">Gewerk</label>
          <select
            name="gewerk"
            defaultValue={gewerk ?? ""}
            className="w-56 rounded-lg border border-primary-200 bg-white px-3 py-2.5 text-sm text-primary-800"
          >
            <option value="">Alle Gewerke</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-primary-600">Kanton</label>
          <select
            name="kanton"
            defaultValue={kanton ?? ""}
            className="w-52 rounded-lg border border-primary-200 bg-white px-3 py-2.5 text-sm text-primary-800"
          >
            <option value="">Alle Kantone</option>
            {CANTONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-primary-600">Mindestbewertung</label>
          <select
            name="bewertung"
            defaultValue={bewertung ?? ""}
            className="w-44 rounded-lg border border-primary-200 bg-white px-3 py-2.5 text-sm text-primary-800"
          >
            <option value="">Alle Bewertungen</option>
            <option value="4.5">4.5+ Sterne</option>
            <option value="4">4+ Sterne</option>
            <option value="3">3+ Sterne</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Suchen
        </button>
        {(gewerk || kanton || bewertung) && (
          <Link href="/handwerker" className="text-sm text-primary-500 hover:underline">
            Filter zurücksetzen
          </Link>
        )}
      </form>

      <p className="mt-6 text-sm text-primary-500">{craftsmen.length} Handwerker gefunden</p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {craftsmen.map((c) => (
          <CraftsmanCard key={c.userId} craftsman={c} />
        ))}
      </div>

      {craftsmen.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-primary-200 bg-white p-10 text-center text-primary-500">
          Keine Handwerker für diese Filterkombination gefunden.
        </div>
      )}
    </div>
  );
}
