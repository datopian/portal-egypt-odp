import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import ResponsiveGridWrapper from '../../components/responsiveGrid'
import Badge, { formatTone } from '../../components/Badge'
import { ckan, DMS } from '../../lib/ckan'

type ResourceView = {
  id: string
  name: string
  format: string
  url: string
  kind: 'table' | 'pdf' | 'other'
}
type DatasetView = {
  slug: string
  namespace: string
  title: string
  notes: string
  org: string
  modified: string
  created: string
  language: string
  coverage: string
  sources: string[]
  groups: { name: string; title: string }[]
  tags: string[]
  resources: ResourceView[]
}

const TABULAR = ['csv', 'tsv']

function resourceKind(format: string): ResourceView['kind'] {
  const f = format.toLowerCase()
  if (TABULAR.includes(f)) return 'table'
  if (f === 'pdf') return 'pdf'
  return 'other'
}

export const getServerSideProps: GetServerSideProps<{ dataset: DatasetView }> = async ({ params }) => {
  const namespace = String(params?.owner ?? '').replace(/^@/, '')
  const slug = String(params?.slug)
  try {
    const d = await ckan.getDatasetDetails(slug)
    const dataset: DatasetView = {
      slug: d.name,
      namespace,
      title: d.title || d.name,
      notes: d.notes || '',
      org: d.organization?.title || d.organization?.name || 'Egypt',
      modified: d.metadata_modified || '',
      created: d.metadata_created || '',
      language: d.language || '',
      coverage: d.coverage || '',
      sources: (Array.isArray(d.source) ? d.source : d.source ? [d.source] : []).filter(Boolean),
      groups: (d.groups || []).map((g) => ({ name: g.name || '', title: g.title || g.name || '' })).filter((g) => g.name),
      tags: (d.tags || []).map((t) => t.display_name || t.name || '').filter(Boolean),
      resources: (d.resources || []).map((r) => ({
        id: r.id,
        name: r.name || r.id,
        format: r.format || '',
        url: r.url || '',
        kind: resourceKind(r.format || ''),
      })),
    }
    return { props: { dataset } }
  } catch {
    return { notFound: true }
  }
}

function fmtDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DatasetPage({ dataset }: { dataset: DatasetView }) {
  const formats = Array.from(new Set(dataset.resources.map((r) => r.format.toUpperCase()).filter(Boolean)))
  const apiUrl = `${DMS}/api/3/action/package_show?id=${dataset.slug}`

  return (
    <>
      <Head>
        <title>{dataset.title} — Egypt Open Data Portal</title>
        {dataset.notes && <meta name="description" content={dataset.notes.slice(0, 160)} />}
      </Head>

      {/* header band */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-brand">Datasets</Link>
            <span className="mx-2">/</span>
            <Link href={`/search?dept=${encodeURIComponent(dataset.namespace)}`} className="hover:text-brand">
              {dataset.org}
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="navy">{dataset.org}</Badge>
            {formats.map((f) => (
              <Badge key={f} tone={formatTone(f)}>{f}</Badge>
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{dataset.title}</h1>
          {dataset.notes && (
            <p className="mt-3 max-w-3xl whitespace-pre-line text-gray-600">{dataset.notes}</p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_18rem]">
        {/* Main: resources */}
        <div className="min-w-0">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {dataset.resources.length} {dataset.resources.length === 1 ? 'Resource' : 'Resources'}
          </h2>
          {dataset.resources.length === 0 ? (
            <p className="text-gray-400">This dataset has no resources.</p>
          ) : (
            <div className="space-y-6">
              {dataset.resources.map((r) => (
                <section key={r.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3 className="min-w-0 break-words font-medium text-gray-800">{r.name}</h3>
                    {r.format && <Badge tone={formatTone(r.format)}>{r.format.toUpperCase()}</Badge>}
                  </div>
                    {r.url && (
                      <a
                        href={r.url}
                        className="shrink-0 rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark sm:px-3 sm:py-1.5"
                      >
                        Download
                      </a>
                    )}
                  </div>
                  <div className="p-5">
                    {r.kind === 'table' && r.url ? (
                      <ResponsiveGridWrapper dataUrl={r.url} />
                    ) : r.kind === 'pdf' && r.url ? (
                      <object data={r.url} type="application/pdf" className="h-[640px] w-full rounded-md border border-gray-200">
                        <p className="text-sm text-gray-500">
                          This browser can&rsquo;t display the PDF inline.{' '}
                          <a href={r.url} className="text-brand underline">Open the PDF</a>.
                        </p>
                      </object>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Preview isn&rsquo;t available for {r.format ? r.format.toUpperCase() : 'this format'}.{' '}
                        {r.url && <a href={r.url} className="text-brand underline">Download the file</a>} to view it.
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: metadata */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Details</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Ministry</dt>
                <dd className="mt-0.5 font-medium text-gray-800">{dataset.org}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Formats</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {formats.length ? (
                    formats.map((f) => <Badge key={f} tone={formatTone(f)}>{f}</Badge>)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Resources</dt>
                <dd className="mt-0.5 font-medium text-gray-800">{dataset.resources.length}</dd>
              </div>
              {dataset.coverage && (
                <div>
                  <dt className="text-gray-500">Time coverage</dt>
                  <dd className="mt-0.5 font-medium text-gray-800">{dataset.coverage}</dd>
                </div>
              )}
              {dataset.language && (
                <div>
                  <dt className="text-gray-500">Language</dt>
                  <dd className="mt-0.5 font-medium text-gray-800">
                    {dataset.language === 'EN' ? 'English' : dataset.language}
                  </dd>
                </div>
              )}
              {dataset.groups.length > 0 && (
                <div>
                  <dt className="text-gray-500">Themes</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {dataset.groups.map((g) => (
                      <Link
                        key={g.name}
                        href={`/search?group=${encodeURIComponent(g.name)}`}
                        className="rounded-full bg-brand-green/15 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-brand-green/25"
                      >
                        {g.title}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              {dataset.tags.length > 0 && (
                <div>
                  <dt className="text-gray-500">Tags</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {dataset.tags.map((t) => (
                      <span key={t} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {dataset.sources.length > 0 && (
                <div>
                  <dt className="text-gray-500">Source</dt>
                  <dd className="mt-1 space-y-1">
                    {dataset.sources.map((s) => (
                      <a
                        key={s}
                        href={s}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-brand hover:text-brand-dark"
                      >
                        {s.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Last updated</dt>
                <dd className="mt-0.5 font-medium text-gray-800">{fmtDate(dataset.modified)}</dd>
              </div>
              {dataset.created && (
                <div>
                  <dt className="text-gray-500">Published</dt>
                  <dd className="mt-0.5 font-medium text-gray-800">{fmtDate(dataset.created)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <a href={apiUrl} target="_blank" rel="noreferrer" className="block text-brand hover:text-brand-dark">
                API (JSON) &rarr;
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
