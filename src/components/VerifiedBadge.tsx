import { ShieldCheck } from "lucide-react";

export default function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-1 text-xs font-medium text-success-500 ${className ?? ""}`}
    >
      <ShieldCheck size={14} />
      Verifiziert
    </span>
  );
}
