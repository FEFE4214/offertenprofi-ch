import "./load-env";
import { db, pool } from "./index";
import {
  users,
  craftsmanProfiles,
  categories,
  craftsmanCategories,
  craftsmanServiceAreas,
  jobs,
  offers,
  reviews,
} from "./schema";
import { CATEGORY_DATA } from "@/lib/categories-data";
import { hashPassword } from "@/lib/auth";
import { newId } from "@/lib/ids";
import { eq } from "drizzle-orm";

async function main() {
  const force = process.argv.includes("--force");

  const existingCategories = await db.select().from(categories).limit(1);
  if (existingCategories.length > 0 && !force) {
    console.log(
      "Datenbank enthält bereits Daten — Seed wird übersprungen (nutze `tsx src/db/seed.ts --force`, um trotzdem neu zu seeden und alle Daten zu löschen)."
    );
    await pool.end();
    return;
  }

  console.log("Seeding database...");

  // Wipe existing data (order matters due to FK constraints)
  await db.delete(reviews);
  await db.delete(offers);
  await db.delete(jobs);
  await db.delete(craftsmanServiceAreas);
  await db.delete(craftsmanCategories);
  await db.delete(craftsmanProfiles);
  await db.delete(users);
  await db.delete(categories);

  // Categories
  const categoryIdBySlug = new Map<string, string>();
  for (const cat of CATEGORY_DATA) {
    const id = newId("cat");
    categoryIdBySlug.set(cat.slug, id);
    await db.insert(categories).values({
      id,
      slug: cat.slug,
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
    });
  }
  console.log(`  ${CATEGORY_DATA.length} Kategorien angelegt`);

  const demoPassword = await hashPassword("demo1234");

  // --- Demo customers ---
  const customerData = [
    { name: "Anna Meier", email: "anna.meier@example.ch", canton: "ZH", plz: "8001", city: "Zürich" },
    { name: "Peter Huber", email: "peter.huber@example.ch", canton: "BE", plz: "3011", city: "Bern" },
    { name: "Sofia Rossi", email: "sofia.rossi@example.ch", canton: "TI", plz: "6900", city: "Lugano" },
  ];
  const customerIds: string[] = [];
  for (const c of customerData) {
    const id = newId("usr");
    customerIds.push(id);
    await db.insert(users).values({
      id,
      email: c.email,
      passwordHash: demoPassword,
      role: "CUSTOMER",
      name: c.name,
      canton: c.canton,
      plz: c.plz,
      city: c.city,
      phone: "079 000 00 00",
    });
  }
  console.log(`  ${customerData.length} Demo-Kunden angelegt`);

  // --- Demo craftsmen ---
  const craftsmenData = [
    {
      name: "Marco Bianchi",
      email: "marco.bianchi@example.ch",
      canton: "ZH",
      plz: "8004",
      city: "Zürich",
      companyName: "Bianchi Malerei GmbH",
      bio: "Familienbetrieb seit 1998. Spezialisiert auf hochwertige Innen- und Aussenanstriche sowie Fassadensanierungen im Grossraum Zürich.",
      years: 26,
      categories: ["maler", "renovation"],
      areas: ["ZH", "AG", "ZG"],
      verified: true,
      rating: 5,
    },
    {
      name: "Stefan Keller",
      email: "stefan.keller@example.ch",
      canton: "BE",
      plz: "3006",
      city: "Bern",
      companyName: "Keller Elektro AG",
      bio: "Eidg. dipl. Elektroinstallateur. Von der Steckdose bis zum Smart Home – zuverlässig und termingerecht.",
      years: 15,
      categories: ["elektriker", "photovoltaik"],
      areas: ["BE", "SO", "FR"],
      verified: true,
      rating: 4,
    },
    {
      name: "Luca Ferrari",
      email: "luca.ferrari@example.ch",
      canton: "TI",
      plz: "6900",
      city: "Lugano",
      companyName: "Ferrari Sanitär & Heizung",
      bio: "Ihr Partner für Badumbauten, Rohrsanierungen und Heizungsinstallationen im Tessin.",
      years: 12,
      categories: ["sanitaer", "heizung"],
      areas: ["TI"],
      verified: true,
      rating: 5,
    },
    {
      name: "Reto Zimmermann",
      email: "reto.zimmermann@example.ch",
      canton: "SG",
      plz: "9000",
      city: "St. Gallen",
      companyName: "Zimmermann Schreinerei",
      bio: "Massgeschneiderte Möbel, Küchen und Innenausbau aus eigener Werkstatt.",
      years: 20,
      categories: ["schreiner", "kuechenbau"],
      areas: ["SG", "AR", "AI", "TG"],
      verified: false,
      rating: 4,
    },
    {
      name: "Nadia Suter",
      email: "nadia.suter@example.ch",
      canton: "VD",
      plz: "1003",
      city: "Lausanne",
      companyName: "Suter Jardins",
      bio: "Gartengestaltung und -pflege mit Leidenschaft. Von der Planung bis zur Umsetzung.",
      years: 9,
      categories: ["gartenbau"],
      areas: ["VD", "GE", "VS"],
      verified: true,
      rating: 5,
    },
    {
      name: "Thomas Baumann",
      email: "thomas.baumann@example.ch",
      canton: "LU",
      plz: "6003",
      city: "Luzern",
      companyName: "Baumann Bodenbeläge",
      bio: "Parkett, Laminat und Designböden – fachgerecht verlegt seit über 10 Jahren.",
      years: 11,
      categories: ["bodenleger", "fliesenleger"],
      areas: ["LU", "ZG", "NW", "OW"],
      verified: false,
      rating: 4,
    },
  ];

  const craftsmanUserIds: { userId: string; profileId: string; rating: number }[] = [];

  for (const cw of craftsmenData) {
    const userId = newId("usr");
    await db.insert(users).values({
      id: userId,
      email: cw.email,
      passwordHash: demoPassword,
      role: "CRAFTSMAN",
      name: cw.name,
      canton: cw.canton,
      plz: cw.plz,
      city: cw.city,
      phone: "078 000 00 00",
    });

    const profileId = newId("cwp");
    await db.insert(craftsmanProfiles).values({
      id: profileId,
      userId,
      companyName: cw.companyName,
      bio: cw.bio,
      yearsExperience: cw.years,
      verified: cw.verified,
    });

    for (const slug of cw.categories) {
      const categoryId = categoryIdBySlug.get(slug);
      if (!categoryId) continue;
      await db.insert(craftsmanCategories).values({ craftsmanProfileId: profileId, categoryId });
    }

    for (const canton of cw.areas) {
      await db.insert(craftsmanServiceAreas).values({ craftsmanProfileId: profileId, canton });
    }

    craftsmanUserIds.push({ userId, profileId, rating: cw.rating });
  }
  console.log(`  ${craftsmenData.length} Demo-Handwerker angelegt`);

  // --- Demo jobs ---
  const jobsData = [
    {
      customer: customerIds[0],
      category: "maler",
      title: "Wohnzimmer und Flur streichen (ca. 60m²)",
      description:
        "Wir möchten unser Wohnzimmer und den angrenzenden Flur neu streichen lassen. Wände sind in gutem Zustand, nur kleinere Ausbesserungen nötig. Wunschtermin: nächste 3 Wochen.",
      canton: "ZH",
      plz: "8001",
      city: "Zürich",
      budgetMin: 1500,
      budgetMax: 2500,
      status: "OPEN" as const,
    },
    {
      customer: customerIds[0],
      category: "elektriker",
      title: "Neue Steckdosen und Lichtschalter in der Küche",
      description:
        "Küche wird renoviert, es müssen 4 neue Steckdosen sowie 2 Lichtschalter gesetzt werden. Elektroplan liegt vor.",
      canton: "ZH",
      plz: "8001",
      city: "Zürich",
      budgetMin: 800,
      budgetMax: 1200,
      status: "OPEN" as const,
    },
    {
      customer: customerIds[1],
      category: "sanitaer",
      title: "Badezimmer komplett sanieren",
      description:
        "Kleines Bad (ca. 5m²) soll komplett saniert werden: neue Dusche, WC, Waschbecken. Fliesenarbeiten inklusive gewünscht.",
      canton: "BE",
      plz: "3011",
      city: "Bern",
      budgetMin: 8000,
      budgetMax: 15000,
      status: "OPEN" as const,
    },
    {
      customer: customerIds[2],
      category: "gartenbau",
      title: "Gartenpflege und Heckenschnitt",
      description: "Regelmässige Gartenpflege gesucht, monatlich. Rasen mähen, Hecke schneiden, Unkraut jäten.",
      canton: "TI",
      plz: "6900",
      city: "Lugano",
      budgetMin: 200,
      budgetMax: 400,
      status: "OPEN" as const,
    },
    {
      customer: customerIds[1],
      category: "schreiner",
      title: "Einbauschrank für Schlafzimmer",
      description: "Massgefertigter Einbauschrank für Dachschräge, ca. 3m breit. Weiss lackiert.",
      canton: "BE",
      plz: "3006",
      city: "Bern",
      budgetMin: 3000,
      budgetMax: 5000,
      status: "COMPLETED" as const,
    },
  ];

  const jobIds: string[] = [];
  for (const j of jobsData) {
    const id = newId("job");
    jobIds.push(id);
    const categoryId = categoryIdBySlug.get(j.category)!;
    await db.insert(jobs).values({
      id,
      customerId: j.customer,
      categoryId,
      title: j.title,
      description: j.description,
      canton: j.canton,
      plz: j.plz,
      city: j.city,
      budgetMin: j.budgetMin,
      budgetMax: j.budgetMax,
      status: j.status,
    });
  }
  console.log(`  ${jobsData.length} Demo-Aufträge angelegt`);

  // --- Demo offers on the first two open jobs ---
  const offerTargets = [
    { jobIndex: 0, craftsmanIndex: 0, price: 1900, message: "Gerne übernehmen wir diesen Auftrag. Wir arbeiten mit hochwertiger, geruchsarmer Farbe und können in 2 Tagen fertig sein." },
    { jobIndex: 2, craftsmanIndex: 2, price: 11500, message: "Wir haben Erfahrung mit genau solchen Badsanierungen und können in 3 Wochen starten. Kostenlose Besichtigung möglich." },
  ];
  for (const o of offerTargets) {
    await db.insert(offers).values({
      id: newId("off"),
      jobId: jobIds[o.jobIndex],
      craftsmanId: craftsmanUserIds[o.craftsmanIndex].userId,
      price: o.price,
      message: o.message,
      estimatedDuration: "2-3 Tage",
      status: "PENDING",
    });
  }

  // --- Demo completed job with accepted offer + review ---
  const completedJobId = jobIds[4];
  const completedCraftsman = craftsmanUserIds[3]; // Reto Zimmermann - schreiner
  const acceptedOfferId = newId("off");
  await db.insert(offers).values({
    id: acceptedOfferId,
    jobId: completedJobId,
    craftsmanId: completedCraftsman.userId,
    price: 4200,
    message: "Wir erstellen Ihnen gerne einen passgenauen Einbauschrank. Aufmass vor Ort inklusive.",
    estimatedDuration: "1 Woche",
    status: "ACCEPTED",
  });
  await db.update(jobs).set({ acceptedOfferId }).where(eq(jobs.id, completedJobId));
  await db.insert(reviews).values({
    id: newId("rev"),
    jobId: completedJobId,
    customerId: customerIds[1],
    craftsmanId: completedCraftsman.userId,
    rating: 5,
    comment: "Sehr sauberer Einbau, termingerecht und freundlich. Absolute Empfehlung!",
  });

  console.log("Seed abgeschlossen.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
