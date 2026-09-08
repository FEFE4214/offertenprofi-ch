import Link from "next/link";
import { Hammer } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-primary-100 bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-primary-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Hammer size={16} />
            </span>
            <span className="text-base font-bold">
              Offertenprofi<span className="text-accent-500">.ch</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-primary-500">
            Offerte leicht gemacht. Die Vermittlungsplattform für Handwerker-Aufträge in der ganzen Schweiz.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-800">Für Kunden</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-500">
            <li><Link href="/auftrag-erstellen" className="hover:text-accent-600">Auftrag einstellen</Link></li>
            <li><Link href="/handwerker" className="hover:text-accent-600">Handwerker finden</Link></li>
            <li><Link href="/so-funktionierts" className="hover:text-accent-600">So funktioniert&apos;s</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-800">Für Handwerker</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-500">
            <li><Link href="/registrieren/handwerker" className="hover:text-accent-600">Kostenlos registrieren</Link></li>
            <li><Link href="/kategorien" className="hover:text-accent-600">Alle Gewerke</Link></li>
            <li><Link href="/login" className="hover:text-accent-600">Anmelden</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-800">Unternehmen</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-500">
            <li><Link href="/ueber-uns" className="hover:text-accent-600">Über uns</Link></li>
            <li><Link href="/kontakt" className="hover:text-accent-600">Kontakt</Link></li>
            <li><Link href="/agb" className="hover:text-accent-600">AGB</Link></li>
            <li><Link href="/datenschutz" className="hover:text-accent-600">Datenschutz</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-100 py-6">
        <p className="container-page text-xs text-primary-400">
          © {new Date().getFullYear()} Offertenprofi.ch — Diese Plattform ist ein unabhängiges Projekt und steht in keiner Verbindung zu Renovero oder MyHammer.
        </p>
      </div>
    </footer>
  );
}
