import Link from "next/link";
import { Hammer, LogOut, LayoutDashboard, User } from "lucide-react";
import { getSession, getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import MobileNav from "@/components/MobileNav";

export default async function Header() {
  const session = await getSession();
  const user = session ? await getCurrentUser() : null;

  const dashboardHref =
    user?.role === "CRAFTSMAN" ? "/dashboard/handwerker" : "/dashboard/kunde";

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Hammer size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Offertenprofi<span className="text-accent-500">.ch</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-primary-700 md:flex">
          <Link href="/kategorien" className="hover:text-accent-600">
            Gewerke
          </Link>
          <Link href="/handwerker" className="hover:text-accent-600">
            Handwerker finden
          </Link>
          <Link href="/so-funktionierts" className="hover:text-accent-600">
            So funktioniert&apos;s
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!user && (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                Anmelden
              </Link>
              <Link
                href="/registrieren/handwerker"
                className="rounded-lg border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                Als Handwerker registrieren
              </Link>
              <Link
                href="/auftrag-erstellen"
                className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
              >
                Auftrag einstellen
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                <LayoutDashboard size={16} />
                {user.role === "CRAFTSMAN" ? "Mein Bereich" : "Meine Aufträge"}
              </Link>
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700">
                <User size={16} />
                {user.name.split(" ")[0]}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-50"
                  title="Abmelden"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </>
          )}
        </div>

        <MobileNav
          isLoggedIn={!!user}
          role={user?.role ?? null}
          dashboardHref={dashboardHref}
        />
      </div>
    </header>
  );
}
