type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  isLoading?: boolean
}

export function StatCard({ title, value, subtitle, isLoading = false }: StatCardProps) {
  return (
    <article className="flex min-h-36 flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-200 motion-safe:md:hover:-translate-y-0.5 motion-safe:md:hover:shadow-[var(--shadow-hover)] sm:p-6">
      <p className="text-sm font-medium text-[var(--color-muted)]">{title}</p>

      <div className="mt-5">
        {isLoading ? (
          <div
            className="h-9 w-16 animate-pulse rounded-lg bg-[var(--color-accent)]/60"
            role="status"
            aria-label={`Loading ${title}`}
          />
        ) : (
          <p className="font-display text-4xl font-semibold leading-none tracking-tight text-[var(--color-text)]">
            {value}
          </p>
        )}

        <p className="mt-2 min-h-5 text-sm text-[var(--color-muted)]">
          {subtitle ?? ''}
        </p>
      </div>
    </article>
  )
}
