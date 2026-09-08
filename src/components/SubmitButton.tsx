"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  children,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "accent" | "outline";
}) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70";
  const variants: Record<string, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    accent: "bg-accent-500 text-white hover:bg-accent-600",
    outline: "border border-primary-300 text-primary-700 hover:bg-primary-50",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
