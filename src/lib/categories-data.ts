// Static catalogue of trades (Gewerke) offered on the platform.
// icon refers to a lucide-react icon name.
export const CATEGORY_DATA = [
  {
    slug: "maler",
    name: "Maler & Gipser",
    icon: "PaintRoller",
    description: "Innen- und Aussenanstriche, Tapezierarbeiten, Gipserarbeiten",
  },
  {
    slug: "elektriker",
    name: "Elektriker",
    icon: "Zap",
    description: "Elektroinstallationen, Reparaturen, Smart-Home",
  },
  {
    slug: "sanitaer",
    name: "Sanitär & Installateur",
    icon: "Droplets",
    description: "Wasserinstallationen, Badumbau, Rohrreinigung",
  },
  {
    slug: "schreiner",
    name: "Schreiner & Zimmermann",
    icon: "Hammer",
    description: "Möbelbau, Holzarbeiten, Innenausbau",
  },
  {
    slug: "bodenleger",
    name: "Bodenleger",
    icon: "LayoutGrid",
    description: "Parkett, Laminat, PVC- und Teppichböden",
  },
  {
    slug: "dachdecker",
    name: "Dachdecker",
    icon: "Home",
    description: "Dachsanierung, Reparaturen, Spenglerarbeiten",
  },
  {
    slug: "gartenbau",
    name: "Gartenbau & Landschaftsbau",
    icon: "Trees",
    description: "Gartengestaltung, Pflege, Zäune, Pflästerungen",
  },
  {
    slug: "umzug",
    name: "Umzug & Transport",
    icon: "Truck",
    description: "Umzüge, Möbeltransport, Entsorgung",
  },
  {
    slug: "reinigung",
    name: "Reinigung",
    icon: "Sparkles",
    description: "Umzugsreinigung, Unterhaltsreinigung, Fensterreinigung",
  },
  {
    slug: "heizung",
    name: "Heizung & Klima",
    icon: "Thermometer",
    description: "Heizungsinstallation, Wartung, Wärmepumpen",
  },
  {
    slug: "kuechenbau",
    name: "Küchenbau",
    icon: "CookingPot",
    description: "Küchenplanung, Montage, Umbau",
  },
  {
    slug: "fliesenleger",
    name: "Fliesenleger",
    icon: "Grid3x3",
    description: "Plattenbeläge Bad, Küche und Aussenbereich",
  },
  {
    slug: "metallbau",
    name: "Metallbau & Schlosser",
    icon: "Wrench",
    description: "Geländer, Tore, Schlossarbeiten, Metallkonstruktionen",
  },
  {
    slug: "fensterbau",
    name: "Fenster & Türen",
    icon: "DoorClosed",
    description: "Fenstermontage, Türeneinbau, Storenbau",
  },
  {
    slug: "renovation",
    name: "Allgemeine Renovation",
    icon: "Building2",
    description: "Komplettrenovationen, Umbauten, Sanierungen",
  },
  {
    slug: "photovoltaik",
    name: "Photovoltaik & Solar",
    icon: "SunMedium",
    description: "Solaranlagen, Installation und Wartung",
  },
] as const;

export type CategorySlug = (typeof CATEGORY_DATA)[number]["slug"];
