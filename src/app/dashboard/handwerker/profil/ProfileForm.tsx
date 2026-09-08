"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/craftsman";
import type { ActionState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import { CANTONS } from "@/lib/cantons";
import type { InferSelectModel } from "drizzle-orm";
import type { categories as categoriesTable } from "@/db/schema";

const initialState: ActionState = null;

const inputClass =
  "w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-primary-700";
const errorClass = "mt-1 text-xs text-red-600";

export default function ProfileForm({
  categories,
  selectedCategoryIds,
  selectedAreas,
  defaultCompanyName,
  defaultBio,
  defaultYearsExperience,
  defaultWebsite,
}: {
  categories: InferSelectModel<typeof categoriesTable>[];
  selectedCategoryIds: string[];
  selectedAreas: string[];
  defaultCompanyName: string;
  defaultBio: string;
  defaultYearsExperience?: number;
  defaultWebsite: string;
}) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  const isSuccess = state?.error === "__success__";

  return (
    <form action={formAction} className="space-y-5">
      {isSuccess && (
        <p className="rounded-lg bg-success-100 px-4 py-2.5 text-sm text-success-500">
          Profil erfolgreich gespeichert.
        </p>
      )}
      {state?.error && !isSuccess && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <div>
        <label className={labelClass}>Firmenname</label>
        <input name="companyName" defaultValue={defaultCompanyName} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Kurzbeschreibung</label>
        <textarea name="bio" rows={4} defaultValue={defaultBio} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Jahre Erfahrung</label>
          <input
            name="yearsExperience"
            type="number"
            min={0}
            max={60}
            defaultValue={defaultYearsExperience ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Webseite (optional)</label>
          <input name="website" type="url" defaultValue={defaultWebsite} className={inputClass} placeholder="https://..." />
          {state?.fieldErrors?.website && <p className={errorClass}>{state.fieldErrors.website[0]}</p>}
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Ihre Gewerke</legend>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-primary-200 p-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-primary-700">
              <input
                type="checkbox"
                name="categories"
                value={cat.id}
                defaultChecked={selectedCategoryIds.includes(cat.id)}
                className="h-4 w-4 rounded border-primary-300 text-accent-500"
              />
              {cat.name}
            </label>
          ))}
        </div>
        {state?.fieldErrors?.categories && <p className={errorClass}>{state.fieldErrors.categories[0]}</p>}
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Einsatzkantone</legend>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-primary-200 p-3 sm:grid-cols-3">
          {CANTONS.map((c) => (
            <label key={c.code} className="flex items-center gap-2 text-sm text-primary-700">
              <input
                type="checkbox"
                name="serviceAreas"
                value={c.code}
                defaultChecked={selectedAreas.includes(c.code)}
                className="h-4 w-4 rounded border-primary-300 text-accent-500"
              />
              {c.name}
            </label>
          ))}
        </div>
        {state?.fieldErrors?.serviceAreas && <p className={errorClass}>{state.fieldErrors.serviceAreas[0]}</p>}
      </fieldset>

      <SubmitButton>Speichern</SubmitButton>
    </form>
  );
}
