import Link from "next/link";
import type { Metadata } from "next";
import CategoryIcon from "@/components/CategoryIcon";
import { getCategories, getOpenJobCountByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Alle Gewerke — Offertenprofi.ch",
  description: "Entdecken Sie alle Gewerke auf Offertenprofi.ch und finden Sie den passenden Handwerker für Ihr Projekt.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  const jobCounts = await getOpenJobCountByCategory();

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-primary-800">Alle Gewerke</h1>
      <p className="mt-2 max-w-2xl text-primary-500">
        Von Malerarbeiten bis zur Komplettrenovation — wählen Sie ein Gewerk und finden Sie
        geprüfte Handwerker in Ihrer Region.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategorien/${cat.slug}`}
            className="group flex items-start gap-4 rounded-xl border border-primary-100 bg-white p-5 transition hover:border-accent-300 hover:shadow-md"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-accent-50 group-hover:text-accent-600">
              <CategoryIcon name={cat.icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold text-primary-800">{cat.name}</p>
              <p className="mt-1 text-sm text-primary-500">{cat.description}</p>
              <p className="mt-2 text-xs font-medium text-accent-600">
                {jobCounts[cat.id] ?? 0} offene Aufträge
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
