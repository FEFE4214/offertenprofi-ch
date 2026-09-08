import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, MessagesSquare, ShieldCheck, Star, Wrench, UserCheck } from "lucide-react";

export const metadata: Metadata = { title: "So funktioniert's — Offertenprofi.ch" };

export default function HowItWorksPage() {
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold text-primary-800">So funktioniert Offertenprofi.ch</h1>
      <p className="mt-2 max-w-2xl text-primary-500">
        Offertenprofi.ch verbindet Kundinnen und Kunden in der ganzen Schweiz mit qualifizierten Handwerksbetrieben —
        schnell, transparent und kostenlos.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-primary-800">Für Kunden</h2>
          <ol className="mt-5 space-y-6">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <ClipboardList size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Auftrag beschreiben</p>
                <p className="mt-1 text-sm text-primary-500">Erstellen Sie kostenlos ein Konto und beschreiben Sie Ihr Projekt in wenigen Minuten.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <MessagesSquare size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Offerten vergleichen</p>
                <p className="mt-1 text-sm text-primary-500">Passende Handwerker aus Ihrer Region senden Ihnen unverbindliche Angebote.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Auftrag vergeben</p>
                <p className="mt-1 text-sm text-primary-500">Wählen Sie das beste Angebot anhand von Preis, Profil und Bewertungen aus.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Star size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Bewerten</p>
                <p className="mt-1 text-sm text-primary-500">Nach Abschluss bewerten Sie den Handwerker und helfen anderen Kunden bei der Auswahl.</p>
              </div>
            </li>
          </ol>
          <Link href="/registrieren/kunde" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600">
            Jetzt Auftrag einstellen
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary-800">Für Handwerker</h2>
          <ol className="mt-5 space-y-6">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <UserCheck size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Profil erstellen</p>
                <p className="mt-1 text-sm text-primary-500">Registrieren Sie sich kostenlos und wählen Sie Ihre Gewerke sowie Einsatzgebiete.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Wrench size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Passende Aufträge finden</p>
                <p className="mt-1 text-sm text-primary-500">Sehen Sie ausschliesslich Aufträge, die zu Ihren Gewerken und Ihrer Region passen.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <MessagesSquare size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Offerte abgeben</p>
                <p className="mt-1 text-sm text-primary-500">Reichen Sie ein persönliches Angebot mit Preis und Nachricht ein.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Star size={18} />
              </span>
              <div>
                <p className="font-semibold text-primary-800">Bewertungen sammeln</p>
                <p className="mt-1 text-sm text-primary-500">Zufriedene Kunden bewerten Sie und stärken so Ihr Profil für zukünftige Aufträge.</p>
              </div>
            </li>
          </ol>
          <Link href="/registrieren/handwerker" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
            Kostenlos als Handwerker registrieren
          </Link>
        </div>
      </div>
    </div>
  );
}
