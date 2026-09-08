import {
  pgTable,
  text,
  integer,
  doublePrecision,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// ---------- Users ----------
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["CUSTOMER", "CRAFTSMAN", "ADMIN"] }).notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  canton: text("canton"),
  plz: text("plz"),
  city: text("city"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Craftsman profiles (1:1 with users where role = CRAFTSMAN) ----------
export const craftsmanProfiles = pgTable("craftsman_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name"),
  bio: text("bio"),
  yearsExperience: integer("years_experience"),
  website: text("website"),
  avatarUrl: text("avatar_url"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Categories (Gewerke) ----------
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("Wrench"),
  description: text("description"),
});

// ---------- Craftsman <-> Category (many to many) ----------
export const craftsmanCategories = pgTable(
  "craftsman_categories",
  {
    craftsmanProfileId: text("craftsman_profile_id")
      .notNull()
      .references(() => craftsmanProfiles.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.craftsmanProfileId, t.categoryId] }),
  })
);

// ---------- Craftsman <-> Service canton (many to many) ----------
export const craftsmanServiceAreas = pgTable(
  "craftsman_service_areas",
  {
    craftsmanProfileId: text("craftsman_profile_id")
      .notNull()
      .references(() => craftsmanProfiles.id, { onDelete: "cascade" }),
    canton: text("canton").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.craftsmanProfileId, t.canton] }),
  })
);

// ---------- Jobs (Auftraege) ----------
export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  canton: text("canton").notNull(),
  plz: text("plz").notNull(),
  city: text("city").notNull(),
  budgetMin: doublePrecision("budget_min"),
  budgetMax: doublePrecision("budget_max"),
  desiredDate: text("desired_date"),
  status: text("status", {
    enum: ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
  })
    .notNull()
    .default("OPEN"),
  acceptedOfferId: text("accepted_offer_id"),
  photos: text("photos"), // JSON-encoded array of URLs
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Offers (Angebote) ----------
export const offers = pgTable("offers", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  craftsmanId: text("craftsman_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  price: doublePrecision("price").notNull(),
  message: text("message").notNull(),
  estimatedDuration: text("estimated_duration"),
  status: text("status", {
    enum: ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"],
  })
    .notNull()
    .default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Reviews (Bewertungen) ----------
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .notNull()
    .unique()
    .references(() => jobs.id, { onDelete: "cascade" }),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  craftsmanId: text("craftsman_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
