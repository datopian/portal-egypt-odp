import Link from 'next/link'
import SearchBar from './SearchBar'
import BudgetChart, { type ChartSpec } from './BudgetChart'
import { DotGrid, EgyptWatermark } from './graphics'

export type HeroStat = { value: string; label: string }

// Civic hero: navy band. Left = wordmark + subhead + search + chips + stats.
// Right = a featured data visualization (the General Fund budget by default).
export default function Hero({
  title,
  description,
  suggestedQueries,
  stats,
  chart,
  chartTitle,
  chartSubtitle,
  chartSourceHref,
  chartSourceName,
}: {
  title: string
  description: string
  suggestedQueries: string[]
  stats: HeroStat[]
  chart: ChartSpec
  chartTitle: string
  chartSubtitle?: string
  chartSourceHref?: string
  chartSourceName?: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 via-sand-100 to-sand-200 text-gray-900">
      {/* layered background: soft warm glow + dotted grid + pyramids watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 60% at 88% 8%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%), radial-gradient(45% 55% at 3% 99%, rgba(158,27,50,0.05) 0%, rgba(158,27,50,0) 55%)',
        }}
      />
      <DotGrid color="#1c1c1c" opacity={0.04} gap={24} />
      <EgyptWatermark className="-bottom-16 -left-16 h-[150%] w-auto" fill="#9e1b32" opacity={0.05} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left: copy + search */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Arab Republic of Egypt
          </p>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">{description}</p>

          <div className="mt-7 max-w-md">
            <SearchBar placeholder="Search datasets" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQueries.map((q) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-gray-300 bg-white/50 px-3.5 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-white sm:px-3 sm:py-1"
              >
                {q}
              </Link>
            ))}
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 sm:gap-x-10">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-3xl font-bold text-gray-900 sm:text-2xl">{s.value}</dt>
                <dd className="text-base text-gray-500 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: featured chart */}
        <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-black/10 ring-1 ring-gray-200/70">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-gray-900">{chartTitle}</h2>
            {chartSubtitle && <span className="text-xs text-gray-500">{chartSubtitle}</span>}
          </div>
          <BudgetChart {...chart} theme="light" />
          {chartSourceHref && chartSourceName && (
            <Link
              href={chartSourceHref}
              className="mt-2 inline-block text-sm font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
            >
              Source: {chartSourceName} &rarr;
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
