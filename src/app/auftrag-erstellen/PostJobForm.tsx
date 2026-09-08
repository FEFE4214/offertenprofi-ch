"use client";

import { useActionState } from "react";
import { postJobAction } from "@/app/actions/jobs";
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

export default function PostJobForm({
  categories,
  defaultCategoryId,
  defaultCanton,
  defaultPlz,
  defaultCity,
}: {
  categories: InferSelectModel<typeof categoriesTable>[];
  defaultCategoryId?: string;
  defaultCanton?: string | null;
  defaultPlz?: string | null;
  defaultCity?: string | null;
}) {
  const [state, formAction] = useActionState(postJobAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <div>
        <label className={labelClass}>Kategorie</label>
        <select name="categoryId" required defaultValue={defaultCategoryId ?? ""} className={inputClass}>
          <option value="" disabled>
            Bitte wählen
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.categoryId && <p className={errorClass}>{state.fieldErrors.categoryId[0]}</p>}
      </div>

      <div>
        <label className={labelClass}>Titel des Auftrags</label>
        <input name="title" required className={inputClass} placeholder="z.B. Badezimmer sanieren" />
        {state?.fieldErrors?.title && <p className={errorClass}>{state.fieldErrors.title[0]}</p>}
      </div>

      <div>
        <label className={labelClass}>Beschreibung</label>
        <textarea
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder="Beschreiben Sie Ihr Projekt möglichst genau: Umfang, gewünschter Zeitrahmen, Besonderheiten..."
        />
        {state?.fieldErrors?.description && <p className={errorClass}>{state.fieldErrors.description[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>PLZ</label>
          <input name="plz" required maxLength={4} defaultValue={defaultPlz ?? ""} className={inputClass} placeholder="8001" />
        </div>
        <div>
          <label className={labelClass}>Ort</label>
          <input name="city" required defaultValue={defaultCity ?? ""} className={inputClass} placeholder="Zürich" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Kanton</label>
        <select name="canton" required defaultValue={defaultCanton ?? ""} className={inputClass}>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Budget von (CHF, optional)</label>
          <input name="budgetMin" type="number" min={0} className={inputClass} placeholder="1000" />
        </div>
        <div>
          <label className={labelClass}>Budget bis (CHF, optional)</label>
          <input name="budgetMax" type="number" min={0} className={inputClass} placeholder="2500" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Wunschtermin (optional)</label>
        <input name="desiredDate" type="date" className={inputClass} />
      </div>

      <SubmitButton className="w-full" variant="accent">
        Auftrag kostenlos veröffentlichen
      </SubmitButton>
    </form>
  );
}
