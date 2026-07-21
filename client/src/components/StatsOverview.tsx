import { StatCard } from './StatCard'

type StatsOverviewProps = {
  thoughts: number
  connections: number
  insights: number
}

export function StatsOverview({ thoughts, connections, insights }: StatsOverviewProps) {
  return (
    <section aria-labelledby="stats-heading">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2
          id="stats-heading"
          className="font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
        >
          Your journey so far
        </h2>
        <p className="text-sm text-[var(--color-muted)]">This session</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        <StatCard title="Thoughts Captured" value={thoughts} subtitle="Moments kept close" />
        <StatCard title="Connections Found" value={connections} subtitle="Ideas beginning to meet" />
        <StatCard title="Insights Generated" value={insights} subtitle="Reflections to revisit" />
      </div>
    </section>
  )
}
