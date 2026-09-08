import "server-only";
import { eq, and, inArray, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  users,
  craftsmanProfiles,
  craftsmanCategories,
  craftsmanServiceAreas,
  categories,
  jobs,
  offers,
  reviews,
  leadUnlocks,
} from "@/db/schema";

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug));
  return row ?? null;
}

export async function getCategoryById(id: string) {
  const [row] = await db.select().from(categories).where(eq(categories.id, id));
  return row ?? null;
}

export async function getCraftsmanRating(craftsmanUserId: string) {
  const rows = await db.select().from(reviews).where(eq(reviews.craftsmanId, craftsmanUserId));
  if (rows.length === 0) return { avg: 0, count: 0 };
  const sum = rows.reduce((acc, r) => acc + r.rating, 0);
  return { avg: sum / rows.length, count: rows.length };
}

export async function getOpenJobCountByCategory(): Promise<Record<string, number>> {
  const rows = await db
    .select({ categoryId: jobs.categoryId, count: sql<number>`count(*)` })
    .from(jobs)
    .where(eq(jobs.status, "OPEN"))
    .groupBy(jobs.categoryId);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.categoryId] = Number(r.count);
  return map;
}

export type CraftsmanCardData = {
  userId: string;
  profileId: string;
  name: string;
  companyName: string | null;
  city: string;
  canton: string;
  bio: string | null;
  verified: boolean;
  yearsExperience: number | null;
  categorySlugs: string[];
  categoryNames: string[];
  rating: { avg: number; count: number };
};

async function buildCraftsmanCard(userId: string): Promise<CraftsmanCardData | null> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return null;
  const [profile] = await db
    .select()
    .from(craftsmanProfiles)
    .where(eq(craftsmanProfiles.userId, userId));
  if (!profile) return null;

  const catLinks = await db
    .select()
    .from(craftsmanCategories)
    .where(eq(craftsmanCategories.craftsmanProfileId, profile.id));
  const catIds = catLinks.map((c) => c.categoryId);
  const cats = catIds.length
    ? await db.select().from(categories).where(inArray(categories.id, catIds))
    : [];

  return {
    userId: user.id,
    profileId: profile.id,
    name: user.name,
    companyName: profile.companyName,
    city: user.city ?? "",
    canton: user.canton ?? "",
    bio: profile.bio,
    verified: profile.verified,
    yearsExperience: profile.yearsExperience,
    categorySlugs: cats.map((c) => c.slug),
    categoryNames: cats.map((c) => c.name),
    rating: await getCraftsmanRating(user.id),
  };
}

export async function searchCraftsmen(filters: {
  categorySlug?: string;
  canton?: string;
  minRating?: number;
}): Promise<CraftsmanCardData[]> {
  let profileIds: string[] | null = null;

  if (filters.categorySlug) {
    const cat = await getCategoryBySlug(filters.categorySlug);
    if (!cat) return [];
    const links = await db
      .select()
      .from(craftsmanCategories)
      .where(eq(craftsmanCategories.categoryId, cat.id));
    profileIds = links.map((l) => l.craftsmanProfileId);
    if (profileIds.length === 0) return [];
  }

  if (filters.canton) {
    const links = await db
      .select()
      .from(craftsmanServiceAreas)
      .where(eq(craftsmanServiceAreas.canton, filters.canton));
    const cantonProfileIds = new Set(links.map((l) => l.craftsmanProfileId));
    profileIds = profileIds
      ? profileIds.filter((id) => cantonProfileIds.has(id))
      : Array.from(cantonProfileIds);
    if (profileIds.length === 0) return [];
  }

  const allProfiles = profileIds
    ? await db.select().from(craftsmanProfiles).where(inArray(craftsmanProfiles.id, profileIds))
    : await db.select().from(craftsmanProfiles);

  const cards = (
    await Promise.all(allProfiles.map((p) => buildCraftsmanCard(p.userId)))
  ).filter((c): c is CraftsmanCardData => c !== null);

  const filtered = filters.minRating
    ? cards.filter((c) => c.rating.avg >= filters.minRating!)
    : cards;

  // Verified & higher rated first
  return filtered.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.rating.avg - a.rating.avg;
  });
}

export async function getCraftsmanDetail(userId: string) {
  const card = await buildCraftsmanCard(userId);
  if (!card) return null;
  const [profile] = await db
    .select()
    .from(craftsmanProfiles)
    .where(eq(craftsmanProfiles.userId, userId));
  const areaLinks = await db
    .select()
    .from(craftsmanServiceAreas)
    .where(eq(craftsmanServiceAreas.craftsmanProfileId, profile.id));
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  const craftsmanReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.craftsmanId, userId))
    .orderBy(desc(reviews.createdAt));
  const reviewsWithCustomer = await Promise.all(
    craftsmanReviews.map(async (r) => {
      const [customer] = await db.select().from(users).where(eq(users.id, r.customerId));
      return { ...r, customerName: customer?.name ?? "Kunde" };
    })
  );

  return {
    ...card,
    website: profile.website,
    avatarUrl: profile.avatarUrl,
    phone: user.phone,
    serviceAreas: areaLinks.map((a) => a.canton),
    reviews: reviewsWithCustomer,
  };
}

