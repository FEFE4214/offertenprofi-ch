import "server-only";

/**
 * Berechnet den Preis (CHF), den ein Handwerker zahlt, um die Kontaktdaten
 * für einen Auftrag freizuschalten. Skaliert grob mit der Auftragsgrösse:
 * kleine/unbekannte Budgets -> CHF 15, mittlere -> CHF 18-20, grosse -> bis CHF 25.
 */
export function calculateLeadPrice(job: {
  budgetMin: number | null;
  budgetMax: number | null;
}): number {
  const reference = job.budgetMax ?? job.budgetMin ?? 0;

  if (reference <= 0) return 15;
  if (reference <= 1500) return 15;
  if (reference <= 4000) return 18;
  if (reference <= 8000) return 20;
  return 25;
}

export type CreditPackage = {
  id: string;
  credits: number;
  amountChf: number;
  label: string;
};

// Guthaben-Pakete: pro Freischaltung günstiger als der Einzelkauf.
export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "starter", credits: 5, amountChf: 85, label: "5 Freischaltungen" },
  { id: "standard", credits: 10, amountChf: 160, label: "10 Freischaltungen" },
  { id: "profi", credits: 20, amountChf: 300, label: "20 Freischaltungen" },
];

export function getCreditPackage(id: string): CreditPackage | null {
  return CREDIT_PACKAGES.find((p) => p.id === id) ?? null;
}
