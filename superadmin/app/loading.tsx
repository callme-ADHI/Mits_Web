export default function DirectoryLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="h-4 w-40 bg-[var(--border)] rounded-md mb-3" />
        <div className="h-8 w-80 bg-[var(--border)] rounded-md mb-2" />
        <div className="h-4 w-full max-w-xl bg-[var(--border)] rounded-md" />
      </div>

      {/* 4 Stat KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-24 bg-[var(--border)] rounded" />
              <div className="w-8 h-8 rounded-lg bg-[var(--border)]" />
            </div>
            <div className="h-9 w-16 bg-[var(--border)] rounded mb-2" />
            <div className="h-3 w-32 bg-[var(--border)] rounded" />
          </div>
        ))}
      </div>

      {/* Table Section Skeleton */}
      <div className="space-y-4">
        {/* Search bar & filter pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-[var(--border)] rounded-lg" />
            <div className="h-8 w-20 bg-[var(--border)] rounded-lg" />
            <div className="h-8 w-24 bg-[var(--border)] rounded-lg" />
          </div>
          <div className="h-9 w-full sm:w-64 bg-[var(--border)] rounded-lg" />
        </div>

        {/* Hairline Table Skeleton */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
          <div className="h-10 bg-[var(--surface)] border-b border-[var(--border)]" />
          <div className="divide-y divide-[var(--border)]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[var(--border)]" />
                  <div>
                    <div className="h-4 w-36 bg-[var(--border)] rounded mb-1.5" />
                    <div className="h-3 w-20 bg-[var(--border)] rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
                <div className="h-4 w-12 bg-[var(--border)] rounded" />
                <div className="h-4 w-12 bg-[var(--border)] rounded" />
                <div className="h-3 w-24 bg-[var(--border)] rounded" />
                <div className="h-6 w-16 bg-[var(--border)] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
