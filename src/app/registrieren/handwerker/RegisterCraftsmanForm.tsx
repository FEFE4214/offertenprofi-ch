"use client";

import { useActionState } from "react";
import { registerCraftsmanAction, type ActionState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import { CANTONS } from "@/lib/cantons";
import type { InferSelectModel } from "drizzle-orm";
import type { categories as categoriesTable } from "@/db/schema";

const initialState: ActionState = null;

const inputClass =
  "w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-primary-700";
const errorClass = "mt-1 text-xs text-red-600";

export default function RegisterCraftsmanForm({
  categories,
}: {
  categories: InferSelectModel<typeof categoriesTable>[];
}) {
  const [state, formAction] = useActionState(registerCraftsmanAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Ihr Name</label>
          <input name="name" required className={inputClass} placeholder="Marco Bianchi" />
          {state?.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Firmenname</label>
          <input name="companyName" required className={inputClass} placeholder="Bianchi Malerei GmbH" />
          {state?.fieldErrors?.companyName && <p className={errorClass}>{state.fieldErrors.companyName[0]}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>E-Mail</label>
          <input name="email" type="email" required className={inputClass} placeholder="ihre@firma.ch" />
          {state?.fieldErrors?.email && <p className={errorClass}>{state.fieldErrors.email[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Passwort</label>
          <input name="password" type="password" required minLength={8} className={inputClass} placeholder="Mindestens 8 Zeichen" />
          {state?.fieldErrors?.password && <p className={errorClass}>{state.fieldErrors.password[0]}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>PLZ</label>
          <input name="plz" required maxLength={4} className={inputClass} placeholder="8004" />
        </div>
        <div>
          <label className={labelClass}>Ort</label>
          <input name="city" required className={inputClass} placeholder="Zürich" />
        </div>
        <div>
          <label className={labelClass}>Telefon</label>
          <input name="phone" className={inputClass} placeholder="078 123 45 67" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Hauptkanton</label>
          <select name="canton" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Bitte wählen
            </option>
            {CANTONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {state?.fieldErrors?.canton && <p className={errorClass}>{state.fieldErrors.canton[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Jahre Erfahrung (optional)</label>
          <input name="yearsExperience" type="number" min={0} max={60} className={inputClass} placeholder="10" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Kurzbeschreibung (optional)</label>
        <textarea
          name="bio"
          rows={3}
          className={inputClass}
          placeholder="Erzählen Sie kurz etwas über Ihren Betrieb und Ihre Spezialgebiete..."
        />
      </div>

      <fieldset>
        <legend className={labelClass}>Ihre Gewerke</legend>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-primary-200 p-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-primary-700">
              <input type="checkbox" name="categories" value={cat.id} className="h-4 w-4 rounded border-primary-300 text-accent-500" />
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
              <input type="checkbox" name="serviceAreas" value={c.code} className="h-4 w-4 rounded border-primary-300 text-accent-500" />
              {c.name}
            </label>
          ))}
        </div>
        {state?.fieldErrors?.serviceAreas && <p className={errorClass}>{state.fieldErrors.serviceAreas[0]}</p>}
      </fieldset>

      <SubmitButton className="w-full">Kostenloses Profil erstellen</SubmitButton>
    </form>
  );
}
