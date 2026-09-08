const JOB_STATUS: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Offen", className: "bg-primary-50 text-primary-600" },
  IN_PROGRESS: { label: "In Bearbeitung", className: "bg-accent-50 text-accent-600" },
  COMPLETED: { label: "Abgeschlossen", className: "bg-success-100 text-success-500" },
  CANCELLED: { label: "Storniert", className: "bg-gray-100 text-gray-500" },
};

const OFFER_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Ausstehend", className: "bg-primary-50 text-primary-600" },
  ACCEPTED: { label: "Angenommen", className: "bg-success-100 text-success-500" },
  REJECTED: { label: "Abgelehnt", className: "bg-gray-100 text-gray-500" },
  WITHDRAWN: { label: "Zurückgezogen", className: "bg-gray-100 text-gray-500" },
};

export function JobStatusBadge({ status }: { status: string }) {
  const s = JOB_STATUS[status] ?? { label: status, className: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

export function OfferStatusBadge({ status }: { status: string }) {
  const s = OFFER_STATUS[status] ?? { label: status, className: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}
