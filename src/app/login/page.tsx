import Link from "next/link";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden — Offertenprofi.ch" };

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-primary-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-primary-800">Willkommen zurück</h1>
        <p className="mt-1 text-sm text-primary-500">Melden Sie sich bei Ihrem Offertenprofi.ch-Konto an.</p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-primary-500">
          Noch kein Konto?{" "}
          <Link href="/registrieren/kunde" className="font-semibold text-accent-600 hover:underline">
            Als Kunde registrieren
          </Link>{" "}
          oder{" "}
          <Link href="/registrieren/handwerker" className="font-semibold text-accent-600 hover:underline">
            als Handwerker
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-primary-50 p-4 text-xs text-primary-500">
          <p className="font-semibold text-primary-700">Demo-Zugänge (Passwort: demo1234)</p>
          <p className="mt-1">Kunde: anna.meier@example.ch</p>
          <p>Handwerker: marco.bianchi@example.ch</p>
        </div>
      </div>
    </div>
  );
}
