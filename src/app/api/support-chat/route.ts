import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Du bist der Live-Support-Assistent von Offertenprofi.ch, einer Schweizer
Vermittlungsplattform für Handwerker-Aufträge (ähnliches Prinzip wie Renovero/MyHammer, aber ein
eigenständiges Projekt). Antworte immer auf Deutsch, freundlich, kurz und professionell.

So funktioniert die Plattform:
- Kunden erstellen kostenlos ein Konto und stellen einen Auftrag ein (Gewerk, Beschreibung, PLZ/Kanton,
  Budget, Wunschtermin).
- Passende, geprüfte Handwerker in der Region sehen den Auftrag und geben eine unverbindliche Offerte ab.
- Der Kunde vergleicht Angebote (Preis, Profil, Bewertungen) und nimmt eines an.
- Nach Abschluss des Auftrags kann der Kunde den Handwerker bewerten.
- Für Kunden ist die Nutzung immer 100% kostenlos.
- Handwerker können sich kostenlos registrieren und ein Profil anlegen (Firma, Erfahrung, Gewerke,
  Einsatzkantone). Um bei einem konkreten Auftrag die Kontaktdaten (Telefon/E-Mail) des Kunden zu sehen,
  zahlen Handwerker eine einmalige Freischaltungsgebühr von ca. CHF 15-25 (je nach Auftragsgrösse) —
  entweder direkt per Kreditkarte/TWINT/Banküberweisung, oder günstiger über ein vorab gekauftes
  Guthaben-Paket im Bereich "Guthaben" im Handwerker-Dashboard.
- Es gibt 16 Gewerke-Kategorien (Maler, Elektriker, Sanitär, Gartenbau, Schreiner, uvm.), einsehbar
  unter "Gewerke".
- Registrierung erfolgt getrennt für Kunden ("Als Kunde registrieren") und Handwerker
  ("Als Handwerker registrieren").

Wenn du eine Frage nicht sicher beantworten kannst oder es um Rechtliches, Zahlungsprobleme oder ein
konkretes Konto geht, sag ehrlich, dass du das nicht abschliessend beantworten kannst, und verweise
freundlich auf die Kontaktseite der Plattform. Erfinde keine Informationen, die hier nicht stehen.
Halte Antworten kurz (wenige Sätze), ausser der Nutzer bittet um mehr Detail.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

const FALLBACK_REPLY =
  "Der Live-Chat ist gerade nicht verfügbar (noch kein Support-KI-Zugang eingerichtet). " +
  "Bitte nutze in der Zwischenzeit die Kontaktseite — wir melden uns so schnell wie möglich.";

export async function POST(req: NextRequest) {
  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "Keine Nachricht übermittelt." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  // Nur die letzten Nachrichten mitschicken, um Kosten/Latenz gering zu halten.
  const recentMessages = messages.slice(-12).map((m) => ({
    role: m.role,
    content: String(m.content).slice(0, 2000),
  }));

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: recentMessages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const data = await res.json();
    const reply =
      data.content?.map((block: { text?: string }) => block.text ?? "").join("") ||
      FALLBACK_REPLY;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Support chat error:", err);
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
