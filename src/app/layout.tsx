import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Offertenprofi.ch — Offerte leicht gemacht",
  description:
    "Offertenprofi.ch ist die Schweizer Vermittlungsplattform für Handwerker-Aufträge: Kunden stellen Aufträge ein, qualifizierte Handwerker geben kostenlos Offerten ab.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de-CH" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
