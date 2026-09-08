import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { requireUser, getCurrentCraftsmanProfile } from "@/lib/session";
import { getCategories, getCraftsmanCategoryIds, getCraftsmanServiceAreaCodes } from "@/lib/queries";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = { title: "Profil bearbeiten — Offertenprofi.ch" };

export default async function CraftsmanProfilePage() {
  const user = await requireUser("CRAFTSMAN");
  const profile = await getCurrentCraftsmanProfile();
  const categories = await getCategories();
  const selectedCategoryIds = profile ? await getCraftsmanCategoryIds(profile.id) : [];
  const selectedAreas = profile ? await getCraftsmanServiceAreaCodes(profile.id) : [];

  return (
    <div className="container-page py-12">
      <Link href="/dashboard/handwerker" className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-accent-600">
        <ArrowLeft size={14} /> Zurück zu den Aufträgen
      </Link>

      <div className="mx-auto mt-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-primary-800">Profil bearbeiten</h1>
        <p className="mt-1 text-sm text-primary-500">
          Ein vollständiges Profil erhöht Ihre Sichtbarkeit und die Chance, Aufträge zu gewinnen.
        </p>

        <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-7">
          <ProfileForm
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            selectedAreas={selectedAreas}
            defaultCompanyName={profile?.companyName ?? ""}
            defaultBio={profile?.bio ?? ""}
            defaultYearsExperience={profile?.yearsExperience ?? undefined}
            defaultWebsite={profile?.website ?? ""}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6 text-sm text-primary-500">
          <p>
            <span className="font-semibold text-primary-700">Konto:</span> {user.name} · {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
