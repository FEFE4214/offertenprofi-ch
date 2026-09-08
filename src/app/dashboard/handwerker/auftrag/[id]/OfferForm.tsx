"use client";

import { useActionState } from "react";
import { submitOfferAction } from "@/app/actions/offers";
import type { ActionState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: ActionState = null;

const inputClass =
  "w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-primary-700";
const errorClass = "mt-1 text-xs text-red-600";

export default function OfferForm({ jobId }: { jobId: string }) {
  const [state, formAction] = useActionState(submitOfferAction, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <div>
        <label className={labelClass}>Ihr Preis (CHF)</label>
        <input name="price" type="number" min={1} step="0.05" required className={inputClass} placeholder="1900" />
        {state?.fieldErrors?.price && <p className={errorClass}>{state.fieldErrors.price[0]}</p>}
      </div>

      <div>
        <label className={labelClass}>Nachricht an den Kunden</label>
        <textarea
          name="message"
          required
          rows={4}
          className={inputClass}
          placeholder="Beschreiben Sie kurz, wie Sie den Auftrag umsetzen würden..."
        />
        {state?.fieldErrors?.message && <p className={errorClass}>{state.fieldErrors.message[0]}</p>}
      </div>

      <div>
        <label className={labelClass}>Geschätzte Dauer (optional)</label>
        <input name="estimatedDuration" className={inputClass} placeholder="z.B. 2-3 Tage" />
      </div>

      <SubmitButton className="w-full" variant="accent">
        Angebot abgeben
      </SubmitButton>
    </form>
  );
}
