# Offertenprofi.ch — Offerte leicht gemacht

Eine voll funktionsfähige Handwerker-Vermittlungsplattform für die Schweiz: Kunden stellen Aufträge
ein, geprüfte Handwerker geben kostenlos Offerten ab. Funktional inspiriert vom Marktplatz-Prinzip
von Renovero/MyHammer, aber mit eigenem Namen, Branding und Quellcode — **keine Kopie** dieser Plattformen.

## Funktionsumfang

- Registrierung & Login für zwei Rollen: **Kunden** und **Handwerker**
- Kunden: Auftrag einstellen (Kategorie, Beschreibung, PLZ/Kanton, Budget, Wunschtermin),
  eigene Aufträge verwalten, Angebote vergleichen und annehmen, Auftrag abschliessen, bewerten
- Handwerker: kostenloses Profil (Firma, Bio, Erfahrung, Gewerke, Einsatzkantone), passende
  offene Aufträge sehen, Angebote abgeben/zurückziehen, eigene Angebote verwalten
- Öffentliche Handwerkersuche mit Filtern (Gewerk, Kanton, Mindestbewertung)
- 16 Gewerke-Kategorien mit eigenen Übersichtsseiten
- Sternebewertungen nach Auftragsabschluss + "Verifiziert"-Siegel für Handwerker
- Responsive Design (Desktop & Mobile), eigenes Farbschema/Branding
- **Bezahlte Lead-Freischaltung**: Handwerker sehen Kontaktdaten (Telefon/E-Mail) eines Kunden erst,
  nachdem sie CHF 15–25 (je nach Auftragsgrösse) bezahlt haben — per Einzelzahlung (Stripe Checkout:
  Karte, TWINT, Banküberweisung je nach Stripe-Konfiguration) oder aus einem vorab gekauften
  Guthaben-Paket (günstiger pro Freischaltung)
- **KI-Live-Support-Chat**: Chat-Widget unten rechts auf jeder Seite, beantwortet Besucherfragen zur
  Plattform automatisch (Claude API)

## Tech-Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + TypeScript
- **Tailwind CSS v4** fürs Styling
- **PostgreSQL** über **node-postgres (`pg`)** + **Drizzle ORM** (z. B. eine kostenlose Render-Postgres-Datenbank)
- **bcryptjs** für Passwort-Hashing, **jose** für signierte Session-Cookies (JWT)
- **zod** für Formular-/Server-Validierung
- **lucide-react** für Icons

> Hinweis: Ursprünglich war Prisma als ORM vorgesehen, aber der Prisma-Engine-Download war in der
> Entwicklungsumgebung blockiert. Drizzle ist eine gleichwertige Alternative ohne
> Binär-Download-Abhängigkeit. Für den lokalen Einstieg wurde zunächst SQLite verwendet; für den
> Live-Betrieb (Render) läuft die App jetzt auf PostgreSQL, da Render keine persistente Festplatte
> für eine SQLite-Datei im einfachen Web-Service-Modus bereitstellt.

## Setup

```bash
npm install
```

Lege eine `.env.local` an (siehe unten) mit einer `DATABASE_URL`, die auf eine PostgreSQL-Datenbank
zeigt (lokal z. B. via Docker, oder direkt eine kostenlose Render-Postgres-Instanz — auch für die
lokale Entwicklung nutzbar).

```bash
# Datenbank-Schema anlegen
npm run db:push

# Demo-Daten einspielen (Kategorien, Kantone, Beispiel-Handwerker & -Aufträge)
# Läuft nur, wenn die DB noch leer ist — mit --force kann komplett neu geseedet werden.
npm run db:seed

# Entwicklungsserver starten
npm run dev
```

