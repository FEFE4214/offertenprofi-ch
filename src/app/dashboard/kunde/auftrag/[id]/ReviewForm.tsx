"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReviewAction } from "@/app/actions/reviews";
import type { ActionState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: ActionState = null;

export default function ReviewForm({ jobId }: { jobId: string }) {
  const [state, formAction] = useActionState(submitReviewAction, initialState);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      {state?.error && state.error !== "__success__" && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-primary-700">Ihre Bewertung</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
              aria-label={`${i} Sterne`}
            >
              <Star
                size={26}
                className={
                  i <= (hover || rating)
                    ? "fill-accent-500 text-accent-500"
                    : "fill-transparent text-primary-200"
                }
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-primary-700">Kommentar (optional)</label>
        <textarea
          name="comment"
          rows={3}
          className="w-full rounded-lg border border-primary-200 px-3.5 py-2.5 text-sm text-primary-800 focus:border-accent-400 focus:outline-none"
          placeholder="Wie war Ihre Erfahrung?"
        />
      </div>

      <SubmitButton variant="accent">Bewertung abgeben</SubmitButton>
    </form>
  );
}
