import Link from 'next/link'
import { DotGrid } from './graphics'

// Civic site footer, rendered on every page via Layout.
export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-gray-200 bg-gradient-to-br from-ink to-ink-light text-white/80">
      <DotGrid opacity={0.07} gap={24} />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="inline-flex items-center gap-3 rounded-lg bg-white px-3 py-2">
            <img src="/egypt-coat-of-arms.svg" alt="Coat of arms of Egypt" width={30} height={41} className="h-10 w-auto" />
            <span className="border-l border-gray-300 pl-3 text-sm font-semibold uppercase tracking-wide text-brand">
              Open Data
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            The national gateway to open government data for the Arab Republic of Egypt. Discover,
            explore, and download datasets published by Egyptian ministries.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white">All datasets</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Egypt</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="https://digital.gov.eg" className="hover:text-white" target="_blank" rel="noreferrer">
                digital.gov.eg
              </a>
            </li>
            <li>
              <a
                href="https://egypt-odp.portaljs.com"
                className="hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                Data catalog (CKAN)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/55">
          © {new Date().getFullYear()}{' '}
          <a href="https://portaljs.com" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
            PortalJS
          </a>
          . Demo portal — not an official government website; data shown for demonstration only.
        </div>
      </div>
    </footer>
  )
}
