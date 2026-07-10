import Head from 'next/head'
import Link from 'next/link'
import {
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  TableCellsIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { DotGrid, EgyptWatermark } from '../components/graphics'

const CATEGORIES = [
  {
    icon: BuildingLibraryIcon,
    title: 'Data by ministry',
    body: 'Datasets published by Egyptian government ministries — environment, finance, health and more — each with source, licence and coverage metadata.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Ask in Arabic or English',
    body: 'A conversational assistant answers natural-language questions over the catalogue in both Arabic and English, with answers traceable to their source dataset.',
  },
  {
    icon: TableCellsIcon,
    title: 'Open, downloadable formats',
    body: 'Every dataset is previewable in the browser and downloadable in open formats, with a machine-readable API for reuse.',
  },
]

export default function About() {
  return (
    <>
      <Head>
        <title>About — Egypt Open Data Portal</title>
        <meta name="description" content="About the Egypt Open Data Portal — the national gateway to open government data." />
      </Head>

      {/* Header band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
        <DotGrid opacity={0.1} gap={24} />
        <EgyptWatermark className="-right-12 -top-10 h-[180%] w-auto" opacity={0.07} />
        <div className="relative mx-auto max-w-4xl px-4 py-16">
          <nav className="mb-3 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </nav>
          <h1 className="text-4xl font-bold">Open government, by default</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            The Egypt Open Data Portal is the national gateway to open government data —
            bringing datasets from across Egyptian ministries into one searchable, open,
            and downloadable home.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14">
        {/* Mission */}
        <section className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Our commitment</h2>
          <p className="text-gray-600">
            Egypt is committed to open government and data transparency. This portal gives
            citizens, researchers, and businesses a single, searchable home for the data behind
            how the country is run — from the national budget to public-health indicators — so
            anyone can explore, download, and build on it.
          </p>
        </section>

        {/* What's here */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">What you&rsquo;ll find</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-5">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="mt-1.5 text-base text-gray-500 sm:text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
            <ArrowPathIcon className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900">How this portal works</h2>
          <p className="mt-3 text-gray-600">
            Datasets are served live from the national open data catalogue (built on CKAN).
            Search and dataset pages read directly from that catalogue, so what you see here
            stays in step with what ministries publish. Every dataset links back to its
            original record and a machine-readable API endpoint.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-md bg-brand px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark sm:text-sm"
            >
              Browse datasets
            </Link>
            <a
              href="https://egypt-odp.portaljs.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-gray-300 px-5 py-2.5 text-base font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand sm:text-sm"
            >
              Open data catalogue (CKAN)
            </a>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Questions or feedback?</h2>
          <p className="mt-3 text-gray-600">
            Looking for data that isn&rsquo;t here, or have a question about a dataset? Reach the
            government through{' '}
            <a href="https://digital.gov.eg" target="_blank" rel="noreferrer" className="text-brand underline hover:text-brand-dark">
              digital.gov.eg
            </a>
            .
          </p>
        </section>
      </div>
    </>
  )
}
