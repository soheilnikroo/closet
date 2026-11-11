import { cn } from "@/shared/lib";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-md", className)} />;
}
export function PageSkeleton({
  variant = "outfit",
  label = "Loading",
}: {
  variant?: "outfit" | "grid" | "form" | "list" | "auth";
  label?: string;
}) {
  return (
    <div role="status" aria-label={label} className="space-y-5" aria-busy="true">
      <span className="sr-only">{label}</span>
      {variant === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((id) => (
            <div key={id} className="rounded-xl border border-outline-variant/40 p-3">
              <Skeleton className="aspect-square" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : variant === "form" || variant === "auth" ? (
        <div className="space-y-5 rounded-[28px] bg-surface-container-low p-6">
          <Skeleton className="h-7 w-3/5" />
          {[0, 1, 2].map((id) => (
            <div key={id}>
              <Skeleton className="mb-2 h-3 w-1/3" />
              <Skeleton className="h-14 w-full" />
            </div>
          ))}
          <Skeleton className="h-12 rounded-full" />
        </div>
      ) : variant === "list" ? (
        <>
          {[0, 1, 2].map((id) => (
            <div
              key={id}
              className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4"
            >
              <Skeleton className="size-14 shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="mt-3 h-3 w-1/2" />
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <Skeleton className="h-24 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
          </div>
          <div className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-4/5" />
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((id) => (
                <Skeleton key={id} className="h-28" />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-12 flex-1 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-full" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
