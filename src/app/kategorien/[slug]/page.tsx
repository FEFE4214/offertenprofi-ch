import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import CraftsmanCard from "@/components/CraftsmanCard";
import { getCategoryBySlug, searchCraftsmen } from "@/lib/queries";
import { CANTONS } from "@/lib/cantons";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ kanton?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Handwerker finden | Offertenprofi.ch`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { kanton } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const craftsmen = await searchCraftsmen({ categorySlug: slug, canton: kanton || undefined });

  return (
    <div className="container-page py-12">
      <div className="flex flex-col gap-6 rounded-2xl bg-primary-700 p-8 text-white md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
            <CategoryIcon name={category.icon} className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="mt-1 max-w-xl text-primary-100">{category.description}</p>
          </div>
        </div>
        <Link
          href={`/auftrag-erstellen?kategorie=${category.id}`}
          className="inline-flex flex-none items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Auftrag in {category.name} einstellen
          <ArrowRight size={16} />
        </Link>
      </div>

      <form className="mt-8 flex flex-wrap items-end gap-4" method="GET">
        <div>
          <label className="mb-1 block text-xs font-medium text-primary-600">Kanton</label>
          <select
            name="kanton"
            defaultValue={kanton ?? ""}
            className="w-56 rounded-lg border border-primary-200 bg-white px-3 py-2.5 text-sm text-primary-800"
          >
            <option value="">Alle Kantone</option>
            {CANTONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          Filtern
        </button>
        {kanton && (
          <Link href={`/kategorien/${slug}`} className="text-sm text-primary-500 hover:underline">
            Filter zurücksetzen
          </Link>
        )}
      </form>

      <p className="mt-6 text-sm text-primary-500">
        {craftsmen.length} Handwerker gefunden{kanton ? ` in ${kanton}` : ""}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {craftsmen.map((c) => (
          <CraftsmanCard key={c.userId} craftsman={c} />
        ))}
      </div>

      {craftsmen.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-primary-200 bg-white p-10 text-center">
          <p className="font-semibold text-primary-700">Noch keine Handwerker in dieser Auswahl</p>
          <p className="mt-1 text-sm text-primary-500">
            Stellen Sie trotzdem einen Auftrag ein — passende Handwerker aus der Region melden sich bei Ihnen.
          </p>
          <Link
            href={`/auftrag-erstellen?kategorie=${category.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Auftrag einstellen
          </Link>
        </div>
      )}
    </div>
  );
}
