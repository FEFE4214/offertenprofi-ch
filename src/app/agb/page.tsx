import type { Metadata } from "next";

export const metadata: Metadata = { title: "AGB — Offertenprofi.ch" };

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold text-primary-800">Allgemeine Geschäftsbedingungen</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-primary-700">
        <p className="rounded-lg bg-accent-50 p-4 text-accent-700">
          Platzhaltertext — dies ist eine Demo-Plattform. Vor einem echten Betrieb müssen rechtsverbindliche
          AGB von einer Anwältin oder einem Anwalt erstellt werden.
        </p>
        <div>
          <h2 className="font-semibold text-primary-800">1. Geltungsbereich</h2>
          <p className="mt-1">
            Diese Bedingungen gelten für die Nutzung der Plattform Offertenprofi.ch durch Kunden und Handwerksbetriebe.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-primary-800">2. Leistungen</h2>
          <p className="mt-1">
            Offertenprofi.ch stellt eine Vermittlungsplattform zur Verfügung. Verträge über die Ausführung von Arbeiten
            kommen ausschliesslich zwischen Kunden und Handwerksbetrieben zustande.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-primary-800">3. Registrierung</h2>
          <p className="mt-1">
            Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Nutzer sind verpflichtet,
            wahrheitsgemässe Angaben zu machen.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-primary-800">4. Haftung</h2>
          <p className="mt-1">
            Offertenprofi.ch übernimmt keine Haftung für die Qualität der von Handwerksbetrieben erbrachten Leistungen.
          </p>
        </div>
      </div>
    </div>
  );
}
