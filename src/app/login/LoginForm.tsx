"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: ActionState = null;

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-primary-700">E-Mail</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none"
          placeholder="ihre@email.ch"
        />
        {state?.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-primary-700">Passwort</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none"
          placeholder="••••••••"
        />
        {state?.fieldErrors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>
      <SubmitButton className="w-full">Anmelden</SubmitButton>
    </form>
  );
}
