export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-2 w-16 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-2 w-24 rounded-full bg-muted" />
        <div className="h-3 w-20 rounded-full bg-muted mt-1" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="app-shell px-4 pt-4 space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-full bg-muted" />
      <div className="h-48 rounded-2xl bg-muted" />
      <SkeletonList count={4} />
    </div>
  );
}
