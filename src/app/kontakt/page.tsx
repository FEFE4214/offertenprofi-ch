import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Kontakt — Offertenprofi.ch" };

export default function ContactPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold text-primary-800">Kontakt</h1>
      <p className="mt-3 text-primary-500">
        Haben Sie Fragen zu Offertenprofi.ch? Wir helfen Ihnen gerne weiter.
      </p>
      <div className="mt-8 space-y-4 rounded-2xl border border-primary-100 bg-white p-7">
        <p className="inline-flex items-center gap-2 text-primary-700">
          <Mail size={16} className="text-primary-400" /> hallo@offertenprofi.ch
        </p>
        <p className="inline-flex items-center gap-2 text-primary-700">
          <MapPin size={16} className="text-primary-400" /> Offertenprofi.ch, Musterstrasse 1, 8000 Zürich
        </p>
      </div>
      <p className="mt-4 text-xs text-primary-400">
        Hinweis: Dies ist eine Demo-Plattform. Kontaktangaben dienen als Platzhalter.
      </p>
    </div>
  );
}
