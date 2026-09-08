import { Star } from "lucide-react";

export default function StarRating({
  rating,
  count,
  size = 16,
  showCount = true,
}: {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= rounded;
          const half = !filled && i - 0.5 === rounded;
          return (
            <Star
              key={i}
              size={size}
              className={
                filled
                  ? "fill-accent-500 text-accent-500"
                  : half
                  ? "fill-accent-500/50 text-accent-500"
                  : "fill-transparent text-primary-200"
              }
            />
          );
        })}
      </span>
      {showCount && (
        <span className="text-sm text-primary-600">
          {count !== undefined && count > 0
            ? `${rating.toFixed(1)} (${count})`
            : "Noch keine Bewertungen"}
        </span>
      )}
    </span>
  );
}