Die App läuft dann unter [http://localhost:3000](http://localhost:3000).

### Demo-Zugänge (Passwort jeweils `demo1234`)

| Rolle      | E-Mail                        |
|------------|--------------------------------|
| Kunde      | anna.meier@example.ch          |
| Kunde      | peter.huber@example.ch         |
| Handwerker | marco.bianchi@example.ch       |
| Handwerker | stefan.keller@example.ch       |

### Umgebungsvariablen

Die App benötigt zwei Umgebungsvariablen (lokal in `.env.local`, in Produktion z. B. als
Render-Umgebungsvariablen):

| Variable | Beschreibung |
|---|---|
| `DATABASE_URL` | PostgreSQL-Verbindungsstring, z. B. `postgres://user:pass@host:5432/dbname` |
| `AUTH_SECRET` | Zufälliger, geheimer Wert zum Signieren der Session-Cookies (JWT) |
| `STRIPE_SECRET_KEY` | *(optional)* Stripe-Secret-Key — ohne diesen Wert funktioniert die App weiterhin, Zahlungen (Lead-Freischaltung, Guthaben-Kauf) sind dann aber deaktiviert und zeigen einen Hinweis statt eines Zahlungs-Buttons |
| `STRIPE_WEBHOOK_SECRET` | *(optional, nur mit Stripe)* Signing-Secret des Stripe-Webhooks (`/api/stripe/webhook`), bestätigt eingehende Zahlungen zuverlässig im Hintergrund |
| `ANTHROPIC_API_KEY` | *(optional)* Claude-API-Key für den Live-Support-Chat — ohne diesen Wert zeigt der Chat einen freundlichen Platzhalter-Hinweis statt echter Antworten |
| `ANTHROPIC_MODEL` | *(optional)* Anthropic-Modell für den Support-Chat, Standard: `claude-haiku-4-5` |

Ein neuer `AUTH_SECRET` lässt sich so erzeugen:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Wichtig:** `DATABASE_URL` enthält ein Datenbank-Passwort und sollte nie in ein öffentliches
Repository committet werden — `.env.local` ist bereits über `.gitignore` ausgeschlossen. In Render
wird die Variable direkt im Dashboard des Web-Service unter "Environment" gesetzt.

## Nützliche Befehle

```bash
npm run dev          # Entwicklungsserver
npm run build         # Produktions-Build
npm run start          # Produktionsserver (nach build)
npm run lint            # ESLint
npm run db:push        # Drizzle-Schema in die Postgres-DB übernehmen
npm run db:seed        # Demo-Daten einspielen (nur wenn DB leer ist; --force erzwingt Neu-Seed)
npm run db:studio      # Drizzle Studio (grafischer DB-Browser) öffnen
```

## End-to-End-Tests

Im Ordner `tests/` liegen zwei Playwright-Skripte, die die wichtigsten Abläufe automatisiert
durchklicken (Login, Auftrag erstellen, Angebot abgeben/annehmen/abschliessen, Bewertung,
Registrierung). Voraussetzung: Entwicklungsserver läuft auf Port 3000.

```bash
npm install -D playwright
npx playwright install chromium   # falls noch kein Chromium vorhanden ist
node tests/e2e-marketplace-flow.js
node tests/e2e-registration-flow.js
```

## Projektstruktur

```
src/
  app/                    Next.js App Router (Seiten & Server Actions)
    actions/              Server Actions (auth, jobs, offers, reviews, craftsman)
    dashboard/            Geschützte Bereiche für Kunden & Handwerker
    kategorien/, handwerker/   Öffentliche Übersichts-/Suchseiten
  components/             Wiederverwendbare UI-Komponenten
  db/                     Drizzle-Schema, DB-Client, Seed-Skript
  lib/                    Auth, Session, Validierung, Datenbank-Queries, Stammdaten
```

## Deployment (Render)

1. Code in ein Git-Repository (z. B. GitHub) pushen.
2. Eine PostgreSQL-Datenbank auf Render anlegen (Render Dashboard → New → PostgreSQL).
3. Einen Web Service auf Render anlegen, verbunden mit dem Repository:
   - Build-Befehl: `npm install && npm run db:push && npm run db:seed && npm run build`
   - Start-Befehl: `npm start`
4. Umgebungsvariablen `DATABASE_URL` (Internal/External Database URL aus Schritt 2) und
   `AUTH_SECRET` (siehe oben) im Web Service hinterlegen.
5. Deploy auslösen — die App ist danach unter der von Render vergebenen `*.onrender.com`-URL
   erreichbar (eine eigene Domain kann später verbunden werden).

### Zahlungen aktivieren (Stripe)

Ohne `STRIPE_SECRET_KEY` läuft die Plattform normal weiter, Handwerker sehen bei der
Kontakt-Freischaltung und beim Guthaben-Kauf aber nur einen Hinweis statt eines Zahlungs-Buttons.
So aktivierst du echte Zahlungen:

1. Kostenlos auf [stripe.com](https://stripe.com) registrieren (für Testzahlungen reicht die
   Registrierung allein, ohne Geschäftsverifizierung).
2. Im Stripe-Dashboard unter "Developers → API keys" den Secret Key kopieren → als
   `STRIPE_SECRET_KEY` im Render Web Service hinterlegen.
3. Unter "Payment methods" die gewünschten Zahlarten aktivieren (Karte, TWINT, weitere je nach
   Verfügbarkeit in der Schweiz) — welche davon angeboten werden, entscheidet ausschliesslich diese
   Dashboard-Einstellung, nicht der Code.
4. Unter "Developers → Webhooks" einen Endpoint auf `https://<deine-domain>/api/stripe/webhook`
   mit Event `checkout.session.completed` anlegen → das Signing-Secret als `STRIPE_WEBHOOK_SECRET`
   hinterlegen.
5. Sobald alles läuft und du bereit für echtes Geld bist: im Stripe-Dashboard von Test- auf
   Live-Modus wechseln und die Live-Keys statt der Test-Keys hinterlegen.

### Live-Support-Chat aktivieren

Ohne `ANTHROPIC_API_KEY` zeigt der Chat-Button unten rechts einen freundlichen Platzhalter-Hinweis.
Für echte KI-Antworten einen API-Key unter [console.anthropic.com](https://console.anthropic.com)
erstellen und als `ANTHROPIC_API_KEY` im Render Web Service hinterlegen.

## Von der Demo zur echten Produktivplattform

Diese App ist ein voll funktionsfähiges Fundament. Für einen echten Live-Betrieb in der Schweiz
sollten vor dem Launch noch ergänzt werden:

- **Hosting & Datenbank**: läuft bereits auf PostgreSQL (siehe Deployment-Abschnitt oben); für mehr
  Traffic/Verfügbarkeit ggf. auf einen bezahlten Render-Plan oder einen anderen Anbieter wechseln.
- **E-Mail-Versand**: Bestätigungs-, Angebots- und Erinnerungs-Mails (z. B. über Resend/Postmark).
- **Bild-Uploads**: Fotos zu Aufträgen und Handwerker-Portfolios (z. B. über Cloudflare R2/S3).
- **Zahlungsabwicklung**: Falls eine Vermittlungsgebühr erhoben werden soll (z. B. via Stripe/Wallee).
- **Verifizierung**: Handelsregisterauszug/Ausweisprüfung für das "Verifiziert"-Siegel.
- **Rechtliches**: Echte AGB und Datenschutzerklärung durch eine Anwältin/einen Anwalt prüfen lassen
  (aktuell sind das Platzhaltertexte).
- **Domain & Marke**: "Offertenprofi.ch" ist ein Platzhaltername — vor dem Launch Verfügbarkeit von Domain
  und Markenname in der Schweiz prüfen.

## Rechtlicher Hinweis

Diese Plattform ist ein eigenständiges, unabhängiges Projekt. Sie steht in keiner Verbindung zu und
verwendet keine Inhalte, Marken oder Quellcode von Renovero oder MyHammer — nur das grundlegende
Marktplatz-Prinzip (Kunden stellen Aufträge ein, Handwerker bieten darauf) wurde als Inspiration
für die Funktionsweise übernommen.
