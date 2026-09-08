"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function MobileNav({
  isLoggedIn,
  role,
  dashboardHref,
}: {
  isLoggedIn: boolean;
  role: "CUSTOMER" | "CRAFTSMAN" | "ADMIN" | null;
  dashboardHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-700 hover:bg-primary-50"
        aria-label="Menü öffnen"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-primary-100 bg-white p-4 shadow-lg">
          <nav className="flex flex-col gap-1 text-sm font-medium text-primary-700">
            <Link href="/kategorien" className="rounded-lg px-3 py-2.5 hover:bg-primary-50" onClick={() => setOpen(false)}>
              Gewerke
            </Link>
            <Link href="/handwerker" className="rounded-lg px-3 py-2.5 hover:bg-primary-50" onClick={() => setOpen(false)}>
              Handwerker finden
            </Link>
            <Link href="/so-funktionierts" className="rounded-lg px-3 py-2.5 hover:bg-primary-50" onClick={() => setOpen(false)}>
              So funktioniert&apos;s
            </Link>
            <div className="my-2 border-t border-primary-100" />
            {!isLoggedIn && (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2.5 hover:bg-primary-50" onClick={() => setOpen(false)}>
                  Anmelden
                </Link>
                <Link
                  href="/registrieren/handwerker"
                  className="rounded-lg px-3 py-2.5 hover:bg-primary-50"
                  onClick={() => setOpen(false)}
                >
                  Als Handwerker registrieren
                </Link>
                <Link
                  href="/auftrag-erstellen"
                  className="rounded-lg bg-accent-500 px-3 py-2.5 text-center font-semibold text-white hover:bg-accent-600"
                  onClick={() => setOpen(false)}
                >
                  Auftrag einstellen
                </Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link href={dashboardHref} className="rounded-lg px-3 py-2.5 hover:bg-primary-50" onClick={() => setOpen(false)}>
                  {role === "CRAFTSMAN" ? "Mein Bereich" : "Meine Aufträge"}
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-primary-50">
                    Abmelden
                  </button>
                </form>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
