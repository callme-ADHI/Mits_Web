export default function OrgDetailLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Return link shimmer */}
      <div className="h-8 w-44 bg-[var(--surface)] border border-[var(--border)] rounded-lg" />

      {/* Hero Dossier Card Skeleton */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[var(--border)] shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-48 bg-[var(--border)] rounded" />
                <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
              </div>
              <div className="h-3 w-28 bg-[var(--border)] rounded" />
            </div>
          </div>
          <div className="h-8 w-36 bg-[var(--border)] rounded-lg" />
        </div>

        {/* 3 Metric Pills Skeleton */}
        <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-7 w-12 bg-[var(--border)] rounded mb-1" />
              <div className="h-3 w-20 bg-[var(--border)] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Columns Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Column */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <div className="h-5 w-32 bg-[var(--border)] rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-[var(--bg)] border border-[var(--border)] p-3" />
            ))}
          </div>
        </div>

        {/* Achievements Column */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <div className="h-5 w-36 bg-[var(--border)] rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-[var(--bg)] border border-[var(--border)] p-3" />
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log Skeleton */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="h-5 w-40 bg-[var(--border)] rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-[var(--bg)] border border-[var(--border)]" />
          ))}
        </div>
      </div>
    </div>
  )
}
