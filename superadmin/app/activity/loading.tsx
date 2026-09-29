export default function ActivityLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-4 w-32 bg-[var(--border)] rounded mb-3" />
          <div className="h-8 w-64 bg-[var(--border)] rounded mb-2" />
          <div className="h-4 w-96 max-w-full bg-[var(--border)] rounded" />
        </div>
        <div className="h-9 w-40 bg-[var(--border)] rounded-xl" />
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-9 w-48 bg-[var(--border)] rounded-lg" />
        <div className="h-9 w-full sm:w-64 bg-[var(--border)] rounded-xl" />
      </div>

      {/* Activity Timeline Skeleton */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--border)] shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 bg-[var(--border)] rounded" />
                <div className="h-4 w-16 bg-[var(--border)] rounded-full" />
              </div>
              <div className="h-3.5 w-3/4 bg-[var(--border)] rounded" />
              <div className="h-3 w-20 bg-[var(--border)] rounded font-mono" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
