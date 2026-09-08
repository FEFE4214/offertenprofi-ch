import Link from "next/link";
import type { Metadata } from "next";
import RegisterCraftsmanForm from "./RegisterCraftsmanForm";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Als Handwerker registrieren — Offertenprofi.ch" };

export default async function RegisterCraftsmanPage() {
  const categories = await getCategories();

  return (
    <div className="container-page flex items-center justify-center py-16">
      <div className="w-full max-w-2xl rounded-2xl border border-primary-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-primary-800">Kostenlos als Handwerker registrieren</h1>
        <p className="mt-1 text-sm text-primary-500">
          Erstellen Sie Ihr Profil, wählen Sie Ihre Gewerke und Einsatzgebiete und erhalten Sie passende
          Aufträge in Ihrer Region.
        </p>

        <RegisterCraftsmanForm categories={categories} />

        <p className="mt-6 text-center text-sm text-primary-500">
          Bereits registriert?{" "}
          <Link href="/login" className="font-semibold text-accent-600 hover:underline">
            Anmelden
          </Link>
          {" · "}
          <Link href="/registrieren/kunde" className="font-semibold text-accent-600 hover:underline">
            Als Kunde registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
