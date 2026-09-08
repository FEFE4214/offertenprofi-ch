import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  MessagesSquare,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import CraftsmanCard from "@/components/CraftsmanCard";
import { getCategories, getOpenJobCountByCategory, getPlatformStats, searchCraftsmen } from "@/lib/queries";

export default async function HomePage() {
  const categories = await getCategories();
  const jobCounts = await getOpenJobCountByCategory();
  const stats = await getPlatformStats();
  const topCraftsmen = (await searchCraftsmen({})).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-700">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-100">
              🇨🇭 Für die ganze Schweiz
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Offerte leicht gemacht.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-primary-100">
              Beschreiben Sie Ihr Projekt kostenlos und erhalten Sie unverbindliche Offerten von
              geprüften Handwerkern in Ihrer Region — von der Malerarbeit bis zur Komplettrenovation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auftrag-erstellen"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-semibold text-white hover:bg-accent-600"
              >
                Auftrag kostenlos einstellen
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/registrieren/handwerker"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                Als Handwerker Aufträge erhalten
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-100">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent-400" /> 100% kostenlos für Kunden
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent-400" /> Unverbindliche Offerten
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent-400" /> Geprüfte Handwerker
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-600">
              🚀 Wachsende Community
            </span>
            <h2 className="mt-3 text-lg font-bold text-primary-800">Offertenprofi.ch startet durch</h2>
            <p className="mt-1.5 text-sm text-primary-500">
              Wir vernetzen laufend neue, geprüfte Handwerksbetriebe aus der ganzen Schweiz mit
              Kundinnen und Kunden, die ein Projekt umsetzen möchten.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <p className="text-3xl font-extrabold text-primary-700">{stats.openJobsCount}</p>
                <p className="text-sm text-primary-500">Aktuell offene Aufträge</p>
              </div>
              {stats.reviewCount > 0 && (
                <div>
                  <p className="inline-flex items-center gap-1 text-3xl font-extrabold text-primary-700">
                    {stats.avgRating.toFixed(1)}
                    <Star size={22} className="fill-accent-500 text-accent-500" />
                  </p>
                  <p className="text-sm text-primary-500">Ø Bewertung ({stats.reviewCount})</p>
                </div>
              )}
            </div>
            <Link
              href="/handwerker"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
            >
              Handwerker durchsuchen
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-800">Beliebte Gewerke</h2>
            <p className="mt-1 text-primary-500">Wählen Sie eine Kategorie und finden Sie den passenden Handwerker.</p>
          </div>
          <Link href="/kategorien" className="hidden text-sm font-semibold text-accent-600 hover:underline sm:inline">
            Alle Gewerke ansehen
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategorien/${cat.slug}`}
              className="group rounded-xl border border-primary-100 bg-white p-5 transition hover:border-accent-300 hover:shadow-md"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-accent-50 group-hover:text-accent-600">
                <CategoryIcon name={cat.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-primary-800">{cat.name}</p>
              <p className="mt-0.5 text-xs text-primary-400">
                {jobCounts[cat.id] ?? 0} offene Aufträge
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold text-primary-800">So funktioniert Offertenprofi.ch</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <ClipboardList size={26} />
              </span>
              <h3 className="mt-4 font-semibold text-primary-800">1. Auftrag beschreiben</h3>
              <p className="mt-2 text-sm text-primary-500">
                Beschreiben Sie Ihr Projekt in wenigen Minuten — kostenlos und unverbindlich.
              </p>
            </div>
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <MessagesSquare size={26} />
              </span>
              <h3 className="mt-4 font-semibold text-primary-800">2. Offerten erhalten</h3>
              <p className="mt-2 text-sm text-primary-500">
                Passende Handwerker aus Ihrer Region melden sich mit einem Angebot bei Ihnen.
              </p>
            </div>
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <ShieldCheck size={26} />
              </span>
              <h3 className="mt-4 font-semibold text-primary-800">3. Auftrag vergeben</h3>
              <p className="mt-2 text-sm text-primary-500">
                Vergleichen Sie Offerten, Bewertungen und Profile — und vergeben Sie den Auftrag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured craftsmen */}
      {topCraftsmen.length > 0 && (
        <section className="container-page py-16">
          <h2 className="text-2xl font-bold text-primary-800">Top bewertete Handwerker</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {topCraftsmen.map((c) => (
              <CraftsmanCard key={c.userId} craftsman={c} />
            ))}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="bg-primary-800">
        <div className="container-page flex flex-col items-center gap-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Sind Sie Handwerker? Erhalten Sie passende Aufträge in Ihrer Region.
          </h2>
          <p className="max-w-xl text-primary-100">
            Erstellen Sie Ihr kostenloses Profil, wählen Sie Ihre Gewerke und Einsatzgebiete und
            geben Sie gezielt Offerten für passende Aufträge ab.
          </p>
          <Link
            href="/registrieren/handwerker"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-semibold text-white hover:bg-accent-600"
          >
            Jetzt kostenlos registrieren
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
