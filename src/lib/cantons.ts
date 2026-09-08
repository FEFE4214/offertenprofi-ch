export const CANTONS = [
  { code: "ZH", name: "Zürich" },
  { code: "BE", name: "Bern" },
  { code: "LU", name: "Luzern" },
  { code: "UR", name: "Uri" },
  { code: "SZ", name: "Schwyz" },
  { code: "OW", name: "Obwalden" },
  { code: "NW", name: "Nidwalden" },
  { code: "GL", name: "Glarus" },
  { code: "ZG", name: "Zug" },
  { code: "FR", name: "Freiburg" },
  { code: "SO", name: "Solothurn" },
  { code: "BS", name: "Basel-Stadt" },
  { code: "BL", name: "Basel-Landschaft" },
  { code: "SH", name: "Schaffhausen" },
  { code: "AR", name: "Appenzell Ausserrhoden" },
  { code: "AI", name: "Appenzell Innerrhoden" },
  { code: "SG", name: "St. Gallen" },
  { code: "GR", name: "Graubünden" },
  { code: "AG", name: "Aargau" },
  { code: "TG", name: "Thurgau" },
  { code: "TI", name: "Tessin" },
  { code: "VD", name: "Waadt" },
  { code: "VS", name: "Wallis" },
  { code: "NE", name: "Neuenburg" },
  { code: "GE", name: "Genf" },
  { code: "JU", name: "Jura" },
] as const;

export function cantonName(code: string): string {
  return CANTONS.find((c) => c.code === code)?.name ?? code;
}
