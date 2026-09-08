import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { getSession, getCurrentUser } from "@/lib/session";
import { getCategories } from "@/lib/queries";
import PostJobForm from "./PostJobForm";

export const metadata: Metadata = { title: "Auftrag einstellen — Offertenprofi.ch" };

type Props = { searchParams: Promise<{ kategorie?: string }> };

export default async function PostJobPage({ searchParams }: Props) {
  const { kategorie } = await searchParams;
  const session = await getSession();
  const user = session ? await getCurrentUser() : null;
  const categories = await getCategories();

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <ClipboardList size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-primary-800">Auftrag einstellen</h1>
            <p className="text-sm text-primary-500">Kostenlos & unverbindlich — in 2 Minuten erledigt.</p>
          </div>
        </div>

        {!user && (
          <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-8 text-center">
            <p className="font-semibold text-primary-800">Bitte melden Sie sich an, um einen Auftrag einzustellen</p>
            <p className="mt-2 text-sm text-primary-500">
              Mit einem kostenlosen Konto behalten Sie den Überblick über Ihre Aufträge und eingehenden Offerten.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/registrieren/kunde"
                className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
              >
                Kostenlos registrieren
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                Anmelden
              </Link>
            </div>
          </div>
        )}

        {user && user.role === "CRAFTSMAN" && (
          <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-8 text-center">
            <p className="font-semibold text-primary-800">Sie sind als Handwerker angemeldet</p>
            <p className="mt-2 text-sm text-primary-500">
              Mit diesem Konto können Sie keine Aufträge einstellen. Registrieren Sie sich als Kunde mit einer anderen E-Mail-Adresse.
            </p>
            <Link
              href="/registrieren/kunde"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Als Kunde registrieren
            </Link>
          </div>
        )}

        {user && user.role === "CUSTOMER" && (
          <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-8">
            <PostJobForm categories={categories} defaultCategoryId={kategorie} defaultCanton={user.canton} defaultPlz={user.plz} defaultCity={user.city} />
          </div>
        )}
      </div>
    </div>
  );
}
