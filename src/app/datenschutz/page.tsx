import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz — Offertenprofi.ch" };

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold text-primary-800">Datenschutzerklärung</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-primary-700">
        <p className="rounded-lg bg-accent-50 p-4 text-accent-700">
          Platzhaltertext — dies ist eine Demo-Plattform. Vor einem echten Betrieb muss eine rechtskonforme
          Datenschutzerklärung gemäss Schweizer DSG (und ggf. EU-DSGVO) erstellt werden.
        </p>
        <div>
          <h2 className="font-semibold text-primary-800">Verantwortliche Stelle</h2>
          <p className="mt-1">Offertenprofi.ch, Musterstrasse 1, 8000 Zürich, hallo@offertenprofi.ch</p>
        </div>
        <div>
          <h2 className="font-semibold text-primary-800">Erhobene Daten</h2>
          <p className="mt-1">
            Bei der Registrierung erheben wir Name, E-Mail-Adresse, Telefonnummer sowie Standortangaben (PLZ, Ort,
            Kanton), um Aufträge und Angebote passgenau zu vermitteln.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-primary-800">Verwendung der Daten</h2>
          <p className="mt-1">
            Ihre Daten werden ausschliesslich zur Vermittlung zwischen Kunden und Handwerksbetrieben sowie zur
            Verbesserung unserer Plattform verwendet.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-primary-800">Ihre Rechte</h2>
          <p className="mt-1">
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung Ihrer gespeicherten Daten.
          </p>
        </div>
      </div>
    </div>
  );
}