export async function getJobsForCustomer(customerId: string) {
  const rows = await db
    .select()
    .from(jobs)
    .where(eq(jobs.customerId, customerId))
    .orderBy(desc(jobs.createdAt));
  return Promise.all(
    rows.map(async (j) => {
      const cat = await getCategoryById(j.categoryId);
      const jobOffers = await db.select().from(offers).where(eq(offers.jobId, j.id));
      return { ...j, categoryName: cat?.name ?? "", categorySlug: cat?.slug ?? "", offerCount: jobOffers.length };
    })
  );
}

export async function getOpenJobsForCraftsman(craftsmanUserId: string) {
  const [profile] = await db
    .select()
    .from(craftsmanProfiles)
    .where(eq(craftsmanProfiles.userId, craftsmanUserId));
  if (!profile) return [];

  const catLinks = await db
    .select()
    .from(craftsmanCategories)
    .where(eq(craftsmanCategories.craftsmanProfileId, profile.id));
  const categoryIds = catLinks.map((c) => c.categoryId);
  if (categoryIds.length === 0) return [];

  const rows = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.status, "OPEN"), inArray(jobs.categoryId, categoryIds)))
    .orderBy(desc(jobs.createdAt));

  const myOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.craftsmanId, craftsmanUserId));
  const myOfferedJobIds = new Set(myOffers.map((o) => o.jobId));

  return Promise.all(
    rows.map(async (j) => {
      const cat = await getCategoryById(j.categoryId);
      const [customer] = await db.select().from(users).where(eq(users.id, j.customerId));
      return {
        ...j,
        categoryName: cat?.name ?? "",
        categorySlug: cat?.slug ?? "",
        customerName: customer?.name ?? "",
        alreadyOffered: myOfferedJobIds.has(j.id),
      };
    })
  );
}

export async function getJobDetail(jobId: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job) return null;
  const category = await getCategoryById(job.categoryId);
  const [customer] = await db.select().from(users).where(eq(users.id, job.customerId));
  const jobOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.jobId, jobId))
    .orderBy(desc(offers.createdAt));

  const offersWithCraftsman = await Promise.all(
    jobOffers.map(async (o) => {
      const [craftsman] = await db.select().from(users).where(eq(users.id, o.craftsmanId));
      const [profile] = await db
        .select()
        .from(craftsmanProfiles)
        .where(eq(craftsmanProfiles.userId, o.craftsmanId));
      return {
        ...o,
        craftsmanName: craftsman?.name ?? "",
        craftsmanCompany: profile?.companyName ?? null,
        craftsmanVerified: profile?.verified ?? false,
        craftsmanRating: await getCraftsmanRating(o.craftsmanId),
      };
    })
  );

  const [review] = await db.select().from(reviews).where(eq(reviews.jobId, jobId));

  return {
    job,
    category,
    customerName: customer?.name ?? "",
    offers: offersWithCraftsman,
    review: review ?? null,
  };
}

export async function getOffersForCraftsman(craftsmanUserId: string) {
  const rows = await db
    .select()
    .from(offers)
    .where(eq(offers.craftsmanId, craftsmanUserId))
    .orderBy(desc(offers.createdAt));
  return Promise.all(
    rows.map(async (o) => {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, o.jobId));
      const category = job ? await getCategoryById(job.categoryId) : null;
      return {
        ...o,
        jobTitle: job?.title ?? "",
        jobStatus: job?.status ?? "OPEN",
        jobCity: job?.city ?? "",
        jobCanton: job?.canton ?? "",
        categoryName: category?.name ?? "",
      };
    })
  );
}

export async function getCraftsmanCategoryIds(profileId: string) {
  const rows = await db
    .select()
    .from(craftsmanCategories)
    .where(eq(craftsmanCategories.craftsmanProfileId, profileId));
  return rows.map((c) => c.categoryId);
}

export async function getCraftsmanServiceAreaCodes(profileId: string) {
  const rows = await db
    .select()
    .from(craftsmanServiceAreas)
    .where(eq(craftsmanServiceAreas.craftsmanProfileId, profileId));
  return rows.map((c) => c.canton);
}

export async function getLeadUnlock(jobId: string, craftsmanUserId: string) {
  const [row] = await db
    .select()
    .from(leadUnlocks)
    .where(
      and(
        eq(leadUnlocks.jobId, jobId),
        eq(leadUnlocks.craftsmanId, craftsmanUserId),
        eq(leadUnlocks.status, "PAID")
      )
    );
  return row ?? null;
}

export async function getCustomerContact(customerId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, customerId));
  if (!user) return null;
  return { name: user.name, phone: user.phone, email: user.email };
}

export async function getPlatformStats() {
  const allCraftsmen = await db.select().from(craftsmanProfiles);
  const openJobs = await db.select().from(jobs).where(eq(jobs.status, "OPEN"));
  const completedJobs = await db.select().from(jobs).where(eq(jobs.status, "COMPLETED"));
  const allReviews = await db.select().from(reviews);
  const avgRating = allReviews.length
    ? allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length
    : 0;
  return {
    craftsmanCount: allCraftsmen.length,
    openJobsCount: openJobs.length,
    completedJobsCount: completedJobs.length,
    avgRating,
    reviewCount: allReviews.length,
  };
}
