export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-2 w-14 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-2 w-20 rounded-full bg-muted" />
        <div className="h-3 w-16 rounded-full bg-muted mt-1" />
      </div>
    </div>
  );
}
export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
