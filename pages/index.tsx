import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import {
  ckan,
  toCard,
  departmentCounts,
  getAllThemes,
  fetchResourceText,
  ORG_FILTER,
  GROUP_FILTER,
  MAX_DATASETS,
  type DatasetCard as Card,
  type Department,
} from '../lib/ckan'
import Hero, { type HeroStat } from '../components/Hero'
import type { ChartSpec } from '../components/BudgetChart'
import DatasetCard from '../components/DatasetCard'
import DepartmentCard from '../components/DepartmentCard'
import SectionHeading from '../components/SectionHeading'
import { DotGrid, EgyptWatermark } from '../components/graphics'

const SUGGESTED_QUERIES = ['air quality', 'population', 'health indicators', 'state budget']

// Bar color tuned to read against the hero panel (soft gold).
const C_HERO = '#e6b980'
const C_COUNT = '#e6b980'

// The dataset behind the hero chart: public investment over time (Ministry of
// Planning & Economic Development). The chart names the source; the viewer reads
// the trend.
const HERO_SLUG = 'public-investments'
const HERO_ORG = 'ministry-of-finance'

// Drop the shared "Ministry of " prefix so the fallback chart/labels read as
// "Environment", "Health", "Finance" rather than three identical "Ministry"s.
function shortDept(title: string): string {
  return title.replace(/^Ministry of\s+/i, '').trim()
}

// A fiscal-year string is stored "endYear/startYear" (e.g. "2021/2020"). Show it
// chronologically as "FY20/21".
function fyLabel(year: string): string {
  const [end, start] = year.split('/')
  if (!start) return year
  return `FY${start.slice(-2)}/${end.slice(-2)}`
}

// Public investment (billion EGP) per fiscal year, parsed from the CKAN resource
// CSV. `title` is the dataset's own title — shown as the chart heading. Source
// figures are in million EGP; converted to billions for a cleaner axis.
type HeroTrend = { labels: string[]; values: number[]; title: string } | null

async function getHeroTrend(): Promise<HeroTrend> {
  try {
    const pkg = await ckan.getDatasetDetails(HERO_SLUG)
    const url = (pkg.resources || []).find((r) => (r.format || '').toLowerCase() === 'csv')?.url
    const text = url ? await fetchResourceText(url) : null
    if (!text) return null
    const lines = text.trim().split(/\r?\n/)
    const header = lines[0].split(',')
    const yi = header.indexOf('Year')
    const vi = header.indexOf('Total Public Investments')
    if (yi < 0 || vi < 0) return null
    const byYear = new Map<string, number>()
    for (const line of lines.slice(1)) {
      const c = line.split(',')
      if (!c[yi]) continue
      byYear.set(c[yi], (parseFloat(c[vi]) || 0) / 1000) // million → billion EGP
    }
    const years = Array.from(byYear.keys()).sort() // "endYear/startYear" sorts chronologically
    if (years.length === 0) return null
    return {
      labels: years.map(fyLabel),
      values: years.map((y) => Math.round((byYear.get(y) as number) * 10) / 10),
      title: pkg.title || pkg.name || 'Public Investments',
    }
  } catch {
    return null
  }
}

type Props = {
  total: number
  departments: Department[]
  themeCount: number
  recent: Card[]
  hero: HeroTrend
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { datasets, count } = await ckan.packageSearch({
    offset: 0,
    limit: MAX_DATASETS,
    tags: [],
    orgs: ORG_FILTER,
    groups: GROUP_FILTER,
  })
  const cards = datasets.map(toCard)
  const departments = departmentCounts(cards)
  const recent = [...cards]
    .sort((a, b) => (b.modified || '').localeCompare(a.modified || ''))
    .slice(0, 6)
  const themeCount = (await getAllThemes()).length
  const hero = await getHeroTrend()
  return { props: { total: count, departments, themeCount, recent, hero } }
}

export default function Home({ total, departments, themeCount, recent, hero }: Props) {
  // Hero visual: the featured dataset's trend when it parses; otherwise fall back
  // to a datasets-per-ministry bar chart so the hero is never empty.
  const chart: ChartSpec = hero
    ? {
        categories: hero.labels,
        series: [{ label: 'Public investment', color: C_HERO, values: hero.values }],
        unitSuffix: ' bn',
      }
    : {
        categories: departments.slice(0, 6).map((d) => shortDept(d.title)),
        series: [{ label: 'Datasets', color: C_COUNT, values: departments.slice(0, 6).map((d) => d.count) }],
      }

  const stats: HeroStat[] = [
    { value: String(total), label: 'Datasets' },
    { value: String(departments.length), label: 'Ministries' },
    { value: String(themeCount), label: 'Themes' },
  ]

  return (
    <>
      <Head>
        <title>Egypt Open Data Portal</title>
        <meta
          name="description"
          content="The national gateway to open government data for the Arab Republic of Egypt — بوابة البيانات المفتوحة المصرية."
        />
      </Head>

      <Hero
        title="Egypt Open Data Portal"
        description="بوابة البيانات المفتوحة المصرية — the national gateway to open government data. Discover, explore, and download datasets published by Egyptian ministries."
        suggestedQueries={SUGGESTED_QUERIES}
        stats={stats}
        chart={chart}
        chartTitle={hero ? hero.title : 'Datasets by ministry'}
        chartSubtitle={hero ? `EGP billion · ${hero.labels[0]}–${hero.labels[hero.labels.length - 1]}` : undefined}
        chartSourceHref={hero ? `/@${HERO_ORG}/${HERO_SLUG}` : undefined}
        chartSourceName={hero ? hero.title : undefined}
      />

      {/* Browse by ministry */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          title="Browse by ministry"
          subtitle="Datasets grouped by the government ministry that publishes them."
          linkHref="/departments"
          linkLabel="All ministries"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <DepartmentCard key={d.namespace} dept={d} />
          ))}
        </div>
      </section>

      {/* Recently updated */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="Recently updated" linkHref="/search" linkLabel="All datasets" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((d) => (
              <DatasetCard key={`${d.namespace}/${d.slug}`} dataset={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Open-government callout */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sand-50 via-sand-100 to-sand-200 px-8 py-12 text-gray-900 shadow-xl shadow-black/5 ring-1 ring-sand-300/60 sm:px-12">
          <DotGrid color="#1c1c1c" opacity={0.04} gap={24} />
          <EgyptWatermark className="-right-10 -top-12 h-[170%] w-auto" fill="#9e1b32" opacity={0.05} />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Open data for an open government</h2>
            <p className="mt-3 text-gray-600">
              Datasets from across Egyptian ministries — environment, finance, health and more —
              published as open, downloadable records, served live and answerable in both Arabic
              and English.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-md bg-brand px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark sm:text-sm"
              >
                Explore datasets
              </Link>
              <Link
                href="/departments"
                className="rounded-md border border-gray-300 px-5 py-2.5 text-base font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand sm:text-sm"
              >
                Browse ministries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
