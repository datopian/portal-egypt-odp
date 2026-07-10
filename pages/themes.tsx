import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import { getAllThemes, type Theme } from '../lib/ckan'
import DepartmentCard from '../components/DepartmentCard'

type Props = { themes: Theme[]; total: number }

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const themes = await getAllThemes()
  const total = themes.reduce((sum, t) => sum + t.count, 0)
  return { props: { themes, total } }
}

export default function Themes({ themes, total }: Props) {
  return (
    <>
      <Head>
        <title>Themes — Egypt Open Data Portal</title>
      </Head>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Themes</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
          <p className="mt-1 max-w-2xl text-base text-gray-500 sm:text-sm">
            Open data grouped by subject — {total} dataset entries across {themes.length} themes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href="/search"
              className="rounded-full border border-gray-200 px-3.5 py-1.5 font-medium text-brand hover:border-brand hover:bg-brand/5 sm:px-3 sm:py-1"
            >
              All datasets →
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <DepartmentCard key={t.namespace} dept={t} param="group" />
          ))}
        </div>
      </div>
    </>
  )
}
