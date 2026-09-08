import Link from "next/link";
import type { Metadata } from "next";
import RegisterCustomerForm from "./RegisterCustomerForm";

export const metadata: Metadata = { title: "Als Kunde registrieren — Offertenprofi.ch" };

export default function RegisterCustomerPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-2xl border border-primary-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-primary-800">Kostenlos als Kunde registrieren</h1>
        <p className="mt-1 text-sm text-primary-500">
          Stellen Sie Aufträge ein und erhalten Sie unverbindliche Offerten von Handwerkern.
        </p>

        <RegisterCustomerForm />

        <p className="mt-6 text-center text-sm text-primary-500">
          Bereits registriert?{" "}
          <Link href="/login" className="font-semibold text-accent-600 hover:underline">
            Anmelden
          </Link>
          {" · "}
          <Link href="/registrieren/handwerker" className="font-semibold text-accent-600 hover:underline">
            Als Handwerker registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
