import type { Metadata } from "next";

export const metadata: Metadata = { title: "Über uns — Offertenprofi.ch" };

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold text-primary-800">Über Offertenprofi.ch</h1>
      <div className="mt-6 space-y-4 text-primary-700">
        <p>
          Offertenprofi.ch ist eine unabhängige Vermittlungsplattform, die Kundinnen und Kunden in der ganzen Schweiz
          mit qualifizierten Handwerksbetrieben zusammenbringt. Unser Ziel: Renovations- und Bauprojekte einfacher,
          transparenter und schneller machen — für beide Seiten.
        </p>
        <p>
          Kundinnen und Kunden können kostenlos und unverbindlich Aufträge einstellen und erhalten passende Offerten
          von Handwerkern aus ihrer Region. Handwerksbetriebe profitieren von einem kostenlosen Profil und erhalten
          gezielt Anfragen, die zu ihren Gewerken und ihrem Einsatzgebiet passen.
        </p>
        <p>
          Diese Plattform ist ein unabhängiges Projekt und steht in keiner Verbindung zu bestehenden
          Vermittlungsplattformen wie Renovero oder MyHammer.
        </p>
      </div>
    </div>
  );
}
