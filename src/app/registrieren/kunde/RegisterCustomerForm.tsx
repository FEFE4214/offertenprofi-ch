"use client";

import { useActionState } from "react";
import { registerCustomerAction, type ActionState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import { CANTONS } from "@/lib/cantons";

const initialState: ActionState = null;

const inputClass =
  "w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-primary-700";
const errorClass = "mt-1 text-xs text-red-600";

export default function RegisterCustomerForm() {
  const [state, formAction] = useActionState(registerCustomerAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label className={labelClass}>Vollständiger Name</label>
        <input name="name" required className={inputClass} placeholder="Anna Meier" />
        {state?.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name[0]}</p>}
      </div>
      <div>
        <label className={labelClass}>E-Mail</label>
        <input name="email" type="email" required className={inputClass} placeholder="ihre@email.ch" />
        {state?.fieldErrors?.email && <p className={errorClass}>{state.fieldErrors.email[0]}</p>}
      </div>
      <div>
        <label className={labelClass}>Passwort</label>
        <input name="password" type="password" required minLength={8} className={inputClass} placeholder="Mindestens 8 Zeichen" />
        {state?.fieldErrors?.password && <p className={errorClass}>{state.fieldErrors.password[0]}</p>}
      </div>
      <div>
        <label className={labelClass}>Telefon (optional)</label>
        <input name="phone" className={inputClass} placeholder="079 123 45 67" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>PLZ</label>
          <input name="plz" required maxLength={4} className={inputClass} placeholder="8001" />
          {state?.fieldErrors?.plz && <p className={errorClass}>{state.fieldErrors.plz[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Ort</label>
          <input name="city" required className={inputClass} placeholder="Zürich" />
          {state?.fieldErrors?.city && <p className={errorClass}>{state.fieldErrors.city[0]}</p>}
        </div>
      </div>
      <div>
        <label className={labelClass}>Kanton</label>
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
      <SubmitButton className="w-full">Konto erstellen</SubmitButton>
    </form>
  );
}
